package com.bond.liquidity.market.api;

import com.bond.liquidity.market.model.Trade;
import com.bond.liquidity.market.service.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST controller for trade ledger and history management.
 * 
 * <p>This controller provides comprehensive APIs for retrieving trade history
 * and ledger entries with various filtering capabilities. It enables users,
 * administrators, and regulatory authorities to access trade data for
 * analysis, reporting, and compliance purposes.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>Multi-dimensional filtering (user, instrument, date, amount)</li>
 *   <li>Efficient Redis-based data retrieval</li>
 *   <li>RESTful API design with proper HTTP semantics</li>
 *   <li>Comprehensive Swagger documentation</li>
 *   <li>Convenience endpoints for common use cases</li>
 * </ul>
 * 
 * <p><strong>API Endpoints:</strong></p>
 * <ul>
 *   <li>GET /api/ledger - Filtered ledger entries</li>
 *   <li>GET /api/ledger/user/{userId} - User-specific trades</li>
 *   <li>GET /api/ledger/instrument/{instrument} - Instrument-specific trades</li>
 *   <li>GET /api/ledger/today - Today's trades</li>
 * </ul>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("api")
@Tag(name = "Ledger Management", description = "APIs for retrieving trade history and ledger entries")
public class LedgerController {

    @Autowired
    private LedgerService ledgerService;

    /**
     * Retrieves ledger entries with optional filtering.
     * 
     * <p>This endpoint provides flexible access to trade history with multiple
     * filtering options. Filters can be combined to create precise queries for
     * specific trade data requirements.</p>
     * 
     * <p><strong>Filter Combinations:</strong></p>
     * <ul>
     *   <li>Single filters: Apply one filter for broad results</li>
     *   <li>Combined filters: Use multiple filters for precise results</li>
     *   <li>Date ranges: Specify both start and end dates for time-bound queries</li>
     *   <li>Amount ranges: Use min and max amounts for value-based filtering</li>
     * </ul>
     * 
     * @param userId Filter by user ID (buyer or seller)
     * @param instrument Filter by bond instrument identifier
     * @param startDate Filter by start date (YYYYMMDD format)
     * @param endDate Filter by end date (YYYYMMDD format)
     * @param minAmount Filter by minimum trade value
     * @param maxAmount Filter by maximum trade value
     * @return List of trades matching the specified criteria
     */
    @GetMapping("ledger")
    @Operation(
        summary = "Get filtered ledger entries",
        description = "Retrieve trade history with optional filters for user, instrument, date range, and trade amount. Filters can be combined for precise queries."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Ledger entries retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Filtered Trades",
                    value = "[{\"id\":\"trade-123\",\"instrument\":\"GOVT_BOND_10Y_2024\",\"price\":98.50,\"quantity\":1000000,\"timestamp\":\"2024-01-15T10:30:00\"}]"
                )
            )
        ),
        @ApiResponse(
            responseCode = "500", 
            description = "Internal server error during data retrieval"
        )
    })
    public ResponseEntity<List<Trade>> getLedger(
            @Parameter(description = "Filter by user ID (returns trades where user is buyer or seller)", example = "USER_001") 
            @RequestParam(required = false) String userId,
            
            @Parameter(description = "Filter by bond instrument identifier", example = "GOVT_BOND_10Y_2024") 
            @RequestParam(required = false) String instrument,
            
            @Parameter(description = "Start date for date range filter (YYYYMMDD format)", example = "20240101") 
            @RequestParam(required = false) String startDate,
            
            @Parameter(description = "End date for date range filter (YYYYMMDD format)", example = "20240131") 
            @RequestParam(required = false) String endDate,
            
            @Parameter(description = "Minimum trade amount (price × quantity)", example = "1000000") 
            @RequestParam(required = false) BigDecimal minAmount,
            
            @Parameter(description = "Maximum trade amount (price × quantity)", example = "10000000") 
            @RequestParam(required = false) BigDecimal maxAmount) {
        
        List<Trade> ledgerEntries = ledgerService.getLedgerEntries(
            userId, instrument, startDate, endDate, minAmount, maxAmount);
        
        return ResponseEntity.ok(ledgerEntries);
    }

    /**
     * Retrieves all trades for a specific user.
     * 
     * <p>This convenience endpoint returns all trades where the specified user
     * was either the buyer or seller. Useful for user portfolio analysis,
     * account statements, and individual trade history.</p>
     * 
     * @param userId The user identifier to retrieve trades for
     * @return List of all trades involving the specified user
     */
    @GetMapping("ledger/user/{userId}")
    @Operation(
        summary = "Get trades for specific user", 
        description = "Retrieve all trades where the specified user was either buyer or seller. Useful for user portfolio analysis and account statements."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User trades retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "User not found or no trades available")
    })
    public ResponseEntity<List<Trade>> getUserTrades(
            @Parameter(description = "User identifier", example = "USER_001", required = true) 
            @PathVariable String userId) {
        List<Trade> userTrades = ledgerService.getLedgerEntries(
            userId, null, null, null, null, null);
        return ResponseEntity.ok(userTrades);
    }

    /**
     * Retrieves all trades for a specific bond instrument.
     * 
     * <p>This convenience endpoint returns all trades for a specific bond,
     * useful for instrument analysis, market data, and price discovery.</p>
     * 
     * @param instrument The bond instrument identifier
     * @return List of all trades for the specified instrument
     */
    @GetMapping("ledger/instrument/{instrument}")
    @Operation(
        summary = "Get trades for specific instrument", 
        description = "Retrieve all trades for a specific bond instrument. Useful for instrument analysis, market data, and price discovery."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Instrument trades retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Instrument not found or no trades available")
    })
    public ResponseEntity<List<Trade>> getInstrumentTrades(
            @Parameter(description = "Bond instrument identifier", example = "GOVT_BOND_10Y_2024", required = true) 
            @PathVariable String instrument) {
        List<Trade> instrumentTrades = ledgerService.getLedgerEntries(
            null, instrument, null, null, null, null);
        return ResponseEntity.ok(instrumentTrades);
    }

    /**
     * Retrieves all trades executed today.
     * 
     * <p>This convenience endpoint returns all trades for the current trading day,
     * useful for daily reports, real-time monitoring, and end-of-day processing.</p>
     * 
     * @return List of all trades executed today
     */
    @GetMapping("ledger/today")
    @Operation(
        summary = "Get today's trades", 
        description = "Retrieve all trades executed today. Useful for daily reports, real-time monitoring, and end-of-day processing."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Today's trades retrieved successfully"),
        @ApiResponse(responseCode = "204", description = "No trades executed today")
    })
    public ResponseEntity<List<Trade>> getTodayTrades() {
        String today = java.time.LocalDateTime.now().format(
            java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        List<Trade> todayTrades = ledgerService.getLedgerEntries(
            null, null, today, today, null, null);
        return ResponseEntity.ok(todayTrades);
    }
}