import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";

type AvatarContextType = {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
};

const AVATAR_KEY = "verinest_avatar_url";

const AvatarContext = createContext<AvatarContextType>({ avatarUrl: null, setAvatarUrl: () => {} });

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null);

  // Fetch user data to get avatar from backend
  const { data: meData } = useQuery({
    queryKey: ["/auth/me"],
    queryFn: () => authApi.me(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // First check if we have avatar from backend /me endpoint
    if (meData?.profile?.avatarUrl) {
      setAvatarUrlState(meData.profile.avatarUrl);
      window.localStorage.setItem(AVATAR_KEY, meData.profile.avatarUrl);
    } else {
      // Fall back to stored avatar
      const stored = window.localStorage.getItem(AVATAR_KEY);
      if (stored) {
        setAvatarUrlState(stored);
      }
    }
  }, [meData?.profile?.avatarUrl]);

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
