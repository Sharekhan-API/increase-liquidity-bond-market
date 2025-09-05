package com.bond.liquidity.market.api;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bond.liquidity.market.model.Order;
import com.bond.liquidity.market.model.OrderRequestDTO;
import com.bond.liquidity.market.model.Trade;
import com.bond.liquidity.market.service.MatchingEngine;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST controller for bond trading order management.
 * 
 * <p>This controller provides the primary API endpoint for submitting bond trading orders
 * to the matching engine. It handles order validation, processing, and returns the
 * results of any trades that were executed as a result of the order submission.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>RESTful API design with proper HTTP status codes</li>
 *   <li>Input validation for price and quantity constraints</li>
 *   <li>Integration with matching engine for order processing</li>
 *   <li>Comprehensive Swagger documentation for API consumers</li>
 *   <li>Error handling with meaningful response codes</li>
 * </ul>
 * 
 * <p><strong>API Endpoints:</strong></p>
 * <ul>
 *   <li>POST /api/orders - Submit a new bond trading order</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("api")
@Tag(name = "Order Management", description = "APIs for creating and processing bond market orders")
public class TradeController {

	@Autowired 
	private MatchingEngine matchingEngine;

	/**
	 * Creates and processes a new bond trading order.
	 * 
	 * <p>This endpoint accepts a new order request, validates the input parameters,
	 * and submits the order to the matching engine for processing. The order may
	 * result in immediate trades if matching orders exist in the order book.</p>
	 * 
	 * <p><strong>Processing Flow:</strong></p>
	 * <ol>
	 *   <li>Validate input parameters (price > 0, quantity > 0)</li>
	 *   <li>Convert DTO to internal Order object</li>
	 *   <li>Submit to matching engine for processing</li>
	 *   <li>Return list of executed trades (may be empty)</li>
	 * </ol>
	 * 
	 * <p><strong>Validation Rules:</strong></p>
	 * <ul>
	 *   <li>Price must be greater than zero</li>
	 *   <li>Quantity must be greater than zero</li>
	 *   <li>All required fields must be provided</li>
	 * </ul>
	 * 
	 * @param orderRequest The order details including instrument, side, price, quantity, and user ID
	 * @return ResponseEntity containing list of executed trades or error status
	 */
	@PostMapping("orders")
	@Operation(
		summary = "Create a new bond order",
		description = "Submit a new buy or sell order for bond trading. The order will be processed through the matching engine and may result in immediate trades if matching orders exist."
	)
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200", 
			description = "Order processed successfully",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = Trade.class),
				examples = @ExampleObject(
					name = "Successful Trade",
					value = "[{\"id\":\"trade-123\",\"instrument\":\"GOVT_BOND_10Y_2024\",\"price\":98.50,\"quantity\":1000000,\"aggressorOrderId\":\"order-456\",\"restingOrderId\":\"order-789\",\"buyerOrderId\":\"order-456\",\"sellerOrderId\":\"order-789\",\"timestamp\":\"2024-01-15T10:30:00\"}]"
				)
			)
		),
		@ApiResponse(
			responseCode = "400", 
			description = "Invalid order parameters (price or quantity <= 0)",
			content = @Content(
				examples = @ExampleObject(
					name = "Validation Error",
					value = "{\"timestamp\":\"2024-01-15T10:30:00\",\"status\":400,\"error\":\"Bad Request\"}"
				)
			)
		),
		@ApiResponse(
			responseCode = "500", 
			description = "Compliance check failed or internal server error",
			content = @Content(
				examples = @ExampleObject(
					name = "Compliance Error",
					value = "{\"timestamp\":\"2024-01-15T10:30:00\",\"status\":500,\"error\":\"Internal Server Error\",\"message\":\"Compliance check failed for order [order-id]\"}"
				)
			)
		)
	})
	public ResponseEntity<List<Trade>> createOrder(
		@Parameter(
			description = "Order details including instrument, side, price, quantity, and user ID",
			required = true,
			content = @Content(
				examples = {
					@ExampleObject(
						name = "Buy Order",
						summary = "Government Bond Buy Order",
						description = "Example buy order for 10-year government bond",
						value = "{\"instrument\":\"GOVT_BOND_10Y_2024\",\"side\":\"BUY\",\"price\":98.50,\"quantity\":1000000,\"userId\":\"USER_001\"}"
					),
					@ExampleObject(
						name = "Sell Order",
						summary = "Corporate Bond Sell Order", 
						description = "Example sell order for corporate bond",
						value = "{\"instrument\":\"CORP_BOND_HDFC_5Y\",\"side\":\"SELL\",\"price\":102.75,\"quantity\":500000,\"userId\":\"USER_002\"}"
					),
					@ExampleObject(
						name = "Large Institutional Order",
						summary = "Large Institutional Buy Order",
						description = "Example large buy order from institutional investor",
						value = "{\"instrument\":\"TREASURY_BILL_91D\",\"side\":\"BUY\",\"price\":99.95,\"quantity\":50000000,\"userId\":\"BANK_001\"}"
					)
				}
			)
		)
		@RequestBody OrderRequestDTO orderRequest) {
		
		// Input validation
		if (orderRequest.getPrice().compareTo(BigDecimal.ZERO) <= 0 || 
				orderRequest.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
			return ResponseEntity.badRequest().build();
		}
		
		// Convert DTO to internal Order object
		var order = new Order(orderRequest);
		
		// Process through matching engine
		var executedTrades = matchingEngine.processOrder(order);
		
		return ResponseEntity.ok(executedTrades);
	}
}