
Penny Stock Prediction & Portfolio Manager 

A modern full-stack web application for smart penny/small-cap stock analysis, investment-type recommendations, portfolio management, and risk control. Designed for challenging, low-liquidity stocks where data is sparse and traditional models fail. This is the base structure for data processing on penny stocks.

## 🚀 Features

- **Stock Analysis Dashboard**: Enter a stock ticker and view instant analysis powered by up to 15 financial, technical, and alternative data factors.
- **ML-Powered Recommendations**: Scorecard-based logic for buy, avoid, or watchlist, with auto-calculated confidence.
- **Investment Type Integration**: Smart logic for F&O/intraday/long-term, only recommending valid instruments per liquidity, volume, and regulations.
- **Portfolio & Watchlist**: Track your picks, performance, and diversification health in real time.
- **Robust Risk Warnings**: Automated alerts for low liquidity, wide spreads, OTC risk, and high volatility.
- **Educational Content**: Built-in explainer on penny stock risks, metrics, and safe investing.

## 🏗️ Architecture

- **Frontend**: React + Modular CSS, responsive dashboard UI.
- **Backend**: FastAPI with async Python, Dockerized, PostgreSQL/Redis ready.
- **Data Sources**: yfinance, Finnhub, Alpha Vantage (API integration code provided, use your keys).
- **ML Logic**: Feature engineering + weighted scorecard, configurable for future ML model upgrades.
- **DevOps**: Docker, docker-compose, production-ready configs.

## ✨ Key Features

| Category      | Metrics / Capabilities                                                                   |
|---------------|-----------------------------------------------------------------------------------------|
| Valuation     | P/E, P/B, PEG, EV/EBITDA, Dividend Yield                                                |
| Profitability | ROE, ROA, Net Margin, Gross Margin                                                      |
| Solvency/Liq  | Debt/Equity, Interest Coverage, Current Ratio                                           |
| Market/Tech   | Avg Volume, Volatility, Momentum, Spread                                                |
| Alternative   | News Sentiment, Social Attention, Insider Activity                                      |
| Safety/UX     | Auto-alerts on low-volume, spread, OTC, regulatory and position sizing                  |
| Portfolio     | Add to Watchlist/Portfolio, track stats, risk/diversity analytics                       |
| Investing     | Buy/Watchlist/Avoid + guidance on F&O, Intraday, Long-term, or ETF exposure             |

## 📦 Getting Started

## 📊 Example Usage

- Enter a penny/small-cap stock symbol.
- Get real-time analysis, score, and risk status.
- View ML recommendation (Buy/Avoid/Watch), with why-details.
- See recommended investment type (F&O, Intraday, Long-term, Watchlist).
- Add stocks to portfolio, monitor performance, see diversification and risk alerts.


## 🏷 Suggested Topics

- `stocks`
- `finance`
- `machine-learning`
- `react`
- `fastapi`
- `portfolio-management`
- `penny-stocks`
- `algorithmic-trading`
- `fintech`

## ⚠️ Disclaimers & Compliance

- This software is for **educational and research purposes only**.
- **No investment advice is provided.** Do your own research and consult professionals.
- Penny/small-cap stocks carry **significant risk** and may have low liquidity, wide spreads, and regulatory exposure.
- Always read and accept the provided disclaimers within the app.

## 📄 License

[MIT License](./LICENSE)

---
