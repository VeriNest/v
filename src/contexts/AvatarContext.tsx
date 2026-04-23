import React, { createContext, useContext, useEffect, useState } from "react";

type AvatarContextType = {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
};

const AVATAR_KEY = "verinest_avatar_url";

const AvatarContext = createContext<AvatarContextType>({ avatarUrl: null, setAvatarUrl: () => {} });

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(AVATAR_KEY);
    if (stored) {
      setAvatarUrlState(stored);
    }
  }, []);

  const setAvatarUrl = (url: string | null) => {
    setAvatarUrlState(url);
    if (typeof window === "undefined") return;
    if (url) {
      window.localStorage.setItem(AVATAR_KEY, url);
    } else {
      window.localStorage.removeItem(AVATAR_KEY);
    }
  };

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  return useContext(AvatarContext);
}
