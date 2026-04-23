const USER_ID_KEY = 'mantracare_auth_user_id';

/**
 * Get the current user ID from sessionStorage.
 * Requires AuthProvider to have successfully validated the token.
 * @returns The user ID String.
 */
export function getUserId(): string {
  const id = sessionStorage.getItem(USER_ID_KEY);
  if (!id) {
    console.warn('getUserId called before Auth validation finished. This might cause DB errors.');
    return ''; // AuthProvider blocks UI anyway, so this shouldn't hit in production.
  }
  return id;
}

/**
 * Set the validated user ID in sessionStorage after successful handshake.
 */
export function setUserId(id: string) {
  sessionStorage.setItem(USER_ID_KEY, id);
}

/**
 * Clear the session entirely, useful for strict resets.
 */
export function clearSession() {
  sessionStorage.removeItem(USER_ID_KEY);
}
