import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const PROFILE_COMPLETED_KEY = 'profile_completed';

export async function saveTokens(accessToken: string, refreshToken: string) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

export function getToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export function saveProfileCompleted(completed: boolean) {
  return SecureStore.setItemAsync(PROFILE_COMPLETED_KEY, String(completed));
}

export async function getProfileCompleted() {
  return (await SecureStore.getItemAsync(PROFILE_COMPLETED_KEY)) === 'true';
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(PROFILE_COMPLETED_KEY),
  ]);
}
