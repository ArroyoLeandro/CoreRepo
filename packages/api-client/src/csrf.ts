/**
 * Reads the non-httpOnly csrf_token cookie and builds the double-submit header.
 * Browser-only helper — returns empty headers when document is unavailable.
 */
export function getCsrfTokenFromCookie(
  cookieSource: string | undefined = typeof document !== "undefined"
    ? document.cookie
    : undefined,
): string | undefined {
  if (!cookieSource) {
    return undefined;
  }

  const match = cookieSource
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("csrf_token="));

  if (!match) {
    return undefined;
  }

  return decodeURIComponent(match.slice("csrf_token=".length));
}

export function csrfHeaders(
  cookieSource?: string,
): Record<string, string> {
  const token = getCsrfTokenFromCookie(cookieSource);
  if (!token) {
    return {};
  }
  return { "X-CSRF-Token": token };
}
