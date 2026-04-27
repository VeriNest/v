import { QueryFunctionContext } from "@tanstack/react-query";

export type UserRole = "unassigned" | "seeker" | "agent" | "landlord" | "admin";

export type SessionUser = {
  id: string;
  full_name: string;
  email: string;
  email_verified: boolean;
  role: UserRole;
  bio?: string | null;
  average_rating?: number | null;
  review_count?: number;
  verification_status?: string;
  created_at?: string;
};

export type AuthPayload = {
  token: string;
  refresh_token: string;
  user: SessionUser;
};

export type AuthMeResponse = {
  user: SessionUser;
  profile?: {
    userId: string;
    fullName: string;
    phone?: string | null;
    city?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    onboardingCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  roleProfile?: Record<string, unknown> | null;
  verification?: {
    id: string;
    status: string;
    submittedAt?: string | null;
    reviewedAt?: string | null;
    rejectionReason?: string | null;
    notes?: string | null;
  } | null;
  verificationDocuments?: Array<{
    id: string;
    verificationId: string;
    documentType: string;
    fileUrl: string;
    fileKey: string;
    mimeType: string;
    status: string;
    createdAt: string;
  }>;
  livenessCompleted?: boolean;
};

export type NotificationItem = {
  id: string;
  kind: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
};

const API_ROOT = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");
const API_PREFIX = `${API_ROOT}/api/v1`;
const SESSION_KEY = "verinest_session";
const KYC_STATUS_KEY = "verinest_kyc_status";
const ROLE_KEY = "verinest_role";

let refreshPromise: Promise<AuthPayload | null> | null = null;

export function getApiRoot() {
  return API_ROOT;
}

export function getApiPrefix() {
  return API_PREFIX;
}

export function getStoredSession(): AuthPayload | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setStoredSession(payload: AuthPayload | null) {
  if (typeof window === "undefined") return;
  if (!payload) {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(ROLE_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  window.localStorage.setItem(ROLE_KEY, payload.user.role);
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}

export function setStoredKycStatus(status: string | null | undefined) {
  if (typeof window === "undefined") return;
  if (!status) {
    window.localStorage.removeItem(KYC_STATUS_KEY);
    return;
  }
  window.localStorage.setItem(KYC_STATUS_KEY, status);
}

export function mapVerificationStatusToBanner(status?: string | null) {
  if (!status) return "skipped";
  if (["submitted", "in_review", "pending"].includes(status)) return "submitted";
  if (["approved", "verified"].includes(status)) return "submitted";
  return "skipped";
}

export function mapVerificationStatusToDisplay(status?: string | null): string {
  if (!status) return "Not Started";
  switch (status.toLowerCase()) {
    case "not_started":
      return "Not Started";
    case "submitted":
    case "pending":
      return "Awaiting Approval";
    case "in_review":
      return "Under Review";
    case "approved":
    case "verified":
      return "Verified";
    case "rejected":
      return "Rejected";
    case "expired":
      return "Expired";
    default:
      return status;
  }
}

export function dashboardPathForRole(role?: UserRole | null) {
  switch (role) {
    case "seeker":
      return "/seeker";
    case "agent":
      return "/provider";
    case "landlord":
      return "/landlord";
    case "admin":
      return "/admin";
    default:
      return "/onboarding";
  }
}

export function isVerificationApproved(status?: string | null) {
  return ["approved", "verified"].includes(String(status ?? "").toLowerCase());
}

export function hasCompletedOnboarding(payload?: AuthMeResponse | null) {
  return Boolean(payload?.profile?.onboardingCompleted);
}

export function needsOnboardingCompletion(payload?: AuthMeResponse | null) {
  if (!payload) return true;
  if (!payload.user.email_verified) return false;
  if (payload.user.role === "admin") return false;
  if (payload.user.role === "unassigned") return true;
  if (!hasCompletedOnboarding(payload)) return true;
  if (payload.user.role === "seeker") {
    return !payload.livenessCompleted;
  }
  if (payload.user.role === "agent" || payload.user.role === "landlord") {
    const status = String(payload.verification?.status ?? payload.user.verification_status ?? "").toLowerCase();
    const hasVerificationProgress = ["submitted", "pending", "in_review", "approved", "verified"].includes(status);
    return !hasVerificationProgress || !payload.livenessCompleted;
  }
  return false;
}

export function resolveAuthenticatedPath(payload?: AuthMeResponse | null) {
  if (!payload) return "/login";
  if (!payload.user.email_verified) {
    return `/confirm-email?email=${encodeURIComponent(payload.user.email)}`;
  }
  if (needsOnboardingCompletion(payload)) {
    return "/onboarding";
  }
  return dashboardPathForRole(payload.user.role);
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    const message = data?.error?.message ?? data?.message ?? `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }
  return data as T;
}

async function fetchWithToken(path: string, init: RequestInit | undefined, token?: string | null) {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type") && init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers,
  });
}

async function refreshStoredSession(): Promise<AuthPayload | null> {
  if (refreshPromise) return refreshPromise;

  const session = getStoredSession();
  if (!session?.refresh_token) return null;

  refreshPromise = (async () => {
    try {
      const response = await fetchWithToken(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refreshToken: session.refresh_token }),
        },
        null,
      );
      const auth = await parseResponse<AuthPayload>(response);
      setStoredSession(auth);
      return auth;
    } catch {
      clearStoredSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function bootstrapSession() {
  const session = getStoredSession();
  if (!session?.refresh_token) return null;

  const refreshed = await refreshStoredSession();
  if (!refreshed) return null;

  try {
    const me = await fetchWithToken("/auth/me", { method: "GET" }, refreshed.token);
    const payload = await parseResponse<AuthMeResponse>(me);
    if (payload.user.role === "seeker") {
      setStoredKycStatus(payload.livenessCompleted ? "submitted" : "skipped");
    } else {
      setStoredKycStatus(mapVerificationStatusToBanner(payload.verification?.status ?? payload.user.verification_status));
    }
    return payload;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit, auth = true): Promise<T> {
  const session = auth ? getStoredSession() : null;
  let response = await fetchWithToken(path, init, auth ? session?.token : null);

  if (auth && response.status === 401 && session?.refresh_token) {
    const refreshed = await refreshStoredSession();
    if (refreshed?.token) {
      response = await fetchWithToken(path, init, refreshed.token);
    }
  }

  return parseResponse<T>(response);
}

export async function queryRequest<T>({ queryKey }: QueryFunctionContext): Promise<T> {
  const [path] = queryKey as [string];
  return apiRequest<T>(path);
}

export const authApi = {
  register: (payload: { full_name: string; email: string; password: string; phone?: string; bio?: string }) =>
    apiRequest<AuthPayload>("/auth/register", { method: "POST", body: JSON.stringify(payload) }, false),
  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthPayload>("/auth/login", { method: "POST", body: JSON.stringify(payload) }, false),
  sendEmailCode: (payload: { email: string; purpose: string }) =>
    apiRequest<{ ok: boolean; expires_in_seconds: number; code_length: number }>("/auth/send-email-code", {
      method: "POST",
      body: JSON.stringify(payload),
    }, false),
  verifyEmailCode: (payload: { email: string; code: string }) =>
    apiRequest<SessionUser>("/auth/verify-email-code", { method: "POST", body: JSON.stringify(payload) }, false),
  me: () => apiRequest<AuthMeResponse>("/auth/me"),
  refresh: (refreshToken: string) =>
    apiRequest<AuthPayload>("/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) }, false),
  logout: async (refreshToken: string) => {
    try {
      await apiRequest<void>("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }, false);
    } catch (error) {
      // Even if logout fails on backend, clear local session
    } finally {
      clearStoredSession();
    }
  },
  changePassword: (payload: { old_password: string; new_password: string; new_password_confirm: string }) =>
    apiRequest<void>("/users/password", { method: "PUT", body: JSON.stringify(payload) }),
  deleteAccount: () =>
    apiRequest<void>("/users/account", { method: "DELETE" }),
};

export const onboardingApi = {
  selectRole: (role: Exclude<UserRole, "unassigned" | "admin">) =>
    apiRequest<AuthMeResponse>("/onboarding/role", { method: "POST", body: JSON.stringify({ role }) }),
  saveProfile: (payload: Record<string, unknown>) =>
    apiRequest<AuthMeResponse>("/onboarding/profile", { method: "PUT", body: JSON.stringify(payload) }),
};

export const verificationApi = {
  create: (notes?: string) => apiRequest<{ id: string; status: string }>("/verifications", { method: "POST", body: JSON.stringify({ notes }) }),
  addDocument: (verificationId: string, payload: { documentType: string; fileUrl: string; fileKey: string; mimeType: string }) =>
    apiRequest(`/verifications/${verificationId}/documents`, { method: "POST", body: JSON.stringify(payload) }),
  me: () => apiRequest<{ verification: Record<string, unknown> | null; documents: Array<Record<string, unknown>> }>("/verifications/me"),
  submitVerification: (payload: { photoUrl: string; ninUrl?: string | null; userRole: string; status: string }) =>
    apiRequest<{ id: string; status: string }>("/verifications", { method: "POST", body: JSON.stringify(payload) }),
};

export const propertiesApi = {
  listPublic: (params?: Record<string, string | number | undefined>) => apiRequest<Array<Record<string, unknown>>>(`/properties${buildQuery(params)}` , undefined, false),
  getById: (id: string) => apiRequest<Record<string, unknown>>(`/properties/${id}`, undefined, false),
  reviews: (id: string) => apiRequest<Array<Record<string, unknown>>>(`/properties/${id}/reviews`, undefined, false),
  listAgent: () => apiRequest<Array<Record<string, unknown>>>("/agent/properties"),
  createAgent: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/agent/properties", { method: "POST", body: JSON.stringify(payload) }),
  updateAgent: (id: string, payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>(`/agent/properties/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  listLandlord: () => apiRequest<Array<Record<string, unknown>>>("/landlord/properties"),
  createLandlord: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/landlord/properties", { method: "POST", body: JSON.stringify(payload) }),
};

export const seekerApi = {
  dashboard: () => apiRequest<{
    stats: { needCount: number; savedCount: number; bookingCount: number };
    matchTrends: Array<Record<string, unknown>>;
    savedProperties: Array<Record<string, unknown>>;
    recentOffers: Array<Record<string, unknown>>;
  }>("/seeker/dashboard/overview"),
  listNeeds: () => apiRequest<Array<Record<string, unknown>>>("/seeker/needs"),
  createNeed: (payload: Record<string, unknown>) => apiRequest<{ id: string }>("/seeker/needs", { method: "POST", body: JSON.stringify(payload) }),
  listOffers: () => apiRequest<Array<Record<string, unknown>>>("/seeker/offers"),
  updateOffer: (id: string, payload: { status: string }) =>
    apiRequest<Record<string, unknown>>(`/seeker/offers/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  listSaved: () => apiRequest<Array<Record<string, unknown>>>("/seeker/saved-properties"),
  saveProperty: (propertyId: string) => apiRequest<Record<string, unknown>>("/seeker/saved-properties", { method: "POST", body: JSON.stringify({ propertyId }) }),
  removeSavedProperty: (propertyId: string) => apiRequest<void>(`/seeker/saved-properties/${propertyId}`, { method: "DELETE" }),
  listBookings: () => apiRequest<Array<Record<string, unknown>>>("/seeker/bookings"),
  createBooking: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/bookings", { method: "POST", body: JSON.stringify(payload) }),
  updateBooking: (id: string, payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
};

export const agentApi = {
  dashboard: () => apiRequest<{
    stats: { listingCount: number; leadCount: number; payoutTotal: number };
    earningsSeries: Array<Record<string, unknown>>;
    topListings: Array<Record<string, unknown>>;
    recentLeads: Array<Record<string, unknown>>;
  }>("/agent/dashboard/overview"),
  listLeads: () => apiRequest<Array<Record<string, unknown>>>("/agent/leads"),
  listProperties: () => apiRequest<Array<Record<string, unknown>>>("/agent/properties"),
  getLead: (id: string) => apiRequest<Record<string, unknown>>(`/agent/leads/${id}`),
  listPayouts: () => apiRequest<Array<Record<string, unknown>>>("/agent/payouts"),
  listCalendar: () => apiRequest<Array<Record<string, unknown>>>("/agent/calendar"),
  listBookings: () => apiRequest<Array<Record<string, unknown>>>("/agent/bookings"),
  updateBooking: (id: string, payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  createOffer: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/offers", { method: "POST", body: JSON.stringify(payload) }),
};

export const agentSettingsApi = {
  get: () => apiRequest<{ notifications_enabled: boolean; operating_city: string | null; operating_state: string | null }>("/agent/notification-settings"),
  update: (payload: { notifications_enabled: boolean; operating_city?: string | null; operating_state?: string | null }) =>
    apiRequest<{ notifications_enabled: boolean; operating_city: string | null; operating_state: string | null }>("/agent/notification-settings", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export const landlordApi = {
  dashboard: () => apiRequest<{
    stats: { propertyCount: number; unitCount: number; openMaintenance: number };
    occupancySeries: Array<Record<string, unknown>>;
    collectionSeries: Array<Record<string, unknown>>;
    leaseExpiries: Array<Record<string, unknown>>;
    maintenanceQueue: Array<Record<string, unknown>>;
  }>("/landlord/dashboard/overview"),
  listProperties: () => apiRequest<Array<Record<string, unknown>>>("/landlord/properties"),
  createProperty: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/landlord/properties", { method: "POST", body: JSON.stringify(payload) }),
  listUnits: () => apiRequest<Array<Record<string, unknown>>>("/landlord/units"),
  createUnit: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/landlord/units", { method: "POST", body: JSON.stringify(payload) }),
  listCollections: () => apiRequest<Array<Record<string, unknown>>>("/landlord/collections"),
  listPayouts: () => apiRequest<Array<Record<string, unknown>>>("/landlord/payouts"),
  listMaintenance: () => apiRequest<Array<Record<string, unknown>>>("/landlord/maintenance"),
  createMaintenance: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/landlord/maintenance", { method: "POST", body: JSON.stringify(payload) }),
  listCalendar: () => apiRequest<Array<Record<string, unknown>>>("/landlord/calendar"),
};

export const adminApi = {
  overview: () => apiRequest<Record<string, unknown>>("/admin/metrics/overview"),
  users: () => apiRequest<Array<Record<string, unknown>>>("/admin/users"),
  properties: () => apiRequest<Array<Record<string, unknown>>>("/admin/properties"),
  transactions: () => apiRequest<Array<Record<string, unknown>>>("/admin/transactions"),
  disputes: () => apiRequest<Array<Record<string, unknown>>>("/admin/disputes"),
  reports: () => apiRequest<Array<Record<string, unknown>>>("/admin/reports"),
  announcements: () => apiRequest<Array<Record<string, unknown>>>("/admin/announcements"),
  createAnnouncement: (payload: { title: string; body: string; audience: string }) => apiRequest<Record<string, unknown>>("/admin/announcements", { method: "POST", body: JSON.stringify(payload) }),
  verifications: () => apiRequest<Array<Record<string, unknown>>>("/admin/verifications"),
  verificationDetail: (id: string) => apiRequest<Record<string, unknown>>(`/admin/verifications/${id}/detail`),
  updateVerification: (id: string, payload: { status: string; rejectionReason?: string; notes?: string }) =>
    apiRequest<Record<string, unknown>>(`/admin/verifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        verification_status: payload.status,
        verification_notes: payload.rejectionReason ?? payload.notes,
      }),
    }),
};

export const usersApi = {
  get: (id: string) => apiRequest<Record<string, unknown>>(`/users/${id}`, undefined, false),
  reviews: (id: string) => apiRequest<Array<Record<string, unknown>>>(`/users/${id}/reviews`, undefined, false),
};

export const reviewsApi = {
  create: (payload: { revieweeId: string; propertyId?: string; rating: number; comment: string }) =>
    apiRequest<Record<string, unknown>>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const notificationsApi = {
  list: () => apiRequest<NotificationItem[]>("/notifications"),
  readAll: () => apiRequest<{ ok: boolean }>("/notifications/read-all", { method: "PATCH" }),
  readOne: (id: string) => apiRequest<{ ok: boolean }>(`/notifications/${id}/read`, { method: "PATCH" }),
  deleteOne: (id: string) => apiRequest<void>(`/notifications/${id}`, { method: "DELETE" }),
};

export const uploadsApi = {
  presign: (payload: { category: string; filename: string; contentType: string }) => apiRequest<{ uploadUrl: string; fileUrl: string; fileKey: string; contentType: string }>("/uploads/presign", { method: "POST", body: JSON.stringify(payload) }),
};

function buildQuery(params?: Record<string, string | number | undefined>) {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function formatCurrency(value?: number | null, suffix = "") {
  if (value === undefined || value === null || Number.isNaN(value)) return "NGN 0";
  return `NGN ${new Intl.NumberFormat("en-NG").format(value)}${suffix}`;
}

export function formatCompactCurrency(value?: number | null) {
  if (!value) return "NGN 0";
  if (value >= 1_000_000) return `NGN ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `NGN ${(value / 1_000).toFixed(0)}K`;
  return `NGN ${value}`;
}

export function titleCase(value?: string | null) {
  if (!value) return "Unknown";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getPropertyImage(images?: unknown, fallbackIndex = 0) {
  const fallbacks = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
  ];
  if (Array.isArray(images)) {
    const url = images.find((value) => typeof value === "string" && !value.toLowerCase().endsWith(".mp4"));
    if (typeof url === "string") return url;
  }
  return fallbacks[fallbackIndex % fallbacks.length];
}

export function getPropertyListingType(property?: Record<string, unknown> | null) {
  const listingType = String((property as any)?.listingType ?? (property as any)?.listing_type ?? "").toLowerCase();
  if (listingType === "sale") return "sale";
  if (listingType === "shortlet" || Boolean((property as any)?.is_service_apartment)) return "shortlet";
  return "rent";
}

export function getPendingPropertyRating(property?: Record<string, unknown> | null) {
  switch (getPropertyListingType(property)) {
    case "shortlet":
      return 4.2;
    case "sale":
      return 4.0;
    default:
      return 4.1;
  }
}
