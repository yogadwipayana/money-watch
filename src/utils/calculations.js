/**
 * Calculate total portfolio value (cash + invested)
 * @param {number} cash - Cash balance
 * @param {number} invested - Total invested amount
 * @returns {number} Total portfolio value
 */
export function calculateTotalPortfolio(cash, invested) {
  return cash + invested;
}

/**
 * Calculate total invested from holdings
 * @param {Array} holdings - Array of holding objects (with totalInvested from API or calculate from quantity * averagePrice)
 * @returns {number} Total invested amount
 */
export function calculateTotalInvested(holdings) {
  return holdings.reduce((sum, holding) => {
    // Use totalInvested from API if available, otherwise calculate
    return sum + (holding.totalInvested || (holding.quantity * holding.averagePrice * 100));
  }, 0);
}

/**
 * Calculate profit/loss for a single stock
 * @param {number} currentPrice - Current stock price
 * @param {number} averagePrice - Average purchase price
 * @param {number} quantity - Quantity in lots
 * @returns {number} Profit/loss amount
 */
export function calculateStockPL(currentPrice, averagePrice, quantity) {
  return (currentPrice - averagePrice) * quantity * 100;
}

/**
 * Calculate total profit/loss from holdings
 * @param {Array} holdings - Array of holding objects (with profitLoss from API or calculate from currentPrice, averagePrice, quantity)
 * @returns {number} Total profit/loss
 */
export function calculateTotalPL(holdings) {
  return holdings.reduce((sum, holding) => {
    // Use profitLoss from API if available, otherwise calculate
    if (holding.profitLoss !== undefined && holding.profitLoss !== null) {
      return sum + holding.profitLoss;
    }
    return sum + calculateStockPL(holding.currentPrice || holding.averagePrice, holding.averagePrice, holding.quantity);
  }, 0);
}

/**
 * Calculate profit percentage
 * @param {number} profitLoss - Total profit/loss amount
 * @param {number} invested - Total invested amount
 * @returns {number} Profit percentage
 */
export function calculateProfitPercentage(profitLoss, invested) {
  if (invested === 0) return 0;
  return (profitLoss / invested) * 100;
}

/**
 * Calculate new average price after buy transaction
 * @param {number} currentQty - Current quantity
 * @param {number} currentAvgPrice - Current average price
 * @param {number} buyQty - Buy quantity
 * @param {number} buyPrice - Buy price
 * @returns {number} New average price
 */
export function calculateNewAveragePrice(currentQty, currentAvgPrice, buyQty, buyPrice) {
  if (currentQty + buyQty === 0) return 0;
  return ((currentQty * currentAvgPrice) + (buyQty * buyPrice)) / (currentQty + buyQty);
}

/**
 * Calculate new cash balance after transaction
 * @param {number} currentCash - Current cash balance
 * @param {string} transactionType - Type of transaction (buy, sell, deposit, withdrawal)
 * @param {number} amount - Transaction amount
 * @returns {number} New cash balance
 */
export function calculateNewCashBalance(currentCash, transactionType, amount) {
  switch (transactionType) {
    case 'buy':
    case 'withdrawal':
      return currentCash - amount;
    case 'sell':
    case 'deposit':
      return currentCash + amount;
    default:
      return currentCash;
  }
}

/**
 * Calculate transaction total amount
 * @param {number} price - Price per share
 * @param {number} quantity - Quantity in lots
 * @returns {number} Total transaction amount
 */
export function calculateTransactionAmount(price, quantity) {
  return price * quantity * 100;
}
