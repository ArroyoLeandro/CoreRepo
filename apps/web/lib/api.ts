import { createApiClient } from "@repo/api-client";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function createBrowserApi() {
  return createApiClient({ baseUrl: getApiBaseUrl() });
}

export function createServerApi(cookieHeader: string) {
  return createApiClient({
    baseUrl: getApiBaseUrl(),
    cookie: cookieHeader,
  });
}
