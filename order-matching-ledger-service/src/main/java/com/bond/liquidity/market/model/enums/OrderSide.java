package com.bond.liquidity.market.model.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Enumeration representing the side of a bond trading order.
 * 
 * <p>This enum defines whether an order is a buy order (bid) or a sell order (ask).
 * It's used throughout the system for order classification, matching logic,
 * and order book management.</p>
 * 
 * <p><strong>Usage in Matching Engine:</strong></p>
 * <ul>
 *   <li>BUY orders are stored in the bids order book (sorted by price descending)</li>
 *   <li>SELL orders are stored in the asks order book (sorted by price ascending)</li>
 *   <li>BUY orders match against SELL orders and vice versa</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Schema(description = "Order side enumeration")
public enum OrderSide {
    
    /**
     * Buy order (bid).
     * Represents an order to purchase bonds at or below a specified price.
     */
    @Schema(description = "Buy order - willing to purchase bonds")
    BUY,
    
    /**
     * Sell order (ask).
     * Represents an order to sell bonds at or above a specified price.
     */
    @Schema(description = "Sell order - willing to sell bonds")
    SELL
}