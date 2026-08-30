import { getDatabase } from './init';

const DEFAULTS: Record<string, string> = {
  modelId: 'auto',
  reminderEnabled: 'true',
  quietDaysThreshold: '3',
};

export async function getSetting(key: string): Promise<string | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  if (row) return row.value;
  return DEFAULTS[key] ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

export async function getBooleanSetting(
  key: string,
  defaultValue = false
): Promise<boolean> {
  const value = await getSetting(key);
  if (value === null) return defaultValue;
  return value === 'true';
}

export async function getNumberSetting(
  key: string,
  defaultValue: number
): Promise<number> {
  const value = await getSetting(key);
  if (value === null) return defaultValue;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}
