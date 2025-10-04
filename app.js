// Sample stock data and configuration
const SAMPLE_STOCKS = [
  {
    symbol: "RAJOO",
    name: "Rajoo Engineers Ltd",
    currentPrice: 82.81,
    marketCap: 1619.21,
    exchange: "NSE",
    volume: 45000,
    pe: 33.97,
    pb: 2.1,
    roe: 32.62,
    debt: 0.0,
    sentiment: 0.6,
    optionable: false,
    liquidity: "low",
    recommendation: "watchlist"
  },
  {
    symbol: "CELLECOR",
    name: "Cellecor Gadgets Ltd",
    currentPrice: 31.60,
    marketCap: 687.86,
    exchange: "NSE",
    volume: 89000,
    pe: 22.26,
    pb: 1.8,
    roe: 24.21,
    debt: 0.77,
    sentiment: 0.4,
    optionable: false,
    liquidity: "medium",
    recommendation: "long-term"
  },
  {
    symbol: "RADHIKA",
    name: "Radhika Jeweltec Ltd",
    currentPrice: 90.25,
    marketCap: 1093.14,
    exchange: "NSE",
    volume: 23000,
    pe: 17.45,
    pb: 1.2,
    roe: 25.78,
    debt: 0.13,
    sentiment: 0.7,
    optionable: false,
    liquidity: "low",
    recommendation: "buy"
  }
];

const INVESTMENT_TYPES = [
  {
    type: "F&O",
    description: "Futures and Options trading",
    requirements: ["High liquidity", "Exchange listing", "Minimum volume thresholds"],
    suitability: "Very few penny stocks qualify"
  },
  {
    type: "Intraday",
    description: "Same-day buy and sell",
    requirements: ["Adequate volume", "Tight spreads", "Volatility"],
    suitability: "Only liquid penny stocks"
  },
  {
    type: "Long-term",
    description: "Buy and hold strategy",
    requirements: ["Strong fundamentals", "Growth potential", "Manageable debt"],
    suitability: "Fundamentally sound small companies"
  },
  {
    type: "Watchlist",
    description: "Monitor for future opportunities",
    requirements: ["Interesting story", "Too risky currently", "Needs more data"],
    suitability: "High-risk but potentially rewarding stocks"
  }
];

// Application state
let currentStock = null;
let portfolio = JSON.parse(localStorage.getItem('pennystock-portfolio')) || [];
let watchlist = JSON.parse(localStorage.getItem('pennystock-watchlist')) || [];

// DOM elements
const elements = {
  // Navigation
  navBtns: document.querySelectorAll('.nav-btn'),
  views: document.querySelectorAll('.view'),
  themeToggle: document.getElementById('themeToggle'),
  
  // Search
  stockInput: document.getElementById('stockInput'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  searchSuggestions: document.getElementById('searchSuggestions'),
  quickStockBtns: document.querySelectorAll('.quick-stock'),
  
  // Analysis results
  analysisResults: document.getElementById('analysisResults'),
  stockName: document.getElementById('stockName'),
  stockSymbol: document.getElementById('stockSymbol'),
  stockExchange: document.getElementById('stockExchange'),
  currentPrice: document.getElementById('currentPrice'),
  marketCap: document.getElementById('marketCap'),
  confidenceScore: document.getElementById('confidenceScore'),
  recommendationType: document.getElementById('recommendationType'),
  investmentType: document.getElementById('investmentType'),
  recommendationReason: document.getElementById('recommendationReason'),
  
  // Feature categories
  valuationMetrics: document.getElementById('valuationMetrics'),
  profitabilityMetrics: document.getElementById('profitabilityMetrics'),
  solvencyMetrics: document.getElementById('solvencyMetrics'),
  marketMetrics: document.getElementById('marketMetrics'),
  alternativeMetrics: document.getElementById('alternativeMetrics'),
  riskIndicators: document.getElementById('riskIndicators'),
  
  // Action buttons
  addToPortfolioBtn: document.getElementById('addToPortfolioBtn'),
  addToWatchlistBtn: document.getElementById('addToWatchlistBtn'),
  analyzeAnotherBtn: document.getElementById('analyzeAnotherBtn'),
  
  // Portfolio
  portfolioTabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  totalHoldings: document.getElementById('totalHoldings'),
  portfolioRisk: document.getElementById('portfolioRisk'),
  diversificationScore: document.getElementById('diversificationScore'),
  holdingsList: document.getElementById('holdingsList'),
  watchlistContainer: document.getElementById('watchlistContainer'),
  
  // Education
  investmentTypesGrid: document.getElementById('investmentTypesGrid'),
  
  // Loading
  loadingOverlay: document.getElementById('loadingOverlay'),
  loadingSteps: document.querySelectorAll('.loading-step')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeSearch();
  initializePortfolio();
  initializeEducation();
  initializeTheme();
  updatePortfolioSummary();
});

// Navigation functionality
function initializeNavigation() {
  elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewName = btn.dataset.view;
      switchView(viewName);
      
      // Update active nav button
      elements.navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // Portfolio tab switching
  elements.portfolioTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      switchTab(tabName);
      
      elements.portfolioTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function switchView(viewName) {
  elements.views.forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  // Update portfolio data when switching to portfolio view
  if (viewName === 'portfolio') {
    updatePortfolioDisplay();
  }
}

function switchTab(tabName) {
  elements.tabContents.forEach(content => {
    content.classList.remove('active');
  });
  
  const targetTab = document.getElementById(`${tabName}-tab`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

// Search functionality
function initializeSearch() {
  elements.stockInput.addEventListener('input', handleSearchInput);
  elements.stockInput.addEventListener('keypress', handleSearchKeypress);
  elements.analyzeBtn.addEventListener('click', analyzeStock);
  
  elements.quickStockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const symbol = btn.dataset.symbol;
      elements.stockInput.value = symbol;
      analyzeStock();
    });
  });
  
  elements.analyzeAnotherBtn.addEventListener('click', () => {
    elements.analysisResults.classList.add('hidden');
    elements.stockInput.value = '';
    elements.stockInput.focus();
  });
}

function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  
  if (query.length < 1) {
    hideSuggestions();
    return;
  }
  
  const suggestions = SAMPLE_STOCKS.filter(stock => 
    stock.symbol.toLowerCase().includes(query) || 
    stock.name.toLowerCase().includes(query)
  );
  
  showSuggestions(suggestions);
}

function handleSearchKeypress(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    analyzeStock();
  }
}

function showSuggestions(suggestions) {
  elements.searchSuggestions.innerHTML = '';
  
  if (suggestions.length === 0) {
    hideSuggestions();
    return;
  }
  
  suggestions.forEach(stock => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `
      <div>
        <strong>${stock.symbol}</strong> - ${stock.name}
        <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
          ₹${stock.currentPrice} | ${stock.exchange}
        </div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      elements.stockInput.value = stock.symbol;
      hideSuggestions();
      analyzeStock();
    });
    
    elements.searchSuggestions.appendChild(item);
  });
  
  elements.searchSuggestions.classList.add('active');
}

function hideSuggestions() {
  elements.searchSuggestions.classList.remove('active');
}

// Stock analysis functionality
async function analyzeStock() {
  const symbol = elements.stockInput.value.trim().toUpperCase();
  
  if (!symbol) {
    alert('Please enter a stock symbol');
    return;
  }
  
  // Show loading overlay
  showLoading();
  
  try {
    // Simulate API delay
    await simulateAnalysis();
    
    // Find stock data
    const stockData = SAMPLE_STOCKS.find(stock => stock.symbol === symbol);
    
    if (!stockData) {
      throw new Error('Stock not found in our database');
    }
    
    currentStock = stockData;
    displayAnalysisResults(stockData);
    
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    hideLoading();
  }
}

async function simulateAnalysis() {
  const steps = ['step1', 'step2', 'step3', 'step4'];
  const delays = [800, 600, 700, 500];
  
  for (let i = 0; i < steps.length; i++) {
    const stepElement = document.getElementById(steps[i]);
    stepElement.classList.add('active');
    await new Promise(resolve => setTimeout(resolve, delays[i]));
  }
}

function showLoading() {
  elements.loadingOverlay.classList.remove('hidden');
  elements.loadingSteps.forEach(step => step.classList.remove('active'));
}

function hideLoading() {
  elements.loadingOverlay.classList.add('hidden');
}

function displayAnalysisResults(stock) {
  // Basic stock info
  elements.stockName.textContent = stock.name;
  elements.stockSymbol.textContent = stock.symbol;
  elements.stockExchange.textContent = stock.exchange;
  elements.currentPrice.textContent = `₹${stock.currentPrice}`;
  elements.marketCap.textContent = `Market Cap: ₹${stock.marketCap}Cr`;
  
  // ML recommendation
  const confidence = calculateConfidence(stock);
  elements.confidenceScore.textContent = `${confidence}% Confidence`;
  
  elements.recommendationType.textContent = stock.recommendation;
  elements.recommendationType.className = `recommendation-type ${stock.recommendation}`;
  
  const investmentTypeInfo = getInvestmentTypeRecommendation(stock);
  elements.investmentType.textContent = investmentTypeInfo.type;
  elements.recommendationReason.textContent = investmentTypeInfo.reason;
  
  // Feature analysis
  displayFeatureMetrics(stock);
  
  // Show results
  elements.analysisResults.classList.remove('hidden');
  elements.analysisResults.scrollIntoView({ behavior: 'smooth' });
  
  // Update action buttons
  updateActionButtons(stock);
}

function calculateConfidence(stock) {
  let score = 50; // Base confidence
  
  // Adjust based on various factors
  if (stock.liquidity === 'high') score += 20;
  else if (stock.liquidity === 'medium') score += 10;
  
  if (stock.sentiment > 0.6) score += 15;
  else if (stock.sentiment < 0.3) score -= 15;
  
  if (stock.pe < 20) score += 10;
  if (stock.debt < 0.5) score += 10;
  if (stock.roe > 20) score += 10;
  
  return Math.min(95, Math.max(30, score));
}

function getInvestmentTypeRecommendation(stock) {
  if (stock.optionable && stock.liquidity === 'high') {
    return {
      type: 'F&O Eligible',
      reason: 'High liquidity and options availability make this suitable for derivatives trading.'
    };
  }
  
  if (stock.liquidity === 'medium' && stock.volume > 50000) {
    return {
      type: 'Intraday Possible',
      reason: 'Adequate volume supports intraday trading with manageable slippage.'
    };
  }
  
  if (stock.recommendation === 'buy') {
    return {
      type: 'Long-term Investment',
      reason: 'Strong fundamentals suggest good long-term growth potential.'
    };
  }
  
  return {
    type: 'Watchlist Only',
    reason: 'Monitor for improved liquidity or fundamental changes before investing.'
  };
}

function displayFeatureMetrics(stock) {
  // Valuation metrics
  const valuationHTML = `
    <div class="metric-item">
      <span class="metric-label">P/E Ratio</span>
      <div class="metric-value">
        ${stock.pe}
        <span class="metric-indicator ${stock.pe < 25 ? 'good' : 'neutral'}"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">P/B Ratio</span>
      <div class="metric-value">
        ${stock.pb}
        <span class="metric-indicator ${stock.pb < 2 ? 'good' : 'neutral'}"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">PEG Ratio</span>
      <div class="metric-value">
        ${(stock.pe / (stock.roe * 0.5)).toFixed(2)}
        <span class="metric-indicator neutral"></span>
      </div>
    </div>
  `;
  elements.valuationMetrics.innerHTML = valuationHTML;
  
  // Profitability metrics
  const profitabilityHTML = `
    <div class="metric-item">
      <span class="metric-label">ROE</span>
      <div class="metric-value">
        ${stock.roe}%
        <span class="metric-indicator ${stock.roe > 15 ? 'good' : 'neutral'}"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">ROA</span>
      <div class="metric-value">
        ${(stock.roe * 0.7).toFixed(1)}%
        <span class="metric-indicator good"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">Net Profit Margin</span>
      <div class="metric-value">
        ${(stock.roe * 0.3).toFixed(1)}%
        <span class="metric-indicator good"></span>
      </div>
    </div>
  `;
  elements.profitabilityMetrics.innerHTML = profitabilityHTML;
  
  // Solvency metrics
  const solvencyHTML = `
    <div class="metric-item">
      <span class="metric-label">Debt/Equity</span>
      <div class="metric-value">
        ${stock.debt}
        <span class="metric-indicator ${stock.debt < 0.5 ? 'good' : 'bad'}"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">Current Ratio</span>
      <div class="metric-value">
        ${(1.2 + Math.random() * 0.8).toFixed(2)}
        <span class="metric-indicator good"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">Interest Coverage</span>
      <div class="metric-value">
        ${stock.debt === 0 ? 'N/A' : (15 + Math.random() * 10).toFixed(1)}
        <span class="metric-indicator ${stock.debt === 0 ? 'good' : 'neutral'}"></span>
      </div>
    </div>
  `;
  elements.solvencyMetrics.innerHTML = solvencyHTML;
  
  // Market metrics
  const marketHTML = `
    <div class="metric-item">
      <span class="metric-label">Avg Daily Volume</span>
      <div class="metric-value">
        ${stock.volume.toLocaleString()}
        <span class="metric-indicator ${stock.volume > 50000 ? 'good' : 'bad'}"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">Volatility (30d)</span>
      <div class="metric-value">
        ${(25 + Math.random() * 20).toFixed(1)}%
        <span class="metric-indicator neutral"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">Momentum (1M)</span>
      <div class="metric-value">
        ${(Math.random() * 30 - 15).toFixed(1)}%
        <span class="metric-indicator neutral"></span>
      </div>
    </div>
  `;
  elements.marketMetrics.innerHTML = marketHTML;
  
  // Alternative data metrics
  const alternativeHTML = `
    <div class="metric-item">
      <span class="metric-label">News Sentiment</span>
      <div class="metric-value">
        ${(stock.sentiment * 100).toFixed(0)}%
        <span class="metric-indicator ${stock.sentiment > 0.6 ? 'good' : stock.sentiment < 0.4 ? 'bad' : 'neutral'}"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">Social Attention</span>
      <div class="metric-value">
        ${Math.floor(Math.random() * 100)}
        <span class="metric-indicator neutral"></span>
      </div>
    </div>
    <div class="metric-item">
      <span class="metric-label">Insider Activity</span>
      <div class="metric-value">
        ${Math.random() > 0.5 ? 'Buying' : 'Neutral'}
        <span class="metric-indicator ${Math.random() > 0.5 ? 'good' : 'neutral'}"></span>
      </div>
    </div>
  `;
  elements.alternativeMetrics.innerHTML = alternativeHTML;
  
  // Risk indicators
  displayRiskIndicators(stock);
}

function displayRiskIndicators(stock) {
  const risks = [];
  
  if (stock.liquidity === 'low') {
    risks.push({ level: 'high', text: 'Low liquidity may result in execution difficulties' });
  }
  
  if (stock.volume < 50000) {
    risks.push({ level: 'medium', text: 'Below average trading volume' });
  }
  
  if (stock.debt > 0.7) {
    risks.push({ level: 'high', text: 'High debt levels increase financial risk' });
  }
  
  if (!stock.optionable) {
    risks.push({ level: 'medium', text: 'No options available for hedging' });
  }
  
  if (stock.exchange !== 'NSE' && stock.exchange !== 'BSE') {
    risks.push({ level: 'high', text: 'OTC trading increases regulatory risk' });
  }
  
  if (risks.length === 0) {
    risks.push({ level: 'low', text: 'Relatively low risk profile' });
  }
  
  const riskHTML = risks.map(risk => `
    <div class="risk-indicator">
      <span class="risk-level ${risk.level}">${risk.level}</span>
      <span>${risk.text}</span>
    </div>
  `).join('');
  
  elements.riskIndicators.innerHTML = riskHTML;
}

function updateActionButtons(stock) {
  elements.addToPortfolioBtn.onclick = () => addToPortfolio(stock);
  elements.addToWatchlistBtn.onclick = () => addToWatchlist(stock);
  
  // Update button states
  const inPortfolio = portfolio.some(p => p.symbol === stock.symbol);
  const inWatchlist = watchlist.some(w => w.symbol === stock.symbol);
  
  elements.addToPortfolioBtn.textContent = inPortfolio ? 'In Portfolio' : 'Add to Portfolio';
  elements.addToPortfolioBtn.disabled = inPortfolio;
  
  elements.addToWatchlistBtn.textContent = inWatchlist ? 'In Watchlist' : 'Add to Watchlist';
  elements.addToWatchlistBtn.disabled = inWatchlist;
}

// Portfolio management
function initializePortfolio() {
  updatePortfolioDisplay();
}

function addToPortfolio(stock) {
  if (!portfolio.some(p => p.symbol === stock.symbol)) {
    portfolio.push({
      ...stock,
      dateAdded: new Date().toISOString(),
      quantity: 0, // User would specify quantity in real app
      avgPrice: stock.currentPrice
    });
    
    localStorage.setItem('pennystock-portfolio', JSON.stringify(portfolio));
    updatePortfolioSummary();
    updateActionButtons(stock);
    
    alert(`${stock.symbol} added to portfolio!`);
  }
}

function addToWatchlist(stock) {
  if (!watchlist.some(w => w.symbol === stock.symbol)) {
    watchlist.push({
      ...stock,
      dateAdded: new Date().toISOString()
    });
    
    localStorage.setItem('pennystock-watchlist', JSON.stringify(watchlist));
    updatePortfolioDisplay();
    updateActionButtons(stock);
    
    alert(`${stock.symbol} added to watchlist!`);
  }
}

function updatePortfolioSummary() {
  elements.totalHoldings.textContent = portfolio.length;
  
  // Calculate risk level
  const avgRisk = portfolio.length > 0 
    ? portfolio.reduce((sum, stock) => {
        let risk = 1; // Low risk = 1, Medium = 2, High = 3
        if (stock.liquidity === 'medium') risk = 2;
        if (stock.liquidity === 'low') risk = 3;
        return sum + risk;
      }, 0) / portfolio.length
    : 0;
  
  elements.portfolioRisk.textContent = avgRisk === 0 ? '-' : 
    avgRisk < 1.5 ? 'Low' : avgRisk < 2.5 ? 'Medium' : 'High';
  
  // Simple diversification score
  const diversification = portfolio.length > 0 ? Math.min(100, portfolio.length * 20) : 0;
  elements.diversificationScore.textContent = portfolio.length > 0 ? `${diversification}%` : '-';
}

function updatePortfolioDisplay() {
  // Update holdings
  if (portfolio.length === 0) {
    elements.holdingsList.innerHTML = '<div class="empty-state"><p>No holdings yet. Start by analyzing stocks and adding them to your portfolio.</p></div>';
  } else {
    const holdingsHTML = portfolio.map(stock => `
      <div class="holding-card">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h4 class="m-0">${stock.symbol}</h4>
            <p class="text-secondary" style="font-size: var(--font-size-sm); margin: var(--space-4) 0 0 0;">${stock.name}</p>
          </div>
          <button class="btn btn--outline btn--sm" onclick="removeFromPortfolio('${stock.symbol}')">Remove</button>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-secondary">Added: ${new Date(stock.dateAdded).toLocaleDateString()}</span>
          <span class="price-large" style="font-size: var(--font-size-lg);">₹${stock.currentPrice}</span>
        </div>
      </div>
    `).join('');
    
    elements.holdingsList.innerHTML = holdingsHTML;
  }
  
  // Update watchlist
  if (watchlist.length === 0) {
    elements.watchlistContainer.innerHTML = '<div class="empty-state"><p>No stocks in watchlist. Add interesting stocks to monitor their progress.</p></div>';
  } else {
    const watchlistHTML = watchlist.map(stock => `
      <div class="watchlist-item">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h4 class="m-0">${stock.symbol}</h4>
            <p class="text-secondary" style="font-size: var(--font-size-sm); margin: var(--space-4) 0 0 0;">${stock.name}</p>
          </div>
          <button class="btn btn--outline btn--sm" onclick="removeFromWatchlist('${stock.symbol}')">Remove</button>
        </div>
        <div class="flex justify-between items-center">
          <span class="recommendation-type ${stock.recommendation}">${stock.recommendation}</span>
          <span class="price-large" style="font-size: var(--font-size-lg);">₹${stock.currentPrice}</span>
        </div>
      </div>
    `).join('');
    
    elements.watchlistContainer.innerHTML = watchlistHTML;
  }
}

function removeFromPortfolio(symbol) {
  portfolio = portfolio.filter(stock => stock.symbol !== symbol);
  localStorage.setItem('pennystock-portfolio', JSON.stringify(portfolio));
  updatePortfolioSummary();
  updatePortfolioDisplay();
  
  if (currentStock && currentStock.symbol === symbol) {
    updateActionButtons(currentStock);
  }
}

function removeFromWatchlist(symbol) {
  watchlist = watchlist.filter(stock => stock.symbol !== symbol);
  localStorage.setItem('pennystock-watchlist', JSON.stringify(watchlist));
  updatePortfolioDisplay();
  
  if (currentStock && currentStock.symbol === symbol) {
    updateActionButtons(currentStock);
  }
}

// Education section
function initializeEducation() {
  const investmentTypesHTML = INVESTMENT_TYPES.map(type => `
    <div class="investment-type-card">
      <h4>${type.type}</h4>
      <p class="type-description">${type.description}</p>
      <div class="requirements">
        <strong>Requirements:</strong>
        <ul>
          ${type.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
        <strong>Suitability:</strong> ${type.suitability}
      </div>
    </div>
  `).join('');
  
  elements.investmentTypesGrid.innerHTML = investmentTypesHTML;
}

// Theme functionality
function initializeTheme() {
  const savedTheme = localStorage.getItem('pennystock-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);
  
  elements.themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('pennystock-theme', currentTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-color-scheme', theme);
  elements.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

function formatPercentage(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Click outside to close suggestions
document.addEventListener('click', (e) => {
  if (!elements.stockInput.contains(e.target) && !elements.searchSuggestions.contains(e.target)) {
    hideSuggestions();
  }
});

// Make remove functions globally accessible
window.removeFromPortfolio = removeFromPortfolio;
window.removeFromWatchlist = removeFromWatchlist;