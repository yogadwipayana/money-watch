/**
 * Utility functions for authentication
 */

const TOKEN_COOKIE_NAME = "auth_token";
const TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

/**
 * Set authentication token in cookie
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @param {string} token - JWT token
 */
export function setAuthToken(cookies, token) {
  cookies.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD, // Only secure in production (HTTPS)
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });
}

/**
 * Get authentication token from cookie
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @returns {string | null} - Token or null if not found
 */
export function getAuthToken(cookies) {
  return cookies.get(TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * Check if user is authenticated
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 * @returns {boolean} - True if token exists
 */
export function isAuthenticated(cookies) {
  const token = getAuthToken(cookies);
  return token !== null && token !== undefined;
}

/**
 * Remove authentication token (logout)
 * @param {import('astro').AstroCookies} cookies - Astro cookies object
 */
export function removeAuthToken(cookies) {
  cookies.delete(TOKEN_COOKIE_NAME, {
    path: "/",
  });
}

