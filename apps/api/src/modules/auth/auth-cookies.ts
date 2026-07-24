import type { Response } from 'express';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
export const CSRF_COOKIE = 'csrf_token';

function cookieSecure(): boolean {
  return process.env.COOKIE_SECURE === 'true';
}

function baseCookieOptions() {
  return {
    path: '/',
    sameSite: 'lax' as const,
    secure: cookieSecure(),
  };
}

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string; csrfToken: string },
): void {
  const base = baseCookieOptions();

  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    httpOnly: true,
  });
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    httpOnly: true,
  });
  res.cookie(CSRF_COOKIE, tokens.csrfToken, {
    ...base,
    httpOnly: false,
  });
}

export function clearAuthCookies(res: Response): void {
  const base = baseCookieOptions();
  res.clearCookie(ACCESS_COOKIE, { ...base, httpOnly: true });
  res.clearCookie(REFRESH_COOKIE, { ...base, httpOnly: true });
  res.clearCookie(CSRF_COOKIE, { ...base, httpOnly: false });
}
