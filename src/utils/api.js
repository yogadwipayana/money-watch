import { getAccessToken, refreshAccessToken } from "./auth.js";

/**
 * Make authenticated API request with automatic token refresh
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<object>} API response data
 */
export async function apiRequest(endpoint, options = {}, cookies) {
  const apiUrl = import.meta.env.API_URL;
  let token = getAccessToken(cookies);

  const makeRequest = async (accessToken) => {
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    };

    return await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
  };

  // First attempt with current token
  let response = await makeRequest(token);

  // If 401 Unauthorized, try to refresh token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken(cookies);
    
    if (refreshed) {
      // Retry request with new token
      token = getAccessToken(cookies);
      response = await makeRequest(token);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch all brokers for authenticated user
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<Array>} Array of broker objects
 */
export async function fetchBrokers(cookies) {
  const data = await apiRequest("/broker", { method: "GET" }, cookies);
  return data.data || [];
}

/**
 * Create new broker
 * @param {object} brokerData - Broker data {brokerName, cashBalance}
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<object>} Created broker object
 */
export async function createBroker(brokerData, cookies) {
  const data = await apiRequest("/broker", {
    method: "POST",
    body: JSON.stringify(brokerData),
  }, cookies);
  return data.data;
}

/**
 * Delete broker by ID
 * @param {number} brokerId - Broker ID
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<object>} Response data
 */
export async function deleteBroker(brokerId, cookies) {
  return await apiRequest(`/broker/${brokerId}`, {
    method: "DELETE",
  }, cookies);
}

/**
 * Fetch holdings for a broker
 * @param {number} brokerId - Broker ID
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<Array>} Array of holding objects
 */
export async function fetchHoldings(brokerId, cookies) {
  const data = await apiRequest(`/broker/holding?brokerId=${brokerId}`, { method: "GET" }, cookies);
  return data.data || [];
}

/**
 * Fetch transactions with filters
 * @param {object} filters - Filter parameters {broker_id, date_from, date_to, type, stock_code}
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<Array>} Array of transaction objects
 */
export async function fetchTransactions(filters, cookies) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const data = await apiRequest(`/transaction?${params.toString()}`, { method: "GET" }, cookies);
  return data.data || [];
}

/**
 * Create new transaction
 * @param {object} transactionData - Transaction data (brokerId, transactionType, stockCode, quantity, price, totalAmount, transactionDate)
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<object>} Created transaction object
 */
export async function createTransaction(transactionData, cookies) {
  console.log("API Request - Create Transaction:", JSON.stringify(transactionData, null, 2));
  
  const data = await apiRequest("/transaction", {
    method: "POST",
    body: JSON.stringify(transactionData),
  }, cookies);
  
  console.log("API Response - Create Transaction:", JSON.stringify(data, null, 2));
  return data.data;
}

/**
 * Delete transaction by ID
 * @param {number} transactionId - Transaction ID
 * @param {object} cookies - Astro cookies object
 * @returns {Promise<object>} Response data
 */
export async function deleteTransaction(transactionId, cookies) {
  return await apiRequest(`/transaction/${transactionId}`, {
    method: "DELETE",
  }, cookies);
}
