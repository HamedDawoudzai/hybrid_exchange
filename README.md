# HybridExchange

A hybrid stock + crypto exchange with a Spring Boot backend and Next.js frontend.

## Current State

- Backend: Implemented JWT auth, Redis-backed JWT blacklist, rate limiting, price caching, Redis serialization fixes, Coinbase/Finnhub price integrations, seed data, improved error handling, and `.env` support. End-to-end flows for register/login/logout, prices (stock/crypto), portfolios (create/deposit/delete), and orders.
- Frontend: Next.js App Router with dark/glass UI, auth flows (login/register), portfolios (list/detail/create), trading (assets list, symbol page with live price/history and orders), orders history, charts via Recharts, toasts via Sonner, React Query + Zustand state, Axios API client with auth header.

## Architecture

```
hybrid_exchange/
├── exchange-backend/     # Spring Boot REST API (port 8080)
├── exchange-frontend/    # Next.js app (port 3000)
└── docker-compose.yml    # PostgreSQL + Redis
```

## Tech Stack

**Backend**
- Java 17+, Spring Boot 3.2+
- Spring Security + JWT, Redis (cache + blacklist + rate limiting)
- PostgreSQL, Spring Data JPA
- WebClient for Finnhub/Coinbase
- Maven

**Frontend**
- Next.js 14 (App Router), React 18, TypeScript
- TailwindCSS, Recharts, Sonner (toasts)
- Zustand (state), TanStack Query (data fetching)
- Axios client with JWT header

**External APIs**
- Finnhub (stock prices)
- Coinbase Exchange (crypto prices)

## Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+

## Setup

### 1) Infra (Postgres + Redis)
```bash
docker-compose up -d
# Postgres on 5432, Redis on 6379
```

### 2) Backend
```bash
cd exchange-backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 3) Frontend
```bash
cd exchange-frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Environment

Create `.env` in `exchange-backend` (or export env vars):
```
# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/exchange_db
SPRING_DATASOURCE_USERNAME=exchange_user
SPRING_DATASOURCE_PASSWORD=exchange_password

app.jwt.secret=change-me
app.jwt.expiration=86400000

spring.data.redis.host=localhost
spring.data.redis.port=6379

app.finnhub.api-key=YOUR_FINNHUB_KEY
app.finnhub.base-url=https://finnhub.io/api/v1
app.coinbase.base-url=https://api.exchange.coinbase.com
```

Frontend uses `/api` rewrites to the backend; no API keys stored in the frontend.

## Database

- Schema: users, assets, portfolios, holdings, orders (status/type as varchar).
- Seed script `seed_all.sql` truncates and seeds users/assets/portfolios/holdings/orders.

## Backend Highlights

- JWT auth with blacklist (Redis) + logout invalidation
- Rate limiting (Redis) on auth/price endpoints
- Price caching (Redis), proper Java time serialization
- Finnhub (stocks) + Coinbase (crypto) live prices and OHLC
- Portfolio deposit/delete handling with better errors

## Frontend Highlights

- Auth: login/register, JWT header via Axios, Zustand store, toasts on success/fail
- Portfolios: list, detail, create (modal), holdings display
- Trading: assets list with filters/search; symbol page with live price/history, order placement per portfolio
- Orders: user-wide history with sorting
- UI: dark/glass theme, responsive, Recharts price chart, Sonner toasts

## Testing

Backend:
```bash
cd exchange-backend
mvn test
```

Frontend:
```bash
cd exchange-frontend
npm run lint
npm run build
```

## Nice-to-Haves

- Auth guard for protected routes (redirect to /login)
- Mobile drawer for header nav
- Client-side validation (Zod) on forms
- ReactQueryDevtools in dev
- Advanced chart types (candles/ohlc) if needed
