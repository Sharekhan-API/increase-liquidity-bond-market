package com.bond.liquidity.market.model;

import java.math.BigDecimal;
import com.bond.liquidity.market.model.enums.OrderSide;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for creating a new order via the API.
 * 
 * <p>This DTO separates the API representation from the internal database entity,
 * providing a clean interface for order creation while maintaining data validation
 * and documentation standards.</p>
 * 
 * <p><strong>Validation Rules:</strong></p>
 * <ul>
 *   <li>Price must be positive (> 0)</li>
 *   <li>Quantity must be positive (> 0)</li>
 *   <li>Instrument and userId cannot be blank</li>
 *   <li>Side must be either BUY or SELL</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Data
@Schema(description = "Request object for creating a new bond order")
public class OrderRequestDTO {
    
    /**
     * Bond instrument identifier.
     * Specifies which bond instrument this order is for.
     */
    @NotBlank(message = "Instrument cannot be blank")
    @Schema(description = "Bond instrument identifier", 
            example = "GOVT_BOND_10Y_2024", 
            required = true)
    private String instrument;
    
    /**
     * Order side indicating buy or sell direction.
     */
    @NotNull(message = "Order side is required")
    @Schema(description = "Order side - BUY or SELL", 
            example = "BUY", 
            required = true,
            allowableValues = {"BUY", "SELL"})
    private OrderSide side;
    
    /**
     * Order price per unit.
     * Must be positive. For bonds, typically expressed as percentage of face value.
     */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Schema(description = "Order price per unit", 
            example = "98.50", 
            required = true,
            minimum = "0.01")
    private BigDecimal price;
    
    /**
     * Order quantity.
     * Must be positive. Represents the number of units to buy or sell.
     */
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @Schema(description = "Order quantity", 
            example = "1000000", 
            required = true,
            minimum = "1")
    private BigDecimal quantity;
    
    /**
     * User identifier placing the order.
     * Used for compliance checks and order attribution.
     */
    @NotBlank(message = "User ID cannot be blank")
    @Schema(description = "User ID placing the order", 
            example = "USER_001", 
            required = true)
    private String userId;
}