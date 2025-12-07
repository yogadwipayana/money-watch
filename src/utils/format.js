/**
 * Format number to Indonesian Rupiah currency
 * @param {number} value - The number to format
 * @returns {string} Formatted currency string (e.g., "Rp 1.234.567")
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number with thousand separators
 * @param {number} value - The number to format
 * @returns {string} Formatted number string (e.g., "1.234.567")
 */
export function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Format percentage with sign
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage (e.g., "+12.34%" or "-5.67%")
 */
export function formatPercentage(value, decimals = 2) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format date to Indonesian format
 * @param {Date|string} date - The date to format
 * @param {boolean} includeTime - Whether to include time (default: false)
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
  // Return fallback if date is null, undefined, or empty
  if (!date) {
    return "-";
  }
  
  const d = new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return "-";
  }
  
  if (includeTime) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }
  
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}
