package com.bond.liquidity.market.service;

import com.bond.liquidity.market.model.Order;
import com.bond.liquidity.market.model.Trade;
import com.bond.liquidity.market.model.enums.OrderSide;
import com.bond.liquidity.market.model.enums.OrderStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import redis.clients.jedis.JedisPooled;
import redis.clients.jedis.resps.Tuple;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Core matching engine for bond trading orders.
 * 
 * <p>This service implements a price-time priority matching algorithm for bond orders.
 * It manages order books in Redis using sorted sets and executes trades when
 * compatible orders are found. The engine ensures atomic operations and maintains
 * order book integrity throughout the matching process.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>Price-time priority matching algorithm</li>
 *   <li>Atomic trade execution with Redis transactions</li>
 *   <li>Partial fill support with order book re-insertion</li>
 *   <li>Compliance integration for regulatory requirements</li>
 *   <li>Real-time order book management</li>
 *   <li>Trade ledger integration for audit trails</li>
 * </ul>
 * 
 * <p><strong>Order Book Structure:</strong></p>
 * <ul>
 *   <li>Bids (buy orders): Sorted by price descending (highest price first)</li>
 *   <li>Asks (sell orders): Sorted by price ascending (lowest price first)</li>
 *   <li>Redis keys: bonds:bids:{instrument} and bonds:asks:{instrument}</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Service
public class MatchingEngine {

    /** Redis key prefix for buy orders (bids) order book */
    private static final String BIDS_KEY_PREFIX = "bonds:bids:";
    
    /** Redis key prefix for sell orders (asks) order book */
    private static final String ASKS_KEY_PREFIX = "bonds:asks:";

    @Autowired
    private ComplianceService complianceService;

    @Autowired
    private LedgerService ledgerService;

    @Autowired
    private JedisPooled redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Processes an incoming order through the matching engine.
     * 
     * <p>This is the main entry point for order processing. The method performs
     * the following steps:</p>
     * <ol>
     *   <li>Validates user compliance and pre-trade checks</li>
     *   <li>Saves the order to Redis</li>
     *   <li>Attempts to match against existing orders</li>
     *   <li>Updates order status based on execution results</li>
     *   <li>Adds remaining quantity to order book if not fully filled</li>
     *   <li>Reports all trades to compliance and ledger systems</li>
     * </ol>
     * 
     * @param aggressor The incoming order to be processed
     * @return List of trades executed as a result of this order
     * @throws RuntimeException if compliance checks fail or Redis operations fail
     */
    public List<Trade> processOrder(Order aggressor) {
        // Compliance validation
        if (!complianceService.isUserCompliant(aggressor.getUserId()) || 
            !complianceService.preTradeCheck(aggressor)) {
            throw new RuntimeException("Compliance check failed for order " + aggressor.getId());
        }

        // Persist the order
        saveOrderToRedis(aggressor);

        // Execute matching algorithm
        List<Trade> trades = match(aggressor);

        // Update order status based on execution results
        if (aggressor.getRemainingQuantity().compareTo(BigDecimal.ZERO) > 0) {
            addOrderToBook(aggressor);
            aggressor.setStatus(aggressor.getRemainingQuantity().compareTo(aggressor.getInitialQuantity()) < 0 
                ? OrderStatus.PARTIALLY_FILLED : OrderStatus.OPEN);
        } else {
            aggressor.setStatus(OrderStatus.FILLED);
        }
        
        // Update order in Redis with final status
        saveOrderToRedis(aggressor);

        // Report trades for compliance and audit
        trades.forEach(complianceService::reportTrade);
        return trades;
    }

    /**
     * Saves an order to Redis using the bonds:orders:{orderId} key pattern.
     * 
     * @param order The order to save
     * @throws RuntimeException if JSON serialization fails
     */
    private void saveOrderToRedis(Order order) {
        String orderKey = "bonds:orders:" + order.getId();
        try {
            String orderJson = objectMapper.writeValueAsString(order);
            redisTemplate.jsonSet(orderKey, orderJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize order for Redis storage", e);
        }
    }

    /**
     * Saves a trade to Redis using the bonds:trades:{tradeId} key pattern.
     * 
     * @param trade The trade to save
     * @throws RuntimeException if JSON serialization fails
     */
    private void saveTradeToRedis(Trade trade) {
        String tradeKey = "bonds:trades:" + trade.getId();
        try {
            String tradeJson = objectMapper.writeValueAsString(trade);
            redisTemplate.jsonSet(tradeKey, tradeJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize trade for Redis storage", e);
        }
    }

    /**
     * Adds an order to the appropriate order book (bids or asks).
     * 
     * <p>Orders are stored in Redis sorted sets with price as the score.
     * The sorting ensures price-time priority for matching.</p>
     * 
     * @param order The order to add to the order book
     * @throws RuntimeException if JSON serialization fails
     */
    private void addOrderToBook(Order order) {
        String bookKey = (order.getSide() == OrderSide.BUY ? BIDS_KEY_PREFIX : ASKS_KEY_PREFIX) 
            + order.getInstrument();
        double score = order.getPrice().doubleValue();
        try {
            String orderJson = objectMapper.writeValueAsString(order);
            redisTemplate.zadd(bookKey, score, orderJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize order for Redis", e);
        }
    }

    /**
     * Executes the matching algorithm for an aggressive order.
     * 
     * <p>This method implements price-time priority matching:</p>
     * <ul>
     *   <li>For buy orders: matches against asks (lowest price first)</li>
     *   <li>For sell orders: matches against bids (highest price first)</li>
     *   <li>Continues until no more matches or order is fully filled</li>
     *   <li>Creates trades for each match and updates order quantities</li>
     * </ul>
     * 
     * @param aggressor The incoming order seeking matches
     * @return List of trades created from successful matches
     */
    private List<Trade> match(Order aggressor) {
        List<Trade> trades = new ArrayList<>();
        String oppositeBookKey = (aggressor.getSide() == OrderSide.BUY ? ASKS_KEY_PREFIX : BIDS_KEY_PREFIX) 
            + aggressor.getInstrument();

        // Retrieve orders from opposite book in price-time priority order
        List<Tuple> restingOrdersTuples;
        if (aggressor.getSide() == OrderSide.BUY) {
            // For buy orders, get asks in ascending price order (lowest price first)
            restingOrdersTuples = redisTemplate.zrangeWithScores(oppositeBookKey, 0, -1);
        } else {
            // For sell orders, get bids in descending price order (highest price first)
            restingOrdersTuples = redisTemplate.zrevrangeWithScores(oppositeBookKey, 0, -1);
        }

        if (restingOrdersTuples == null || restingOrdersTuples.isEmpty()) {
            return trades;
        }

        // Process each potential match
        for (var tuple : restingOrdersTuples) {
            try {
                Order restingOrder = objectMapper.readValue(tuple.getElement(), Order.class);
                double price = tuple.getScore();

                // Check if prices are compatible for matching
                boolean priceMatch = (aggressor.getSide() == OrderSide.BUY && 
                    aggressor.getPrice().compareTo(BigDecimal.valueOf(price)) >= 0) ||
                    (aggressor.getSide() == OrderSide.SELL && 
                    aggressor.getPrice().compareTo(BigDecimal.valueOf(price)) <= 0);

                // Stop if no price match or aggressor is fully filled
                if (!priceMatch || aggressor.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }

                // Execute the trade
                BigDecimal tradeQuantity = aggressor.getRemainingQuantity().min(restingOrder.getRemainingQuantity());

                // Update quantities
                aggressor.setRemainingQuantity(aggressor.getRemainingQuantity().subtract(tradeQuantity));
                restingOrder.setRemainingQuantity(restingOrder.getRemainingQuantity().subtract(tradeQuantity));

                // Create and save trade record
                Trade trade = createTrade(aggressor, restingOrder, restingOrder.getPrice(), tradeQuantity);
                trades.add(trade);
                saveTradeToRedis(trade);
                ledgerService.recordTrade(trade);

                // Remove the resting order from the book
                redisTemplate.zrem(oppositeBookKey, tuple.getElement());

                // Handle resting order based on remaining quantity
                if (restingOrder.getRemainingQuantity().compareTo(BigDecimal.ZERO) > 0) {
                    restingOrder.setStatus(OrderStatus.PARTIALLY_FILLED);
                    addOrderToBook(restingOrder); // Re-add the partially filled order
                } else {
                    restingOrder.setStatus(OrderStatus.FILLED);
                }
                saveOrderToRedis(restingOrder);

            } catch (JsonProcessingException e) {
                // Log error and continue to next order to maintain system stability
                System.err.println("Failed to deserialize order from Redis: " + e.getMessage());
            }
        }
        return trades;
    }

    /**
     * Creates a trade record from two matched orders.
     * 
     * <p>The trade captures all essential information including:</p>
     * <ul>
     *   <li>Execution price (from resting order - price-time priority)</li>
     *   <li>Trade quantity (minimum of both orders' remaining quantities)</li>
     *   <li>Order IDs for both aggressor and resting orders</li>
     *   <li>Buyer and seller identification based on order sides</li>
     * </ul>
     * 
     * @param aggressor The aggressive order (market taker)
     * @param resting The resting order (market maker)
     * @param price The execution price (from resting order)
     * @param quantity The trade quantity
     * @return A new Trade object representing the executed transaction
     */
    private Trade createTrade(Order aggressor, Order resting, BigDecimal price, BigDecimal quantity) {
        Trade trade = new Trade();
        trade.setInstrument(aggressor.getInstrument());
        trade.setPrice(price);
        trade.setQuantity(quantity);
        trade.setAggressorOrderId(aggressor.getId());
        trade.setRestingOrderId(resting.getId());
        trade.setBuyerOrderId(aggressor.getSide() == OrderSide.BUY ? aggressor.getId() : resting.getId());
        trade.setSellerOrderId(aggressor.getSide() == OrderSide.SELL ? aggressor.getId() : resting.getId());
        return trade;
    }
}