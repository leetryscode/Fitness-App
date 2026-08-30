export const SCHEMA_VERSION = 2;

export const CREATE_ENTRIES_TABLE = `
  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL,
    raw_user_text TEXT,
    raw_ai_response TEXT NOT NULL,
    image_reference TEXT,
    parsed_muscle_tags TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('chat', 'photo')),
    session_effort TEXT CHECK(session_effort IS NULL OR session_effort IN ('very_light', 'easy', 'moderate', 'hard', 'max')),
    sets TEXT
  );
`;

export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`;

export const CREATE_ENTRIES_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_entries_timestamp ON entries(timestamp DESC);
`;

export const MIGRATIONS: Record<number, string[]> = {
  2: [
    `ALTER TABLE entries ADD COLUMN session_effort TEXT CHECK(session_effort IS NULL OR session_effort IN ('very_light', 'easy', 'moderate', 'hard', 'max'))`,
    `ALTER TABLE entries ADD COLUMN sets TEXT`,
  ],
};
