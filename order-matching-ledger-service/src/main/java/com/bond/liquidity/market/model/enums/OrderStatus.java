package com.bond.liquidity.market.model.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Enumeration representing the current status of a bond trading order.
 * 
 * <p>This enum tracks the lifecycle of an order from creation through execution
 * or cancellation. It's used for order management, reporting, and user interfaces.</p>
 * 
 * <p><strong>Order Lifecycle:</strong></p>
 * <ol>
 *   <li>OPEN - Order is active and available for matching</li>
 *   <li>PARTIALLY_FILLED - Order has been partially executed</li>
 *   <li>FILLED - Order has been completely executed</li>
 *   <li>CANCELLED - Order has been cancelled (future enhancement)</li>
 * </ol>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Schema(description = "Order status enumeration")
public enum OrderStatus {
    
    /**
     * Order is open and available for matching.
     * No execution has occurred yet, and the full quantity is available.
     */
    @Schema(description = "Order is open and available for matching")
    OPEN,
    
    /**
     * Order has been partially filled.
     * Some quantity has been executed, but remaining quantity is still available for matching.
     */
    @Schema(description = "Order has been partially executed")
    PARTIALLY_FILLED,
    
    /**
     * Order has been completely filled.
     * All quantity has been executed, and the order is no longer active.
     */
    @Schema(description = "Order has been completely executed")
    FILLED,
    
    /**
     * Order has been cancelled.
     * Order is no longer active and cannot be executed (future enhancement).
     */
    @Schema(description = "Order has been cancelled")
    CANCELLED
}