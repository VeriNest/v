import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { useAvatar } from "@/contexts/AvatarContext";
import { authApi, dashboardPathForRole, getStoredSession, mapVerificationStatusToBanner, resolveAuthenticatedPath, setStoredKycStatus, type UserRole } from "@/lib/api";

export function useAuthAccess(expectedRole?: UserRole) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAvatarUrl } = useAvatar();
  const session = getStoredSession();
  const { data, isLoading } = useQuery({
    queryKey: ["/auth/me", "access"],
    queryFn: () => authApi.me(),
    enabled: Boolean(session?.token),
    staleTime: 30_000,
    retry: 0,
  });

  useEffect(() => {
    if (!data) return;
    if (data.user.role === "seeker") {
      setStoredKycStatus(data.livenessCompleted ? "submitted" : "skipped");
    } else {
      setStoredKycStatus(mapVerificationStatusToBanner(data.verification?.status ?? data.user.verification_status));
    }
    setAvatarUrl(data.profile?.avatarUrl ?? null);
  }, [data, setAvatarUrl]);

  useEffect(() => {
    if (!session?.token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!data) return;

    const expectedBasePath = expectedRole ? dashboardPathForRole(expectedRole) : null;
    const resolvedPath = resolveAuthenticatedPath(data);
    const isWithinExpectedRole =
      expectedBasePath !== null &&
      (location.pathname === expectedBasePath || location.pathname.startsWith(`${expectedBasePath}/`));

    if (expectedRole && data.user.role !== expectedRole) {
      navigate(resolvedPath, { replace: true });
      return;
    }

    if (resolvedPath === "/onboarding" || resolvedPath.startsWith("/confirm-email")) {
      if (location.pathname !== resolvedPath && !location.pathname.startsWith("/confirm-email")) {
        navigate(resolvedPath, { replace: true });
      }
      return;
    }

    if (expectedBasePath && !isWithinExpectedRole) {
      navigate(resolvedPath, { replace: true });
    }
  }, [data, expectedRole, location.pathname, navigate, session?.token]);

  return {
    isChecking: !session?.token || isLoading || !data,
    me: data ?? null,
  };
}
