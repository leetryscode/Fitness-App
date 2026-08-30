import * as SQLite from 'expo-sqlite';
import {
  CREATE_ENTRIES_INDEX,
  CREATE_ENTRIES_TABLE,
  CREATE_SETTINGS_TABLE,
  SCHEMA_VERSION,
  MIGRATIONS,
} from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('gym-recovery.db');
  }
  return db;
}

async function getCurrentSchemaVersion(
  database: SQLite.SQLiteDatabase
): Promise<number> {
  try {
    const row = await database.getFirstAsync<{ value: string }>(
      `SELECT value FROM settings WHERE key = 'schema_version'`
    );
    return row ? parseInt(row.value, 10) : 1;
  } catch {
    return 1;
  }
}

async function setSchemaVersion(
  database: SQLite.SQLiteDatabase,
  version: number
): Promise<void> {
  await database.runAsync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_version', ?)`,
    [version.toString()]
  );
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  const currentVersion = await getCurrentSchemaVersion(database);

  for (let v = currentVersion + 1; v <= SCHEMA_VERSION; v++) {
    const migrations = MIGRATIONS[v];
    if (migrations) {
      for (const sql of migrations) {
        try {
          await database.execAsync(sql);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (!msg.includes('duplicate column')) {
            throw err;
          }
        }
      }
    }
    await setSchemaVersion(database, v);
  }
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    ${CREATE_ENTRIES_TABLE}
    ${CREATE_SETTINGS_TABLE}
    ${CREATE_ENTRIES_INDEX}
  `);
  await runMigrations(database);
}
