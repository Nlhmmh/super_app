/*
  Lightweight API utility for typed fetch calls.
  Usage:
    import { get, post } from '@/utils/api';
    const data = await post<{ token: string }>('/auth/login', { email, password });
*/
import { Language } from "@/model/models";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
  query?: QueryParams;
  timeoutMs?: number;
  baseUrl?: string; // override default base URL if needed
  asFormData?: boolean; // when true, plain objects will be converted to FormData
}

export interface ApiError extends Error {
  status: number;
  data?: unknown;
}

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds
const envBaseUrl =
  process?.env?.EXPO_PUBLIC_API_URL ??
  Constants.expoConfig?.extra?.apiUrl ??
  "";
let BASE_URL: string = envBaseUrl;
const SECURE_USER_KEY = "secure_user";

export const setApiBaseUrl = (url: string) => {
  BASE_URL = url || "";
};

const buildQuery = (params?: QueryParams): string => {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    );
  return entries.length ? `?${entries.join("&")}` : "";
};

const isAbsoluteUrl = (path: string): boolean => /^https?:\/\//i.test(path);

const resolveUrl = (
  path: string,
  query?: QueryParams,
  baseUrl?: string
): string => {
  const q = buildQuery(query);
  if (isAbsoluteUrl(path)) return `${path}${q}`;
  const base = (baseUrl ?? BASE_URL) || "";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}${q}`;
};

const getDefaultHeaders = (
  body?: unknown,
  headers?: Record<string, string>,
  token?: string,
  lang?: string
): Record<string, string> => {
  const h: Record<string, string> = {
    Accept: "*/*",
    ...headers,
  };
  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) {
    h["Content-Type"] = h["Content-Type"] ?? "application/json";
  }
  if (token) {
    h["Authorization"] = `Bearer ${token}`;
  }
  if (lang) {
    h["lang"] = lang;
  }
  return h;
};

// Convert a simple object into FormData. Arrays are appended with the same key.
const toFormData = (value: Record<string, any>): FormData => {
  const fd = new FormData();
  Object.entries(value || {}).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (Array.isArray(val)) {
      val.forEach((item) => fd.append(key, item as any));
      return;
    }
    fd.append(key, val as any);
  });
  return fd;
};

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers,
    body,
    token,
    query,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    baseUrl,
    asFormData,
  } = options;
  const url = resolveUrl(path, query, baseUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Fetch language from SecureStorage, default to "en"
  let lang = Language.EN;
  try {
    const storedLang = await SecureStore.getItemAsync("secure_lang");
    if (storedLang) {
      lang = storedLang;
    }
  } catch (err) {
    console.warn("Failed to load language from SecureStore", err);
  }

  // Fetch token from SecureStorage if not provided
  let effectiveToken = token;
  if (!effectiveToken) {
    try {
      const storedUser = await SecureStore.getItemAsync(SECURE_USER_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as { token?: string };
        if (parsed?.token) {
          effectiveToken = parsed.token;
        }
      }
    } catch (err) {
      console.warn("Failed to load token from SecureStore", err);
    }
  }

  let effectiveBody = body;
  if (asFormData && body !== undefined && !(body instanceof FormData)) {
    effectiveBody = toFormData(body as Record<string, any>);
  }

  const isFormData = effectiveBody instanceof FormData;
  const initBody =
    effectiveBody === undefined
      ? undefined
      : isFormData
      ? effectiveBody
      : JSON.stringify(effectiveBody);

  try {
    console.debug(
      `API Request: ${method} ${url} ${
        initBody instanceof FormData
          ? JSON.stringify(Object.fromEntries(initBody.entries()))
          : initBody ?? ""
      } ${lang ?? ""}`
    );
    const res = await fetch(url, {
      method,
      headers: getDefaultHeaders(effectiveBody, headers, effectiveToken, lang),
      body: initBody,
      signal: controller.signal,
    });
    console.debug(`API Response: ${method} ${url} ${res.status}`);

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    // API can somtimes return non-JSON payloads (e.g., plain text)
    // so try-catch the JSON parsing.
    let payload: unknown;
    let payloadText: string = "";
    try {
      payloadText = await res.text();
      payload = isJson ? JSON.parse(payloadText) : payloadText;
    } catch (parseErr) {
      console.debug("Failed to parse API response:", payloadText);
      console.debug("Failed to parse API response:", parseErr);
      payload = null;
    }

    if (!res.ok) {
      const err: ApiError = new Error(
        (payload as any)?.message || res.statusText
      ) as ApiError;
      err.status = res.status;
      err.data = payload;
      throw err;
    }

    return payload as T;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      const err: ApiError = new Error("Request timed out") as ApiError;
      err.status = 0;
      throw err;
    }
    const err: ApiError = new Error(e?.message || "Network error") as ApiError;
    err.status = e?.status ?? 0;
    err.data = e?.data;
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const get = <T = unknown>(
  path: string,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "GET" });

export const post = <T = unknown>(
  path: string,
  body?: unknown,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "POST", body });

export const put = <T = unknown>(
  path: string,
  body?: unknown,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "PUT", body });

export const patch = <T = unknown>(
  path: string,
  body?: unknown,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "PATCH", body });

export const del = <T = unknown>(
  path: string,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "DELETE" });

export const safeAPICall = async <T = unknown>({
  fn,
  catchCb,
  finallyCb,
}: {
  fn: () => Promise<T>;
  catchCb?: (error: ApiError, errMsg: string) => void;
  finallyCb?: () => void;
}): Promise<{ error?: ApiError }> => {
  try {
    await fn();
  } catch (error: any) {
    let errMsg = "";
    console.debug("safeAPICall error:", error);
    if (!error.data) errMsg = "An error occurred. Please try again.";
    else if (typeof error.data === "string") errMsg = error.data;
    else if (error.data.message) errMsg = error.data.message;
    else if (error.data.error) errMsg = error.data.error;
    else errMsg = "An error occurred. Please try again.";
    if (catchCb) catchCb(error, errMsg);
    return { error };
  } finally {
    if (finallyCb) finallyCb();
  }
  return {};
};
