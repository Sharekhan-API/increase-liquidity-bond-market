package com.bond.liquidity.market.model;

import com.bond.liquidity.market.model.enums.OrderSide;
import com.bond.liquidity.market.model.enums.OrderStatus;
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
 * Represents a bond trading order in the market.
 * 
 * <p>This entity stores all information related to a buy or sell order for bonds,
 * including pricing, quantity, timing, and execution status. Orders are persisted
 * in Redis and processed through the matching engine.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>Automatic UUID generation for unique identification</li>
 *   <li>Price-time priority matching support</li>
 *   <li>Partial fill tracking with remaining quantity</li>
 *   <li>Compliance integration through user ID</li>
 *   <li>Redis persistence with JSON serialization</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Data
@RedisHash("Order")
@NoArgsConstructor
@Schema(description = "Bond trading order entity with all order details and execution status")
public class Order implements Serializable {
    
    /**
     * Unique identifier for the order.
     * Automatically generated UUID to ensure uniqueness across the system.
     */
    @Id
    @Schema(description = "Unique order identifier", example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    private String id = UUID.randomUUID().toString();
    
    /**
     * Bond instrument identifier.
     * Specifies which bond this order is for (e.g., government bonds, corporate bonds).
     */
    @Schema(description = "Bond instrument identifier", example = "GOVT_BOND_10Y_2024", required = true)
    private String instrument;
    
    /**
     * Order side indicating buy or sell direction.
     */
    @Schema(description = "Order side - BUY or SELL", example = "BUY", required = true)
    private OrderSide side;
    
    /**
     * Order price per unit.
     * For bonds, this is typically expressed as a percentage of face value.
     */
    @Schema(description = "Order price per unit", example = "98.50", required = true)
    private BigDecimal price;
    
    /**
     * Initial quantity when the order was placed.
     * This value remains unchanged throughout the order lifecycle for tracking purposes.
     */
    @Schema(description = "Initial order quantity", example = "1000000")
    private BigDecimal initialQuantity;
    
    /**
     * Remaining quantity yet to be filled.
     * Decreases as the order gets partially or fully executed.
     */
    @Schema(description = "Remaining quantity to be filled", example = "500000")
    private BigDecimal remainingQuantity;
    
    /**
     * Timestamp when the order was created.
     * Used for price-time priority in the matching algorithm.
     */
    @Schema(description = "Order creation timestamp", example = "2024-01-15T10:30:00")
    private String timestamp = LocalDateTime.now().toString();
    
    /**
     * Current status of the order.
     * Tracks the execution state throughout the order lifecycle.
     */
    @Schema(description = "Current order status", example = "OPEN")
    private OrderStatus status = OrderStatus.OPEN;
    
    /**
     * User identifier who placed the order.
     * Used for compliance checks and trade attribution.
     */
    @Schema(description = "User ID who placed the order", example = "USER_001", required = true)
    private String userId;

    /**
     * Constructs an Order from an OrderRequestDTO.
     * 
     * <p>This constructor is used when converting API requests into internal Order objects.
     * It copies all relevant fields and sets up initial state for processing.</p>
     * 
     * @param dto The order request DTO containing order details from the API
     * @throws IllegalArgumentException if dto is null or contains invalid data
     */
    public Order(OrderRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("OrderRequestDTO cannot be null");
        }
        
        this.instrument = dto.getInstrument();
        this.side = dto.getSide();
        this.price = dto.getPrice();
        this.initialQuantity = dto.getQuantity();
        this.remainingQuantity = dto.getQuantity();
        this.userId = dto.getUserId();
    }
    
    /**
     * Checks if the order is completely filled.
     * 
     * @return true if remaining quantity is zero, false otherwise
     */
    @Schema(hidden = true)
    public boolean isCompletelyFilled() {
        return remainingQuantity.compareTo(BigDecimal.ZERO) == 0;
    }
    
    /**
     * Checks if the order is partially filled.
     * 
     * @return true if some quantity has been filled but not all, false otherwise
     */
    @Schema(hidden = true)
    public boolean isPartiallyFilled() {
        return remainingQuantity.compareTo(initialQuantity) < 0 && 
               remainingQuantity.compareTo(BigDecimal.ZERO) > 0;
    }
    
    /**
     * Gets the filled quantity.
     * 
     * @return the amount of the order that has been executed
     */
    @Schema(hidden = true)
    public BigDecimal getFilledQuantity() {
        return initialQuantity.subtract(remainingQuantity);
    }
}