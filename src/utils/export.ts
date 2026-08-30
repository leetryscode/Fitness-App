import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { getAllEntries } from '../db/entries';

export async function exportWorkoutHistory(): Promise<void> {
  const entries = await getAllEntries();
  const exportData = {
    exportedAt: new Date().toISOString(),
    entryCount: entries.length,
    entries: entries.map((e) => ({
      id: e.id,
      timestamp: e.timestamp,
      date: new Date(e.timestamp).toISOString(),
      rawUserText: e.rawUserText,
      rawAiResponse: e.rawAiResponse,
      imageReference: e.imageReference,
      parsedMuscleTags: e.parsedMuscleTags,
      source: e.source,
    })),
  };

  const json = JSON.stringify(exportData, null, 2);
  const filename = `gym-recovery-export-${Date.now()}.json`;
  const exportFile = new File(Paths.cache, filename);
  exportFile.write(json);

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }

  await Sharing.shareAsync(exportFile.uri, {
    mimeType: 'application/json',
    dialogTitle: 'Export Workout History',
  });
}
