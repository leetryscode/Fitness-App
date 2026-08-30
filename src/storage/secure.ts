import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'llm_api_key';

export async function saveApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, key);
}

export async function getApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function deleteApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
}

export async function maskApiKey(key: string): Promise<string> {
  if (key.length <= 8) return '••••••••';
  return '•'.repeat(Math.min(key.length, 24));
}
