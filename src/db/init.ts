import * as SQLite from 'expo-sqlite';
import {
  CREATE_ENTRIES_INDEX,
  CREATE_ENTRIES_TABLE,
  CREATE_SETTINGS_TABLE,
} from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('gym-recovery.db');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    ${CREATE_ENTRIES_TABLE}
    ${CREATE_SETTINGS_TABLE}
    ${CREATE_ENTRIES_INDEX}
  `);
}
