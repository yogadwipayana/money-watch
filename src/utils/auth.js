/**
 * Utility functions for authentication
 */

const ACCESS_TOKEN_COOKIE_NAME = "access_token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Set authentication tokens in cookies
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export function setAuthTokens(cookies, accessToken, refreshToken) {
  cookies.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: import.meta.env.PROD, // Only secure in production (HTTPS)
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: "/",
  });

  cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/",
  });
}

/**
 * Get access token from cookie
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @returns {string | null} - Access token or null if not found
 */
export function getAccessToken(cookies) {
  return cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * Get refresh token from cookie
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @returns {string | null} - Refresh token or null if not found
 */
export function getRefreshToken(cookies) {
  return cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * Get authentication token from cookie (alias for getAccessToken for backward compatibility)
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @returns {string | null} - Token or null if not found
 */
export function getAuthToken(cookies) {
  return getAccessToken(cookies);
}

/**
 * Check if user is authenticated
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @returns {boolean} - True if access token exists
 */
export function isAuthenticated(cookies) {
  const token = getAccessToken(cookies);
  return token !== null && token !== undefined;
}

/**
 * Refresh access token using refresh token
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @returns {Promise<boolean>} - True if refresh was successful
 */
export async function refreshAccessToken(cookies) {
  const refreshToken = getRefreshToken(cookies);
  
  if (!refreshToken) {
    return false;
  }

  try {
    const apiUrl = import.meta.env.API_URL;
    const response = await fetch(`${apiUrl}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    if (data.success && data.data?.accessToken) {
      // Update access token, keep existing refresh token
      cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.data.accessToken, {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: "/",
      });
      
      // Update refresh token if new one is provided
      if (data.data.refreshToken) {
        cookies.set(REFRESH_TOKEN_COOKIE_NAME, data.data.refreshToken, {
          httpOnly: true,
          secure: import.meta.env.PROD,
          sameSite: "lax",
          maxAge: REFRESH_TOKEN_MAX_AGE,
          path: "/",
        });
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

/**
 * Remove authentication tokens (logout)
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 */
export function removeAuthToken(cookies) {
  cookies.delete(ACCESS_TOKEN_COOKIE_NAME, {
    path: "/",
  });
  cookies.delete(REFRESH_TOKEN_COOKIE_NAME, {
    path: "/",
  });
}

/**
 * Clear authentication tokens (alias for removeAuthToken)
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 */
export function clearAuthToken(cookies) {
  removeAuthToken(cookies);
}

