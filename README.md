# HybridExchange

A hybrid stock + crypto exchange platform demonstrating full-stack development with Java Spring Boot backend and Next.js frontend.

## 🎯 Project Status

**Current State:** Project structure with skeleton implementations

All files contain placeholder/TODO implementations ready to be developed on feature branches. This allows for a clean, professional commit history demonstrating incremental development.

## 🏗️ Architecture

```
hybrid_exchange/
├── exchange-backend/     # Spring Boot REST API (port 8080)
├── exchange-frontend/    # Next.js App (port 3000)
└── docker-compose.yml    # PostgreSQL + Redis
```

## 🚀 Tech Stack

### Backend
- Java 17+
- Spring Boot 3.2+
- Spring Security + JWT Authentication
- Spring Data JPA
- PostgreSQL
- Redis (caching)
- Maven

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Zustand (state management)
- TanStack Query (data fetching)
- Recharts (charts)

### External APIs
- [Finnhub](https://finnhub.io/) - Stock prices (60 calls/min free tier)
- [Coinbase Exchange API](https://docs.cloud.coinbase.com/exchange/reference) - Crypto prices (free, no API key needed)

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+

## 🛠️ Setup Instructions

### 1. Start Infrastructure (PostgreSQL + Redis)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### 2. Backend Setup

```bash
cd exchange-backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd exchange-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

### Backend (MVC Architecture)

```
exchange-backend/src/main/java/com/exchange/
├── ExchangeApplication.java    # Main entry point
├── config/                     # Configuration classes
│   ├── SecurityConfig.java     # TODO: JWT security setup
│   ├── CorsConfig.java         # TODO: CORS configuration
│   ├── RedisConfig.java        # TODO: Redis cache setup
│   └── WebClientConfig.java    # TODO: External API clients
├── controller/                 # REST controllers (skeleton)
├── service/                    # Business logic (skeleton)
│   └── impl/                   # Service implementations (skeleton)
├── repository/                 # Data access layer
├── entity/                     # JPA entities
├── dto/                        # Data transfer objects
├── security/                   # JWT authentication (skeleton)
└── exception/                  # Exception handling
```

## 🔧 Environment (Backend)

Set these properties (e.g., in `application.yml` or env vars):

- `app.jwt.secret` / `app.jwt.expiration` – JWT signing key & lifetime (ms)
- `app.finnhub.base-url`, `app.finnhub.api-key` – stock price API
- `app.coinbase.base-url` – crypto price API base (e.g., https://api.exchange.coinbase.com)
- `spring.redis.host` / `spring.redis.port` – Redis for caching, token blacklist, rate limiting

A running Redis instance is required for JWT blacklist, rate limiting, and price caching.

### Frontend (Next.js App Router)

```
exchange-frontend/src/
├── app/                        # Next.js pages (skeleton)
├── components/                 # React components (skeleton)
│   ├── ui/                     # Reusable UI components
│   ├── layout/                 # Layout components
│   ├── charts/                 # Chart components
│   ├── portfolio/              # Portfolio components
│   └── trade/                  # Trade components
├── hooks/                      # Custom React hooks (skeleton)
├── store/                      # Zustand stores (skeleton)
├── lib/                        # Utilities
│   ├── api.ts                  # API client (skeleton)
│   └── utils.ts                # Helper functions
└── types/                      # TypeScript types
```

## 🌿 Development Workflow

This project follows a feature-branch workflow for professional development:

### Initial Setup

```bash
# Initialize git repository
git init
git add .
git commit -m "chore: initial project structure with skeleton implementations"
git remote add origin https://github.com/HamedDawoudzai/hybrid_exchange.git
git push -u origin main
```

### Feature Development

```bash
# Create feature branch
git checkout -b feature/auth-implementation

# Make changes...
git add .
git commit -m "feat: implement user registration"
git commit -m "feat: implement user login with JWT"
git commit -m "feat: add JWT token validation"

# Push and create PR
git push origin feature/auth-implementation
```

### Suggested Development Order

| Branch | Description | Key Files |
|--------|-------------|-----------|
| `feature/auth` | JWT Authentication | SecurityConfig, JwtTokenProvider, AuthService |
| `feature/portfolio` | Portfolio CRUD | PortfolioService, PortfolioController |
| `feature/assets` | Asset management | AssetService, data seeding |
| `feature/prices` | Price integration | FinnhubService, CoinbaseService, PriceService |
| `feature/orders` | Order processing | OrderService, balance management |
| `feature/frontend-auth` | Frontend auth flow | useAuth hook, auth store, login/register pages |
| `feature/frontend-portfolio` | Frontend portfolios | usePortfolio hook, portfolio pages |
| `feature/frontend-trade` | Frontend trading | price hooks, trade pages, charts |
| `feature/ui-polish` | UI improvements | Styling, animations, responsive design |

## 🗄️ Database Schema

### Entities

- **User**: User accounts with authentication
- **Portfolio**: User's portfolios with cash balance
- **Asset**: Stocks and cryptocurrencies
- **Holding**: Portfolio-asset relationship with quantity
- **Order**: Buy/sell transactions

### Entity Relationships

```
User 1:N Portfolio
Portfolio 1:N Holding
Portfolio 1:N Order
Asset 1:N Holding
Asset 1:N Order
```

## 🔌 API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Portfolio
- `GET /api/portfolios` - Get user portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios/{id}` - Get portfolio details
- `POST /api/portfolios/{id}/deposit` - Deposit funds
- `DELETE /api/portfolios/{id}` - Delete portfolio

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/stocks` - Get stocks only
- `GET /api/assets/crypto` - Get crypto only
- `GET /api/assets/{symbol}` - Get asset details

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/portfolio/{id}` - Get portfolio orders

### Prices (Public)
- `GET /api/prices/stock/{symbol}` - Get stock price
- `GET /api/prices/crypto/{symbol}` - Get crypto price
- `GET /api/prices/stock/{symbol}/history` - Get stock history
- `GET /api/prices/crypto/{symbol}/history` - Get crypto history

## 🧪 Testing

### Backend
```bash
cd exchange-backend
mvn test
```

### Frontend
```bash
cd exchange-frontend
npm run lint
npm run build
```

## 📜 License

This is a portfolio project for demonstration purposes.

## 🤝 Author

Hamed Dawoudzai - [GitHub](https://github.com/HamedDawoudzai)
