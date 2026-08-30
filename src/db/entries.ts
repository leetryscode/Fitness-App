import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from './init';
import {
  Entry,
  MuscleTag,
  EntrySource,
  SessionEffort,
  SetDetail,
} from '../types/entry';

type EntryRow = {
  id: string;
  timestamp: number;
  raw_user_text: string | null;
  raw_ai_response: string;
  image_reference: string | null;
  parsed_muscle_tags: string;
  source: EntrySource;
  session_effort: SessionEffort | null;
  sets: string | null;
};

function rowToEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    rawUserText: row.raw_user_text,
    rawAiResponse: row.raw_ai_response,
    imageReference: row.image_reference,
    parsedMuscleTags: JSON.parse(row.parsed_muscle_tags) as MuscleTag[],
    source: row.source,
    sessionEffort: row.session_effort ?? null,
    sets: row.sets ? (JSON.parse(row.sets) as SetDetail[]) : null,
  };
}

export async function insertEntry(
  entry: Omit<Entry, 'id' | 'sessionEffort' | 'sets'> & {
    id?: string;
    sessionEffort?: SessionEffort | null;
    sets?: SetDetail[] | null;
  }
): Promise<Entry> {
  const database = await getDatabase();
  const id = entry.id ?? uuidv4();
  const fullEntry: Entry = {
    ...entry,
    id,
    sessionEffort: entry.sessionEffort ?? null,
    sets: entry.sets ?? null,
  };

  await database.runAsync(
    `INSERT INTO entries (id, timestamp, raw_user_text, raw_ai_response, image_reference, parsed_muscle_tags, source, session_effort, sets)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullEntry.id,
      fullEntry.timestamp,
      fullEntry.rawUserText,
      fullEntry.rawAiResponse,
      fullEntry.imageReference,
      JSON.stringify(fullEntry.parsedMuscleTags),
      fullEntry.source,
      fullEntry.sessionEffort,
      fullEntry.sets ? JSON.stringify(fullEntry.sets) : null,
    ]
  );

  return fullEntry;
}

export async function updateEntryEffort(
  id: string,
  sessionEffort: SessionEffort | null
): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE entries SET session_effort = ? WHERE id = ?`,
    [sessionEffort, id]
  );
}

export async function getAllEntries(): Promise<Entry[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<EntryRow>(
    'SELECT * FROM entries ORDER BY timestamp ASC'
  );
  return rows.map(rowToEntry);
}

export async function getEntriesSince(timestamp: number): Promise<Entry[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<EntryRow>(
    'SELECT * FROM entries WHERE timestamp >= ? ORDER BY timestamp ASC',
    [timestamp]
  );
  return rows.map(rowToEntry);
}

export async function getLatestEntryTimestamp(): Promise<number | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ timestamp: number }>(
    'SELECT timestamp FROM entries ORDER BY timestamp DESC LIMIT 1'
  );
  return row?.timestamp ?? null;
}
