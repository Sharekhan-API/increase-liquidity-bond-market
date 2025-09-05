package com.bond.liquidity.market.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a completed trade between two orders in the bond market.
 * 
 * <p>A Trade is created when an aggressive order matches with a resting order
 * in the order book. It captures all essential information about the transaction
 * including the parties involved, execution price, quantity, and timing.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>Immutable trade record for audit and compliance</li>
 *   <li>Links to both buyer and seller orders</li>
 *   <li>Execution price determined by resting order (price-time priority)</li>
 *   <li>Automatic timestamp for trade reporting</li>
 *   <li>Redis persistence for ledger and history tracking</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Data
@RedisHash("Trade")
@NoArgsConstructor
@Schema(description = "Completed trade transaction between two orders")
public class Trade implements Serializable {
    
    /**
     * Unique identifier for the trade.
     * Automatically generated UUID to ensure uniqueness across all trades.
     */
    @Id
    @Schema(description = "Unique trade identifier", example = "t1a2b3c4-d5e6-7890-abcd-ef1234567890")
    private String id = UUID.randomUUID().toString();
    
    /**
     * Bond instrument that was traded.
     * Must match the instrument of both orders involved in the trade.
     */
    @Schema(description = "Bond instrument identifier", example = "GOVT_BOND_10Y_2024", required = true)
    private String instrument;
    
    /**
     * Execution price of the trade.
     * Determined by the resting order's price (price-time priority rule).
     */
    @Schema(description = "Trade execution price", example = "98.50", required = true)
    private BigDecimal price;
    
    /**
     * Quantity traded.
     * The minimum of the aggressive order's remaining quantity and resting order's remaining quantity.
     */
    @Schema(description = "Traded quantity", example = "500000", required = true)
    private BigDecimal quantity;
    
    /**
     * Order ID of the aggressive order (market taker).
     * The order that initiated the trade by matching against the resting order.
     */
    @Schema(description = "Aggressive order ID (market taker)", example = "order-123")
    private String aggressorOrderId;
    
    /**
     * Order ID of the resting order (market maker).
     * The order that was already in the order book when the trade occurred.
     */
    @Schema(description = "Resting order ID (market maker)", example = "order-456")
    private String restingOrderId;
    
    /**
     * Order ID of the buyer in this trade.
     * Can be either the aggressor or resting order depending on the trade direction.
     */
    @Schema(description = "Buyer order ID", example = "order-123")
    private String buyerOrderId;
    
    /**
     * Order ID of the seller in this trade.
     * Can be either the aggressor or resting order depending on the trade direction.
     */
    @Schema(description = "Seller order ID", example = "order-456")
    private String sellerOrderId;
    
    /**
     * Timestamp when the trade was executed.
     * Used for trade reporting, settlement, and audit purposes.
     */
    @Schema(description = "Trade execution timestamp", example = "2024-01-15T10:30:00.123")
    private String timestamp = LocalDateTime.now().toString();
    
    /**
     * Calculates the total trade value.
     * 
     * @return the total value of the trade (price × quantity)
     */
    @Schema(hidden = true)
    public BigDecimal getTradeValue() {
        return price.multiply(quantity);
    }
    
    /**
     * Checks if this trade involves the specified order ID.
     * 
     * @param orderId the order ID to check
     * @return true if the order ID is either buyer or seller in this trade
     */
    @Schema(hidden = true)
    public boolean involvesOrder(String orderId) {
        return orderId.equals(buyerOrderId) || orderId.equals(sellerOrderId);
    }
}