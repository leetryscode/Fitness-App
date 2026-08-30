export const SCHEMA_VERSION = 1;

export const CREATE_ENTRIES_TABLE = `
  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL,
    raw_user_text TEXT,
    raw_ai_response TEXT NOT NULL,
    image_reference TEXT,
    parsed_muscle_tags TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('chat', 'photo'))
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
