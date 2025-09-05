package com.bond.liquidity.market.service;

import com.bond.liquidity.market.model.Trade;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.JedisPooled;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Service for managing trade ledger and providing filtered access to trade history.
 * 
 * <p>This service creates and maintains indexes for efficient querying of trade data
 * stored in Redis. It works directly with the existing trade storage from the
 * MatchingEngine and provides various filtering capabilities for trade retrieval.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>Automatic index creation for efficient filtering</li>
 *   <li>Multi-dimensional filtering (user, instrument, date, amount)</li>
 *   <li>Real-time trade recording with immediate index updates</li>
 *   <li>User ID extraction from order data for accurate attribution</li>
 *   <li>Date-based partitioning for performance optimization</li>
 * </ul>
 * 
 * <p><strong>Redis Index Structure:</strong></p>
 * <ul>
 *   <li>bonds:trades:{tradeId} - Individual trade records</li>
 *   <li>bonds:user-trades:{userId} - User-specific trade indexes</li>
 *   <li>bonds:instrument-trades:{instrument} - Instrument-specific indexes</li>
 *   <li>bonds:daily-trades:{YYYYMMDD} - Daily trade indexes</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Service
public class LedgerService {

    /** Redis key prefix for individual trade records */
    private static final String TRADES_KEY_PREFIX = "bonds:trades:";
    
    /** Redis key prefix for user-specific trade indexes */
    private static final String USER_TRADES_PREFIX = "bonds:user-trades:";
    
    /** Redis key prefix for instrument-specific trade indexes */
    private static final String INSTRUMENT_TRADES_PREFIX = "bonds:instrument-trades:";
    
    /** Redis key prefix for daily trade indexes */
    private static final String DAILY_TRADES_PREFIX = "bonds:daily-trades:";

    @Autowired
    private JedisPooled redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Records a trade in the ledger system with automatic index creation.
     * 
     * <p>This method creates multiple indexes to enable efficient filtering:</p>
     * <ul>
     *   <li>User indexes for both buyer and seller</li>
     *   <li>Instrument index for the traded bond</li>
     *   <li>Daily index for date-based queries</li>
     * </ul>
     * 
     * <p>Note: The actual trade data is already stored by the MatchingEngine.
     * This method only creates the indexes for efficient retrieval.</p>
     * 
     * @param trade The trade to record in the ledger
     */
    public void recordTrade(Trade trade) {
        // Trade is already saved in MatchingEngine, just create indexes for filtering
        String tradeKey = TRADES_KEY_PREFIX + trade.getId();
        createTradeIndexes(trade, tradeKey);
    }

    /**
     * Creates Redis set-based indexes for efficient trade filtering.
     * 
     * <p>This method populates multiple Redis sets that act as indexes:</p>
     * <ul>
     *   <li>User indexes: Enable quick lookup of all trades for a specific user</li>
     *   <li>Instrument indexes: Enable quick lookup of all trades for a specific bond</li>
     *   <li>Daily indexes: Enable quick lookup of all trades for a specific date</li>
     * </ul>
     * 
     * @param trade The trade for which to create indexes
     * @param tradeKey The Redis key where the trade is stored
     */
    private void createTradeIndexes(Trade trade, String tradeKey) {
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Index by buyer user ID (extract from buyerOrderId)
        String buyerUserId = getBuyerUserId(trade);
        if (buyerUserId != null) {
            String buyerKey = USER_TRADES_PREFIX + buyerUserId;
            redisTemplate.sadd(buyerKey, tradeKey);
        }
        
        // Index by seller user ID (extract from sellerOrderId)
        String sellerUserId = getSellerUserId(trade);
        if (sellerUserId != null) {
            String sellerKey = USER_TRADES_PREFIX + sellerUserId;
            redisTemplate.sadd(sellerKey, tradeKey);
        }
        
        // Index by instrument
        String instrumentKey = INSTRUMENT_TRADES_PREFIX + trade.getInstrument();
        redisTemplate.sadd(instrumentKey, tradeKey);
        
        // Index by date
        String dateKey = DAILY_TRADES_PREFIX + today;
        redisTemplate.sadd(dateKey, tradeKey);
    }

    /**
     * Retrieves ledger entries with optional filtering.
     * 
     * <p>This method provides flexible filtering capabilities:</p>
     * <ul>
     *   <li>User filtering: Returns trades where user is buyer or seller</li>
     *   <li>Instrument filtering: Returns trades for specific bond instruments</li>
     *   <li>Date range filtering: Returns trades within specified date range</li>
     *   <li>Amount filtering: Returns trades within specified value range</li>
     * </ul>
     * 
     * <p>The method uses a hierarchical filtering approach, starting with the most
     * specific filter to minimize the dataset before applying additional filters.</p>
     * 
     * @param userId Filter by user ID (optional)
     * @param instrument Filter by instrument (optional)
     * @param startDate Filter by start date in YYYYMMDD format (optional)
     * @param endDate Filter by end date in YYYYMMDD format (optional)
     * @param minAmount Filter by minimum trade value (optional)
     * @param maxAmount Filter by maximum trade value (optional)
     * @return List of trades matching the specified criteria
     */
    public List<Trade> getLedgerEntries(String userId, String instrument, String startDate, String endDate, 
                                       BigDecimal minAmount, BigDecimal maxAmount) {
        List<Trade> filteredTrades = new ArrayList<>();
        Set<String> tradeKeys = null;
        
        // Start with the most specific filter to minimize dataset
        if (userId != null && !userId.isEmpty()) {
            tradeKeys = redisTemplate.smembers(USER_TRADES_PREFIX + userId);
        } else if (instrument != null && !instrument.isEmpty()) {
            tradeKeys = redisTemplate.smembers(INSTRUMENT_TRADES_PREFIX + instrument);
        } else if (startDate != null && !startDate.isEmpty()) {
            tradeKeys = redisTemplate.smembers(DAILY_TRADES_PREFIX + startDate);
        } else {
            // Get all trade entries if no specific filter
            tradeKeys = redisTemplate.keys(TRADES_KEY_PREFIX + "*");
        }
        
        if (tradeKeys == null || tradeKeys.isEmpty()) {
            return filteredTrades;
        }
        
        // Process each trade key and apply additional filters
        for (String tradeKey : tradeKeys) {
            try {
                var tradeJson = redisTemplate.jsonGet(tradeKey);
                if (tradeJson != null) {
                    Trade trade = objectMapper.readValue(tradeJson.toString(), Trade.class);
                    
                    // Apply additional filters
                    if (matchesFilters(trade, userId, instrument, startDate, endDate, minAmount, maxAmount)) {
                        filteredTrades.add(trade);
                    }
                }
            } catch (JsonProcessingException e) {
                System.err.println("Failed to deserialize trade from Redis: " + e.getMessage());
            }
        }
        
        return filteredTrades;
    }

    /**
     * Checks if a trade matches all specified filter criteria.
     * 
     * <p>This method applies multiple filter conditions:</p>
     * <ul>
     *   <li>User filter: Checks if user is buyer or seller</li>
     *   <li>Instrument filter: Exact match on instrument identifier</li>
     *   <li>Date range filter: Checks if trade date falls within range</li>
     *   <li>Amount filter: Checks if trade value falls within range</li>
     * </ul>
     * 
     * @param trade The trade to check against filters
     * @param userId User ID filter (optional)
     * @param instrument Instrument filter (optional)
     * @param startDate Start date filter (optional)
     * @param endDate End date filter (optional)
     * @param minAmount Minimum amount filter (optional)
     * @param maxAmount Maximum amount filter (optional)
     * @return true if trade matches all specified filters, false otherwise
     */
    private boolean matchesFilters(Trade trade, String userId, String instrument, String startDate, 
                                 String endDate, BigDecimal minAmount, BigDecimal maxAmount) {
        
        // User filter - check if user is buyer or seller
        if (userId != null && !userId.isEmpty()) {
            String buyerUserId = getBuyerUserId(trade);
            String sellerUserId = getSellerUserId(trade);
            if (!userId.equals(buyerUserId) && !userId.equals(sellerUserId)) {
                return false;
            }
        }
        
        // Instrument filter
        if (instrument != null && !instrument.isEmpty() && !instrument.equals(trade.getInstrument())) {
            return false;
        }
        
        // Date range filter
        if (startDate != null && !startDate.isEmpty()) {
            String tradeDate = trade.getTimestamp().substring(0, 10).replace("-", "");
            if (tradeDate.compareTo(startDate) < 0) {
                return false;
            }
        }
        
        if (endDate != null && !endDate.isEmpty()) {
            String tradeDate = trade.getTimestamp().substring(0, 10).replace("-", "");
            if (tradeDate.compareTo(endDate) > 0) {
                return false;
            }
        }
        
        // Amount filter (price * quantity)
        BigDecimal tradeAmount = trade.getPrice().multiply(trade.getQuantity());
        if (minAmount != null && tradeAmount.compareTo(minAmount) < 0) {
            return false;
        }
        
        if (maxAmount != null && tradeAmount.compareTo(maxAmount) > 0) {
            return false;
        }
        
        return true;
    }

    /**
     * Extracts the buyer's user ID from a trade by looking up the buyer order.
     * 
     * <p>This method retrieves the buyer order from Redis and extracts the user ID
     * from the order data. It uses string parsing for efficiency but could be
     * enhanced to use full JSON deserialization if needed.</p>
     * 
     * @param trade The trade containing the buyer order ID
     * @return The buyer's user ID, or null if not found or error occurs
     */
    private String getBuyerUserId(Trade trade) {
        // Extract user ID from order stored in Redis
        try {
            String orderKey = "bonds:orders:" + trade.getBuyerOrderId();
            var orderJson = redisTemplate.jsonGet(orderKey);
            if (orderJson != null) {
                String orderStr = orderJson.toString();
                if (orderStr.contains("\"userId\":\"")) {
                    int start = orderStr.indexOf("\"userId\":\"") + 10;
                    int end = orderStr.indexOf("\"", start);
                    return orderStr.substring(start, end);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to get buyer user ID: " + e.getMessage());
        }
        return null;
    }

    /**
     * Extracts the seller's user ID from a trade by looking up the seller order.
     * 
     * <p>This method retrieves the seller order from Redis and extracts the user ID
     * from the order data. It uses string parsing for efficiency but could be
     * enhanced to use full JSON deserialization if needed.</p>
     * 
     * @param trade The trade containing the seller order ID
     * @return The seller's user ID, or null if not found or error occurs
     */
    private String getSellerUserId(Trade trade) {
        // Extract user ID from order stored in Redis
        try {
            String orderKey = "bonds:orders:" + trade.getSellerOrderId();
            var orderJson = redisTemplate.jsonGet(orderKey);
            if (orderJson != null) {
                String orderStr = orderJson.toString();
                if (orderStr.contains("\"userId\":\"")) {
                    int start = orderStr.indexOf("\"userId\":\"") + 10;
                    int end = orderStr.indexOf("\"", start);
                    return orderStr.substring(start, end);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to get seller user ID: " + e.getMessage());
        }
        return null;
    }
}