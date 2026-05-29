/**
 * Debug utilities for CSRF token troubleshooting
 */

export function debugCsrfStatus() {
  const cookies = document.cookie.split(";");
  const csrfCookie = cookies.find(c => c.trim().startsWith("verinest_csrf="));
  const token = csrfCookie?.trim().substring("verinest_csrf=".length);
  
  return {
    csrfCookieExists: !!csrfCookie,
    csrfTokenValue: token ? `${token.substring(0, 20)}...` : null,
    allCookies: cookies.map(c => {
      const parts = c.trim().split("=");
      return { name: parts[0], exists: true };
    }),
  };
}

export function logCsrfDebug(endpoint: string) {
  console.log(`[CSRF Debug] Endpoint: ${endpoint}`, debugCsrfStatus());
}
