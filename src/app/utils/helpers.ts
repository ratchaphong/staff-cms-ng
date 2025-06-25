const TOKEN_KEY = 'access_token';
const TOKEN_TIME_KEY = 'token_time';

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function setAccessToken(access_token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(TOKEN_TIME_KEY, `${Date.now()}`);
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getTokenTime(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_TIME_KEY);
}

export function clearToken(): void {
  if (isBrowser()) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIME_KEY);
  }
}
