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
  csrf_token?: string;
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
  policyMetadata?: {
    termsVersion: string;
    privacyVersion: string;
    effectiveAt: string;
    changeSummary: string;
    updatedAt: string;
  };
  policyAcceptance?: {
    termsVersionAccepted?: string | null;
    privacyVersionAccepted?: string | null;
    acceptedAt?: string | null;
    requiresReacceptance: boolean;
  };
};

export type PolicyMetadata = {
  termsVersion: string;
  privacyVersion: string;
  effectiveAt: string;
  changeSummary: string;
  updatedAt: string;
};

export type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

export type NeedAnalyticsResponse = {
  totalNeeds: number;
  answeredNeeds: number;
  openNeeds: number;
  responseCount: number;
  answerRate: number;
  monthlyTrend: Array<{
    month: string;
    needsCreated: number;
    needsAnswered: number;
  }>;
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

export type AnnouncementItem = {
  id: string;
  title: string;
  body: string;
  audience: string;
  status: string;
  createdAt: string;
  publishedAt?: string | null;
  createdByName?: string | null;
  createdByRole?: string | null;
};

export type ContactMessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
};

export type ContactMessagesResponse = {
  messages: ContactMessageItem[];
  total: number;
  unread: number;
  limit: number;
  offset: number;
};

export type CommentAuthor = {
  author_name: string;
  author_role: string;
  author_avatar: string | null;
};

export type CommentReply = CommentAuthor & {
  reply: {
    id: string;
    comment_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
};

export type PropertyComment = CommentAuthor & {
  comment: {
    id: string;
    property_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
  replies: CommentReply[];
};

export type CommentsResponse = {
  comments: PropertyComment[];
  total: number;
  limit: number;
  offset: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
};

function normalizeCommentReply(raw: Record<string, unknown>): CommentReply {
  const reply = (raw.reply ?? {}) as Record<string, unknown>;
  return {
    author_name: String(raw.author_name ?? ""),
    author_role: String(raw.author_role ?? ""),
    author_avatar: typeof raw.author_avatar === "string" ? raw.author_avatar : null,
    reply: {
      id: String(reply.id ?? ""),
      comment_id: String(reply.comment_id ?? ""),
      user_id: String(reply.user_id ?? ""),
      content: String(reply.content ?? ""),
      created_at: String(reply.created_at ?? ""),
      updated_at: String(reply.updated_at ?? ""),
    },
  };
}

function normalizePropertyComment(raw: Record<string, unknown>): PropertyComment {
  const wrappedComment = (raw.comment ?? {}) as Record<string, unknown>;
  const comment = ((wrappedComment.comment ?? wrappedComment) ?? {}) as Record<string, unknown>;
  const replies = Array.isArray(raw.replies) ? raw.replies : [];

  return {
    author_name: String(wrappedComment.author_name ?? raw.author_name ?? ""),
    author_role: String(wrappedComment.author_role ?? raw.author_role ?? ""),
    author_avatar:
      typeof wrappedComment.author_avatar === "string"
        ? wrappedComment.author_avatar
        : typeof raw.author_avatar === "string"
          ? raw.author_avatar
          : null,
    comment: {
      id: String(comment.id ?? ""),
      property_id: String(comment.property_id ?? ""),
      user_id: String(comment.user_id ?? ""),
      content: String(comment.content ?? ""),
      created_at: String(comment.created_at ?? ""),
      updated_at: String(comment.updated_at ?? ""),
    },
    replies: replies.map((reply) => normalizeCommentReply((reply ?? {}) as Record<string, unknown>)),
  };
}

function normalizePaginatedResponse<T>(raw: Record<string, unknown>, fallbackItems: T[] = []): PaginatedResponse<T> {
  const items = Array.isArray(raw.items) ? (raw.items as T[]) : fallbackItems;
  return {
    items,
    total: Number(raw.total ?? items.length),
    page: Number(raw.page ?? 1),
    perPage: Number(raw.perPage ?? raw.per_page ?? (items.length || 20)),
  };
}

function normalizeAnnouncement(raw: Record<string, unknown>): AnnouncementItem {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "Announcement"),
    body: String(raw.body ?? ""),
    audience: String(raw.audience ?? "all"),
    status: String(raw.status ?? "published"),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    publishedAt: typeof raw.published_at === "string" ? raw.published_at : typeof raw.publishedAt === "string" ? raw.publishedAt : null,
    createdByName: typeof raw.created_by_name === "string" ? raw.created_by_name : typeof raw.createdByName === "string" ? raw.createdByName : null,
    createdByRole: typeof raw.created_by_role === "string" ? raw.created_by_role : typeof raw.createdByRole === "string" ? raw.createdByRole : null,
  };
}

function normalizeContactMessage(raw: Record<string, unknown>): ContactMessageItem {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? "Anonymous"),
    email: String(raw.email ?? ""),
    subject: String(raw.subject ?? "Contact message"),
    message: String(raw.message ?? ""),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    isRead: Boolean(raw.is_read ?? raw.isRead ?? false),
    readAt: typeof raw.read_at === "string" ? raw.read_at : typeof raw.readAt === "string" ? raw.readAt : null,
  };
}

const API_ROOT = (import.meta.env.VITE_API_BASE_URL ?? "https://verinest.up.railway.app").replace(/\/$/, "");
const API_PREFIX = `${API_ROOT}/api/v1`;
const SESSION_KEY = "verinest_session";
const KYC_STATUS_KEY = "verinest_kyc_status";
const ROLE_KEY = "verinest_role";
//"http://localhost:3001"

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

/**
 * Extract CSRF token from verinest_csrf cookie
 */
function getCsrfTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith("verinest_csrf=")) {
      const value = trimmed.substring("verinest_csrf=".length);
      // Decode the value in case it's URL-encoded
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return null;
}

async function fetchWithToken(path: string, init: RequestInit | undefined, token?: string | null) {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type") && init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Inject CSRF token for state-changing requests (POST, PATCH, DELETE, PUT)
  const method = init?.method?.toUpperCase() ?? "GET";
  if (["POST", "PATCH", "DELETE", "PUT"].includes(method)) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    } else {
      // Log warning if CSRF token is missing for state-changing request
      console.warn(`CSRF token not found in cookie for ${method} ${path}`);
    }
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
  register: (payload: { full_name: string; email: string; password: string; phone?: string; bio?: string; accepted_terms_version: string; accepted_privacy_version: string }) =>
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
  sendPasswordReset: (payload: { email: string }) =>
    apiRequest<{ ok: boolean; message: string }>("/auth/send-password-reset", {
      method: "POST",
      body: JSON.stringify(payload),
    }, false),
  resetPassword: (payload: { token: string; password: string }) =>
    apiRequest<SessionUser>("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }, false),
  me: () => apiRequest<AuthMeResponse>("/auth/me"),
  getPolicyMetadata: () => apiRequest<PolicyMetadata>("/legal/policies/meta", undefined, false),
  acceptCurrentPolicies: () => apiRequest<AuthMeResponse["policyAcceptance"]>("/auth/legal/accept-current", { method: "PATCH" }),
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
  sendPasswordOtp: () =>
    apiRequest<{ ok: boolean; expires_in_seconds: number; code_length: number }>("/users/password/send-otp", { method: "POST" }),
  changePasswordWithOtp: (payload: { code: string; new_password: string; new_password_confirm: string }) =>
    apiRequest<void>("/users/password/verify-otp", { method: "PUT", body: JSON.stringify(payload) }),
  deleteAccount: () =>
    apiRequest<void>("/users/account", { method: "DELETE" }),
  getActivity: (limit = 10) =>
    apiRequest<Array<{ action: string; resource_type: string | null; method: string; timestamp: string }>>(`/auth/activity?limit=${limit}`),
  updateAvatar: (avatarUrl: string) =>
    apiRequest<AuthMeResponse>("/users/avatar", { method: "PATCH", body: JSON.stringify({ avatarUrl }) }),
  health: () => apiRequest<HealthResponse>("/health", undefined, false),
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
  listPublic: (params?: Record<string, string | number | undefined>) => apiRequest<{ items: Array<Record<string, unknown>>; total: number; page: number; per_page: number } | Array<Record<string, unknown>>>(`/properties${buildQuery(params)}` , undefined, false),
  getById: (id: string) => apiRequest<Record<string, unknown>>(`/properties/${id}`),
  reviews: (id: string) => apiRequest<Array<Record<string, unknown>>>(`/properties/${id}/reviews`, undefined, false),
  listAgent: () => apiRequest<Array<Record<string, unknown>>>("/agent/properties"),
  createAgent: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/agent/properties", { method: "POST", body: JSON.stringify(payload) }),
  updateAgent: (id: string, payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>(`/agent/properties/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  listLandlord: () => apiRequest<Array<Record<string, unknown>>>("/landlord/properties"),
  createLandlord: (payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>("/landlord/properties", { method: "POST", body: JSON.stringify(payload) }),
  comments: {
    list: async (propertyId: string, limit = 20, offset = 0) => {
      const response = await apiRequest<{
        comments?: Array<Record<string, unknown>>;
        total?: number;
        limit?: number;
        offset?: number;
      }>(`/properties/${propertyId}/comments?limit=${limit}&offset=${offset}`, undefined, false);

      return {
        comments: Array.isArray(response.comments) ? response.comments.map((item) => normalizePropertyComment(item)) : [],
        total: Number(response.total ?? 0),
        limit: Number(response.limit ?? limit),
        offset: Number(response.offset ?? offset),
      } satisfies CommentsResponse;
    },
    create: (propertyId: string, content: string) => apiRequest<PropertyComment>(`/properties/${propertyId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
    reply: (commentId: string, content: string) =>
      apiRequest<CommentReply>(`/comments/${commentId}/replies`, { method: "POST", body: JSON.stringify({ content }) }),
  },
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
  confirmBookingSchedule: (id: string) => apiRequest<Record<string, unknown>>(`/bookings/${id}/confirm`, { method: "POST" }),
  confirmBookingOutcome: (id: string, payload: { outcome: "completed" | "not_completed"; note?: string }) =>
    apiRequest<Record<string, unknown>>(`/bookings/${id}/outcome/seeker`, { method: "POST", body: JSON.stringify(payload) }),
  createBookingDispute: (id: string, payload: { disputeType: string; title: string; description: string; priority?: string }) =>
    apiRequest<Record<string, unknown>>(`/bookings/${id}/dispute`, { method: "POST", body: JSON.stringify(payload) }),
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
  updateProperty: (id: string, payload: { status?: string; availableAt?: string; title?: string; description?: string; price?: number; [key: string]: unknown }) => 
    apiRequest<Record<string, unknown>>(`/agent/properties/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  listPayouts: () => apiRequest<Array<Record<string, unknown>>>("/agent/payouts"),
  listCalendar: () => apiRequest<Array<Record<string, unknown>>>("/agent/calendar"),
  listBookings: () => apiRequest<Array<Record<string, unknown>>>("/agent/bookings"),
  updateBooking: (id: string, payload: Record<string, unknown>) => apiRequest<Record<string, unknown>>(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  confirmBookingSchedule: (id: string) => apiRequest<Record<string, unknown>>(`/bookings/${id}/confirm`, { method: "POST" }),
  confirmBookingOutcome: (id: string, payload: { outcome: "completed" | "not_completed"; note?: string }) =>
    apiRequest<Record<string, unknown>>(`/bookings/${id}/outcome/provider`, { method: "POST", body: JSON.stringify(payload) }),
  createBookingDispute: (id: string, payload: { disputeType: string; title: string; description: string; priority?: string }) =>
    apiRequest<Record<string, unknown>>(`/bookings/${id}/dispute`, { method: "POST", body: JSON.stringify(payload) }),
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
  needAnalytics: () => apiRequest<NeedAnalyticsResponse>("/admin/reports/needs"),
  users: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<Record<string, unknown>>(await apiRequest<Record<string, unknown>>(`/admin/users${buildQuery({ page: 1, per_page: 100, ...params })}`)),
  properties: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<Record<string, unknown>>(await apiRequest<Record<string, unknown>>(`/admin/properties${buildQuery({ page: 1, per_page: 100, ...params })}`)),
  deleteProperty: (id: string, payload: { password: string }) =>
    apiRequest<{ success: boolean; message: string }>(`/admin/properties/${id}`, {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
  transactions: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<Record<string, unknown>>(await apiRequest<Record<string, unknown>>(`/admin/transactions${buildQuery({ page: 1, per_page: 100, ...params })}`)),
  disputes: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<Record<string, unknown>>(await apiRequest<Record<string, unknown>>(`/admin/disputes${buildQuery({ page: 1, per_page: 100, ...params })}`)),
  reports: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<Record<string, unknown>>(await apiRequest<Record<string, unknown>>(`/admin/reports${buildQuery({ page: 1, per_page: 100, ...params })}`)),
  announcements: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<Record<string, unknown>>(await apiRequest<Record<string, unknown>>(`/admin/announcements${buildQuery({ page: 1, per_page: 100, ...params })}`)),
  createAnnouncement: (payload: { title: string; body: string; audience: string }) => apiRequest<Record<string, unknown>>("/admin/announcements", { method: "POST", body: JSON.stringify(payload) }),
  contactMessages: async () => {
    const raw = await apiRequest<Record<string, unknown>>("/admin/contact-messages");
    const messages = Array.isArray(raw.messages)
      ? (raw.messages as Array<Record<string, unknown>>).map((item) => normalizeContactMessage(item))
      : [];
    return {
      messages,
      total: Number(raw.total ?? messages.length),
      unread: Number(raw.unread ?? 0),
      limit: Number(raw.limit ?? messages.length),
      offset: Number(raw.offset ?? 0),
    } satisfies ContactMessagesResponse;
  },
  contactMessage: async (id: string) => normalizeContactMessage(await apiRequest<Record<string, unknown>>(`/admin/contact-messages/${id}`)),
  markContactMessageRead: async (id: string) => normalizeContactMessage(await apiRequest<Record<string, unknown>>(`/admin/contact-messages/${id}/read`, { method: "PATCH" })),
  verifications: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<Record<string, unknown>>(await apiRequest<Record<string, unknown>>(`/admin/verifications${buildQuery({ page: 1, per_page: 100, ...params })}`)),
  verificationDetail: (id: string) => apiRequest<Record<string, unknown>>(`/admin/verifications/${id}/detail`),
  moderateReport: (id: string, payload: { status: "upheld" | "dismissed"; reviewNotes: string; propertyAction?: "hide" | "suspend" }) =>
    apiRequest<Record<string, unknown>>(`/admin/reports/${id}/decision`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateVerification: (id: string, payload: { status: "approved" | "rejected"; rejectionReason?: string; notes?: string }) =>
    apiRequest<Record<string, unknown>>(`/admin/verifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        verification_status: payload.status,
        verification_notes: payload.rejectionReason ?? payload.notes,
      }),
    }),
  suspendUser: (userId: string) => apiRequest<Record<string, unknown>>(`/admin/users/${userId}/suspend`, { method: "POST", body: JSON.stringify({}) }),
  unsuspendUser: (userId: string) => apiRequest<Record<string, unknown>>(`/admin/users/${userId}/unsuspend`, { method: "POST", body: JSON.stringify({}) }),
  getPolicyMetadata: () => apiRequest<PolicyMetadata>("/admin/legal/policies/meta"),
  updatePolicyMetadata: (payload: { termsVersion: string; privacyVersion: string; effectiveAt?: string; changeSummary: string }) =>
    apiRequest<PolicyMetadata>("/admin/legal/policies/meta", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export const announcementsApi = {
  list: async (params?: { page?: number; per_page?: number }) => {
    const raw = await apiRequest<Record<string, unknown>>(`/announcements${buildQuery({ page: 1, per_page: 50, ...params })}`);
    const normalizedItems = Array.isArray(raw.items)
      ? (raw.items as Array<Record<string, unknown>>).map((item) => normalizeAnnouncement(item))
      : [];
    return normalizePaginatedResponse<AnnouncementItem>({ ...raw, items: normalizedItems });
  },
  get: async (id: string) => normalizeAnnouncement(await apiRequest<Record<string, unknown>>(`/announcements/${id}`)),
};

export const contactApi = {
  create: (payload: { name: string; email: string; subject: string; message: string }) =>
    fetch(`${API_ROOT}/admin/contact-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to send contact message (${response.status})`);
      }
      return;
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

export const reportsApi = {
  create: (payload: {
    reportedUserId?: string;
    propertyId?: string;
    postId?: string;
    responseId?: string;
    violationType: string;
    reason: string;
    details: string;
  }) =>
    apiRequest<Record<string, unknown>>("/reports", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const notificationsApi = {
  list: async (params?: { page?: number; per_page?: number }) =>
    normalizePaginatedResponse<NotificationItem>(await apiRequest<Record<string, unknown>>(`/notifications${buildQuery({ page: 1, per_page: 25, ...params })}`)),
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

export function maskPhoneNumber(phone?: string | null) {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  // Show first part, hide last 2 digits with asterisks
  const visible = digits.slice(0, -2);
  return `${visible}**`;
}
