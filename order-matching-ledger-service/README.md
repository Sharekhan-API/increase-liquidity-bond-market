# Bond Market Order Matching System

A high-performance, Redis-based bond trading order matching engine built with Spring Boot. This system implements price-time priority matching with comprehensive compliance checks, real-time ledger management, and regulatory reporting capabilities.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│            API Layer            │    │         Service Layer           │    │          Data Layer             │
├─────────────────────────────────┤    ├─────────────────────────────────┤    ├─────────────────────────────────┤
│                                 │    │                                 │    │                                 │
│  ┌─────────────────────────┐    │    │  ┌─────────────────────────┐    │    │  ┌─────────────────────────┐    │
│  │    TradeController      │────┼────┼─▶│    MatchingEngine      │────┼────┼─▶│      Order Books        │    │
│  │   - POST /api/orders    │    │    │  │  - Price-Time Priority  │    │    │  │  bonds:bids:{instrument}│    │
│  │   - Order Validation    │    │    │  │  - Trade Execution      │    │    │  │  bonds:asks:{instrument}│    │
│  │   - Response Handling   │    │    │  │  - Atomic Operations    │    │    │  │  (Redis Sorted Sets)    │    │
│  └─────────────────────────┘    │    │  └─────────────────────────┘    │    │  └─────────────────────────┘    │
│                                 │    │                                 │    │                                 │
│  ┌─────────────────────────┐    │    │  ┌─────────────────────────┐    │    │  ┌─────────────────────────┐    │
│  │   LedgerController      │────┼────┼─▶│     LedgerService       │───┼────┼─▶│    Trade Records        │    │
│  │   - GET /api/ledger     │    │    │  │  - Trade Indexing       │    │    │  │  bonds:trades:{tradeId} │    │
│  │   - Multi-filter APIs   │    │    │  │  - History Management   │    │    │  │  bonds:user-trades:{id} │    │
│  │   - Query Processing    │    │    │  │  - Real-time Updates    │    │    │  │  bonds:daily-trades:{d} │    │
│  └─────────────────────────┘    │    │  └─────────────────────────┘    │    │  └─────────────────────────┘    │
│                                 │    │                                 │    │                                 │
│  ┌─────────────────────────┐    │    │  ┌─────────────────────────┐    │    │  ┌─────────────────────────┐    │
│  │    Swagger UI           │    │    │  │   ComplianceService     │    │    │  │    Individual Orders    │    │
│  │   - API Documentation   │    │    │  │  - KYC/AML Checks       │    │    │  │  bonds:orders:{orderId} │    │
│  │   - Interactive Testing │    │    │  │  - Risk Assessment      │    │    │  │                         │    │
│  │   - Schema Generation   │    │    │  │  - Regulatory Reporting │    │    │  │      Redis JSON         │    │
│  └─────────────────────────┘    │    │  └─────────────────────────┘    │    │  └─────────────────────────┘    │
│                                 │    │                                 │    │                                 │
└─────────────────────────────────┘    └─────────────────────────────────┘    └─────────────────────────────────┘
```

## Order Processing Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │──▶│    API      │───▶│ Compliance  │──▶│  Matching   │───▶│   Redis     │
│ Application │    │ Controller  │    │   Service   │    │   Engine    │    │  Database   │
│             │    │             │    │             │    │             │    │             │
│ - Web UI    │    │ - Validate  │    │ - KYC Check │    │ - Match     │    │ - Store     │
│ - Mobile    │    │ - Serialize │    │ - Risk Mgmt │    │ - Execute   │    │ - Index     │
│ - API       │    │ - Route     │    │ - Report    │    │ - Update    │    │ - Retrieve  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │                   │                   │                   ▼                   │
       │                   │                   │         ┌─────────────┐               │
       │                   │                   │         │   Ledger    │               │
       │                   │                   │         │   Service   │               │
       │                   │                   │         │             │               │
       │                   │                   │         │ - Index     │               │
       │                   │                   │         │ - Filter    │               │
       │                   │                   │         │ - Query     │               │
       │                   │                   │         └─────────────┘               │
       │                   │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         Response: List<Trade> - Executed Trades                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Redis Data Structure
```
Redis Database
├── Order Books (Sorted Sets)
│   ├── bonds:bids:GOVT_BOND_10Y_2024    [Price DESC, Time ASC]
│   ├── bonds:asks:GOVT_BOND_10Y_2024    [Price ASC, Time ASC]
│   └── bonds:bids:CORP_BOND_HDFC_5Y     [Price DESC, Time ASC]
│
├── Individual Records (JSON)
│   ├── bonds:orders:{orderId}           [Complete Order Object]
│   └── bonds:trades:{tradeId}           [Complete Trade Object]
│
└── Ledger Indexes (Sets)
    ├── bonds:user-trades:USER_001       [Set of Trade Keys]
    ├── bonds:instrument-trades:GOVT_*   [Set of Trade Keys]
    └── bonds:daily-trades:20240904      [Set of Trade Keys]
```

## 🚀 Key Features

- **Price-Time Priority Matching**: Industry-standard order matching algorithm
- **Real-time Order Books**: Redis-based sorted sets for optimal performance
- **Compliance Integration**: KYC/AML checks and regulatory reporting
- **Trade Ledger**: Comprehensive trade history with multi-dimensional filtering
- **RESTful APIs**: Well-documented endpoints with Swagger/OpenAPI
- **Atomic Operations**: Ensures data consistency during trade execution
- **Partial Fill Support**: Handles partial order executions seamlessly

## 📋 Table of Contents

- [Services Overview](#services-overview)
- [API Documentation](#api-documentation)
- [Data Models](#data-models)
- [Redis Key Structure](#redis-key-structure)
- [Setup & Installation](#setup--installation)
- [Usage Examples](#usage-examples)
- [Compliance & Regulatory](#compliance--regulatory)
- [Configuration](#configuration)

## 🔧 Services Overview

### 1. MatchingEngine Service

**Purpose**: Core service implementing the price-time priority matching algorithm for bond orders.

**Key Responsibilities**:
- Order validation and compliance checks
- Price-time priority matching logic
- Trade execution and settlement
- Order book management in Redis
- Atomic transaction handling

**Algorithm Details**:
- **Buy Orders**: Match against sell orders (asks) starting from lowest price
- **Sell Orders**: Match against buy orders (bids) starting from highest price
- **Price Priority**: Better prices get matched first
- **Time Priority**: Earlier orders at same price get matched first
- **Partial Fills**: Orders can be partially executed and remain in order book

**Redis Keys Used**:
- `bonds:bids:{instrument}` - Buy order book (sorted by price descending)
- `bonds:asks:{instrument}` - Sell order book (sorted by price ascending)
- `bonds:orders:{orderId}` - Individual order storage
- `bonds:trades:{tradeId}` - Individual trade records

**Key Methods**:
```java
public List<Trade> processOrder(Order aggressor)
private List<Trade> match(Order aggressor)
private void addOrderToBook(Order order)
private Trade createTrade(Order aggressor, Order resting, BigDecimal price, BigDecimal quantity)
```

### 2. LedgerService

**Purpose**: Manages trade history and provides efficient filtering capabilities for audit and reporting.

**Key Responsibilities**:
- Trade record indexing for fast retrieval
- Multi-dimensional filtering (user, instrument, date, amount)
- User ID extraction from order data
- Date-based partitioning for performance
- Real-time index updates

**Index Structure**:
- **User Indexes**: `bonds:user-trades:{userId}` - All trades for a specific user
- **Instrument Indexes**: `bonds:instrument-trades:{instrument}` - All trades for a bond
- **Daily Indexes**: `bonds:daily-trades:{YYYYMMDD}` - All trades for a date
- **Trade Records**: `bonds:trades:{tradeId}` - Individual trade data

**Filtering Capabilities**:
- **User Filter**: Returns trades where user is buyer or seller
- **Instrument Filter**: Returns trades for specific bond instruments
- **Date Range Filter**: Returns trades within specified date range
- **Amount Filter**: Returns trades within specified value range (price × quantity)

**Key Methods**:
```java
public void recordTrade(Trade trade)
public List<Trade> getLedgerEntries(String userId, String instrument, String startDate, String endDate, BigDecimal minAmount, BigDecimal maxAmount)
private void createTradeIndexes(Trade trade, String tradeKey)
private String getBuyerUserId(Trade trade)
private String getSellerUserId(Trade trade)
```

### 3. ComplianceService

**Purpose**: Ensures regulatory compliance and risk management for all trading activities.

**Key Responsibilities**:
- Know Your Customer (KYC) verification
- Anti-Money Laundering (AML) checks
- Pre-trade risk assessments
- Position limit validation
- Regulatory trade reporting
- User authorization verification

**Compliance Checks**:
- **User Compliance**: KYC/AML status verification
- **Pre-trade Checks**: Position limits, credit limits, asset ownership
- **Risk Assessment**: Concentration limits, market risk evaluation
- **Trade Reporting**: Regulatory submission and audit trails

**Integration Points**:
- Called by MatchingEngine before order processing
- Validates every order before execution
- Reports all completed trades to regulatory authorities
- Maintains compliance audit trails

**Key Methods**:
```java
public boolean isUserCompliant(String userId)
public boolean preTradeCheck(Order order)
public void reportTrade(Trade trade)
public boolean isAuthorizedForInstrument(String userId, String instrument)
public boolean requiresEnhancedReporting(BigDecimal tradeValue)
```

## 📡 API Documentation

### Order Management APIs

#### POST /api/orders
Creates and processes a new bond trading order.

**Request Body**:
```json
{
  "instrument": "GOVT_BOND_10Y_2024",
  "side": "BUY",
  "price": 98.50,
  "quantity": 1000000,
  "userId": "USER_001"
}
```

**Response**:
```json
[
  {
    "id": "trade-123",
    "instrument": "GOVT_BOND_10Y_2024",
    "price": 98.50,
    "quantity": 500000,
    "aggressorOrderId": "order-456",
    "restingOrderId": "order-789",
    "buyerOrderId": "order-456",
    "sellerOrderId": "order-789",
    "timestamp": "2024-01-15T10:30:00"
  }
]
```

### Ledger Management APIs

#### GET /api/ledger
Retrieves filtered trade history.

**Query Parameters**:
- `userId` (optional): Filter by user ID
- `instrument` (optional): Filter by bond instrument
- `startDate` (optional): Start date (YYYYMMDD format)
- `endDate` (optional): End date (YYYYMMDD format)
- `minAmount` (optional): Minimum trade value
- `maxAmount` (optional): Maximum trade value

#### GET /api/ledger/user/{userId}
Retrieves all trades for a specific user.

#### GET /api/ledger/instrument/{instrument}
Retrieves all trades for a specific bond instrument.

#### GET /api/ledger/today
Retrieves all trades executed today.

## 📊 Data Models

### Order Model
```java
public class Order {
    private String id;                    // UUID
    private String instrument;            // Bond identifier
    private OrderSide side;              // BUY or SELL
    private BigDecimal price;            // Price per unit
    private BigDecimal initialQuantity;   // Original quantity
    private BigDecimal remainingQuantity; // Unfilled quantity
    private String timestamp;            // Creation time
    private OrderStatus status;          // OPEN, PARTIALLY_FILLED, FILLED
    private String userId;               // User identifier
}
```

### Trade Model
```java
public class Trade {
    private String id;                   // UUID
    private String instrument;           // Bond identifier
    private BigDecimal price;           // Execution price
    private BigDecimal quantity;        // Traded quantity
    private String aggressorOrderId;    // Market taker order
    private String restingOrderId;      // Market maker order
    private String buyerOrderId;        // Buyer's order ID
    private String sellerOrderId;       // Seller's order ID
    private String timestamp;           // Execution time
}
```

### Enumerations

**OrderSide**:
- `BUY`: Purchase order (bid)
- `SELL`: Sale order (ask)

**OrderStatus**:
- `OPEN`: Active and available for matching
- `PARTIALLY_FILLED`: Partially executed
- `FILLED`: Completely executed
- `CANCELLED`: Cancelled (future enhancement)

## 🗄️ Redis Key Structure

### Order Books
```
bonds:bids:{instrument}     # Buy orders (sorted by price DESC)
bonds:asks:{instrument}     # Sell orders (sorted by price ASC)
```

### Individual Records
```
bonds:orders:{orderId}      # Individual order data
bonds:trades:{tradeId}      # Individual trade data
```

### Ledger Indexes
```
bonds:user-trades:{userId}           # User's trade references
bonds:instrument-trades:{instrument} # Instrument's trade references
bonds:daily-trades:{YYYYMMDD}       # Daily trade references
```

## 🛠️ Setup & Installation

### Prerequisites
- Java 21+
- Maven 3.6+
- Redis Server
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd market
```

2. **Configure Redis connection**
Edit `src/main/resources/application.properties`:
```properties
spring.redis.host=localhost
spring.redis.port=6379
```

3. **Build the project**
```bash
mvn clean install
```

4. **Run the application**
```bash
mvn spring-boot:run
```

5. **Access Swagger UI**
```
http://localhost:8080/swagger-ui.html
```

### Dependencies
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```

## 💡 Usage Examples

### 1. Placing a Buy Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "instrument": "GOVT_BOND_10Y_2024",
    "side": "BUY",
    "price": 98.50,
    "quantity": 1000000,
    "userId": "INSTITUTIONAL_001"
  }'
```

### 2. Placing a Sell Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "instrument": "GOVT_BOND_10Y_2024",
    "side": "SELL",
    "price": 98.75,
    "quantity": 500000,
    "userId": "BANK_002"
  }'
```

### 3. Getting User Trade History
```bash
curl "http://localhost:8080/api/ledger/user/INSTITUTIONAL_001"
```

### 4. Getting Today's Trades
```bash
curl "http://localhost:8080/api/ledger/today"
```

### 5. Filtered Trade Query
```bash
curl "http://localhost:8080/api/ledger?instrument=GOVT_BOND_10Y_2024&startDate=20240101&endDate=20240131&minAmount=1000000"
```

## ⚙️ Configuration

### Application Properties
```properties
# Server Configuration
server.port=8080

# Redis Configuration
spring.redis.host=localhost
spring.redis.port=6379

# Swagger Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.packages-to-scan=com.bond.liquidity.market
```

### Redis Configuration
The system uses Redis for:
- Order book storage (sorted sets)
- Individual order/trade records (JSON)
- Ledger indexes (sets)
- Real-time data access

### Logging Configuration
```properties
# Logging levels
logging.level.com.bond.liquidity.market=DEBUG
logging.level.org.springframework.data.redis=INFO
```

**Built for SEBI Hackathon 2024** - A comprehensive bond market order matching system demonstrating enterprise-grade trading infrastructure with regulatory compliance and real-time performance capabilities.