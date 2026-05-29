import React, { createContext, useContext, useState, useEffect } from "react";

interface CsrfContextType {
  csrfToken: string | null;
  refreshCsrfToken: (token: string) => void;
}

const CsrfContext = createContext<CsrfContextType | undefined>(undefined);

export function CsrfProvider({ children }: { children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    // Extract CSRF token from cookie on mount
    const token = getCsrfTokenFromCookie();
    if (token) {
      setCsrfToken(token);
    }
  }, []);

  const refreshCsrfToken = (token: string) => {
    setCsrfToken(token);
  };

  return (
    <CsrfContext.Provider value={{ csrfToken, refreshCsrfToken }}>
      {children}
    </CsrfContext.Provider>
  );
}

export function useCsrf() {
  const context = useContext(CsrfContext);
  if (context === undefined) {
    throw new Error("useCsrf must be used within CsrfProvider");
  }
  return context;
}

/**
 * Extract CSRF token from verinest_csrf cookie
 */
function getCsrfTokenFromCookie(): string | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "verinest_csrf") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Watch for CSRF cookie changes (when backend sets new token)
 * This runs periodically to refresh token if it changes
 */
export function useWatchCsrfCookie() {
  const { refreshCsrfToken } = useCsrf();
  const [lastToken, setLastToken] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = getCsrfTokenFromCookie();
      if (currentToken && currentToken !== lastToken) {
        refreshCsrfToken(currentToken);
        setLastToken(currentToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastToken, refreshCsrfToken]);
}
