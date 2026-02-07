<div align="center">

# HD Investing Corporation

### A Premium Hybrid Stock & Cryptocurrency Trading Platform

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started) · [API Integrations](#-api-integrations)

</div>

---

## Overview

**HD Investing Corporation** is a full-stack trading platform that unifies stock and cryptocurrency markets into a single, elegant interface. Users can create multiple portfolios, execute market/limit/stop-loss orders, track real-time prices, monitor performance with interactive charts, and manage a personal watchlist — all wrapped in a premium dark UI with gold accents.

Built as a production-grade monorepo with a **Spring Boot** REST API backend and a **Next.js** frontend, the platform integrates live market data from **Polygon.io** (stocks) and **Coinbase Exchange** (crypto), with **Redis**-powered caching and **PostgreSQL** persistence.

---

## Screenshots

### Landing Page
A sleek, branded entry point that sets the tone for the platform experience.

<img src="screenshots/Landing_page_for_website.png" alt="Landing Page" width="850"/>

---

### Authentication
Secure sign-in page with JWT-based authentication. New users can register with a username, email, and password. Includes branded visuals and platform stats at a glance.

<img src="screenshots/Sign_up.png" alt="Sign In Page" width="850"/>

---

### Dashboard
Your financial command center. At a glance you can see total net worth, profit & loss, and available cash balance. Quick-access cards for your portfolios, watchlist, and pending limit orders. Deposit and withdraw cash directly from the dashboard.

<img src="screenshots/Account_homepage.png" alt="Dashboard" width="850"/>

---

### Markets — Trade Page
Browse all available stocks and cryptocurrencies with live prices updated in real time. Filter by asset type (Stocks / Crypto), search by symbol or name, and click any asset to open the trading view. Each row shows the current price, 24h change, and change percentage with color-coded indicators.

<img src="screenshots/crypto:stocks_trading_page.png" alt="Trade Page" width="850"/>

---

### Portfolio Management
Create and manage multiple portfolios for different strategies — separate your long-term holdings from swing trades, or keep stocks and crypto in dedicated portfolios. Each card displays total value, number of holdings, and real-time P&L.

<img src="screenshots/Multiple_portfolios_page.png" alt="Portfolios" width="850"/>

---

### Portfolio Performance
Dive into any portfolio to see detailed performance analytics. Interactive line chart with configurable time intervals (1 Min, 5 Min, 15 Min, 1 Hour, 1 Day). Summary cards show total value, cost basis, and profit/loss with percentage. Below the chart, view individual holdings with quantity, average buy price, and current value.

<img src="screenshots/Portfolio_performance.png" alt="Portfolio Performance" width="850"/>

---

### Transaction History
Complete audit trail of every order across all portfolios. Sortable table showing date, asset, order type (Buy/Sell/Deposit), execution status, quantity, price per unit, and total value. Color-coded labels make it easy to scan — green for buys, red for sells, yellow for deposits.

<img src="screenshots/Transac_history_page.png" alt="Transaction History" width="850"/>

---

## Features

### Trading Engine
- **Market Orders** — Instant buy/sell at the current market price
- **Limit Orders** — Set a target price and the system automatically executes when the market reaches it
- **Stop-Loss Orders** — Protect your positions with automated sell triggers
- **Multi-Portfolio Support** — Choose which portfolio to trade from on every order
- **Fractional Shares** — Buy any amount, down to 6 decimal places

### Portfolio Management
- **Multiple Portfolios** — Create unlimited portfolios with custom names and descriptions
- **Real-Time Valuation** — Holdings are priced against live market data
- **Performance Charts** — Interactive Recharts-powered graphs with 5 time intervals
- **P&L Tracking** — Cost basis, current value, and profit/loss calculated per-holding and per-portfolio
- **Cash Management** — Deposit and withdraw funds with full transaction records

### Market Data
- **Live Stock Prices** — Powered by Polygon.io with Redis caching (5-min TTL)
- **Live Crypto Prices** — Powered by Coinbase Exchange API (no API key required)
- **Historical Charts** — OHLCV candle data for both stocks and crypto
- **24h Change Indicators** — Price change and percentage with color-coded up/down arrows

### Watchlist
- **Star any asset** from the trade page to add it to your personal watchlist
- **Dashboard widget** shows your watchlist at a glance
- **Synced across sessions** — watchlist is persisted server-side

### User Experience
- **Dark Premium UI** — Black and gold theme inspired by luxury financial platforms
- **Responsive Design** — Fully functional on desktop and tablet
- **Confetti on Buy** — A satisfying gold confetti burst celebrates every purchase
- **Toast Notifications** — Real-time feedback via Sonner for every action
- **Smooth Transitions** — Polished animations and hover states throughout

---

## Tech Stack

### Backend

| Technology | Purpose |
|:--|:--|
| ![Java](https://img.shields.io/badge/Java_17-ED8B00?logo=openjdk&logoColor=white) | Language runtime |
| ![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?logo=springboot&logoColor=white) | REST API framework |
| ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?logo=springsecurity&logoColor=white) | JWT authentication & authorization |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) | Relational database |
| ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white) | Price caching, JWT blacklist, rate limiting |
| ![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?logo=spring&logoColor=white) | ORM & repository layer |
| ![Maven](https://img.shields.io/badge/Maven-C71A36?logo=apachemaven&logoColor=white) | Build & dependency management |

### Frontend

| Technology | Purpose |
|:--|:--|
| ![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=next.js&logoColor=white) | React framework with App Router |
| ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white) | Type-safe development |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_3-06B6D4?logo=tailwindcss&logoColor=white) | Utility-first styling |
| ![React Query](https://img.shields.io/badge/TanStack_Query_5-FF4154?logo=reactquery&logoColor=white) | Server state & data fetching |
| ![Zustand](https://img.shields.io/badge/Zustand_4-433E38?logo=react&logoColor=white) | Client state management |
| ![Recharts](https://img.shields.io/badge/Recharts_2-FF6384?logo=chart.js&logoColor=white) | Interactive performance charts |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white) | HTTP client with JWT interceptor |

### Infrastructure

| Technology | Purpose |
|:--|:--|
| ![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white) | PostgreSQL + Redis containers |
| ![Polygon](https://img.shields.io/badge/Polygon.io-5C4EE5) | Stock market data API |
| ![Coinbase](https://img.shields.io/badge/Coinbase_Exchange-0052FF?logo=coinbase&logoColor=white) | Cryptocurrency price API |

---

## Getting Started

### Prerequisites

- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **npm**
- **Docker & Docker Compose** (for PostgreSQL and Redis)

### 1. Start Infrastructure

```bash
docker-compose up -d
# PostgreSQL on port 5432, Redis on port 6379
```

### 2. Configure Environment

Create `exchange-backend/.env`:

```env
POLYGON_API_KEY=your_polygon_api_key
FINNHUB_API_KEY=your_finnhub_api_key
```

> Polygon.io free tier provides 5 API calls/minute. Sign up at [polygon.io](https://polygon.io/) to get a key.
> Crypto prices use the public Coinbase Exchange API — no key required.

### 3. Start Backend

```bash
cd exchange-backend
mvn clean install
mvn spring-boot:run
# API running at http://localhost:8080
```

### 4. Start Frontend

```bash
cd exchange-frontend
npm install
npm run dev
# App running at http://localhost:3000
```

---

## API Integrations

| Provider | Data | Tier |
|:--|:--|:--|
| **Polygon.io** | Stock quotes (previous day close), historical OHLCV bars | Free (5 req/min, 15-min delayed) |
| **Coinbase Exchange** | Live crypto prices, 24h stats, historical candles | Public (no key required) |

Prices are cached in Redis with a 5-minute TTL to minimize external API calls and ensure fast response times across the platform.

---

## Project Structure

```
hybrid_exchange/
├── exchange-backend/          # Spring Boot REST API
│   ├── src/main/java/com/exchange/
│   │   ├── config/            # Security, Redis, CORS, WebClient, data seeding
│   │   ├── controller/        # REST endpoints (auth, assets, orders, prices, portfolios)
│   │   ├── dto/               # Request/response DTOs
│   │   ├── entity/            # JPA entities (User, Asset, Portfolio, Order, Holding)
│   │   ├── exception/         # Global error handling
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── security/          # JWT filter, token provider, user principal
│   │   └── service/           # Business logic (orders, pricing, portfolios)
│   └── src/main/resources/
│       └── application.yml    # App configuration
│
├── exchange-frontend/         # Next.js 16 App
│   ├── src/app/               # App Router pages (dashboard, trade, portfolio, history)
│   ├── src/components/        # Reusable UI (OrderForm, PriceChart, WatchlistStar)
│   ├── src/hooks/             # Custom hooks (useAuth, useAssets, usePrices, usePortfolio)
│   ├── src/lib/               # API client, utilities, confetti
│   └── src/types/             # TypeScript type definitions
│
├── docker-compose.yml         # PostgreSQL + Redis
└── screenshots/               # Application screenshots
```

---

<div align="center">

### Built by [Hamed Dawoudzai](https://github.com/HamedDawoudzai)

**[Back to Top](#hd-investing-corporation)**

</div>
