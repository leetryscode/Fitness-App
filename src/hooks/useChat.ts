import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, EntrySource } from '../types/entry';
import { insertEntry, getAllEntries } from '../db/entries';
import { sendWorkoutMessage } from '../llm/client';

export function useChat(onEntryAdded?: () => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    const entries = await getAllEntries();
    const history: ChatMessage[] = [];
    for (const entry of entries) {
      if (entry.rawUserText) {
        history.push({
          id: `${entry.id}-user`,
          role: 'user',
          content: entry.rawUserText,
          timestamp: entry.timestamp,
          imageReference: entry.imageReference,
        });
      }
      history.push({
        id: `${entry.id}-assistant`,
        role: 'assistant',
        content: entry.rawAiResponse,
        timestamp: entry.timestamp + 1,
      });
    }
    setMessages(history);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const sendMessage = useCallback(
    async (params: {
      text: string;
      imageBase64?: string;
      imageMimeType?: string;
      imageReference?: string;
      source?: EntrySource;
    }) => {
      const { text, imageBase64, imageMimeType, imageReference, source } =
        params;
      const displayText =
        text || (imageReference ? '📷 Photo logged' : '');
      if (!displayText && !imageBase64) return;

      setError(null);
      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: displayText,
        timestamp: Date.now(),
        imageReference,
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const history = messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-10)
          .map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          }));

        const response = await sendWorkoutMessage({
          userText: text || 'Identify this gym equipment and log muscles worked.',
          history,
          imageBase64,
          imageMimeType,
        });

        const hasMuscles = response.muscles.length > 0;
        await insertEntry({
          timestamp: Date.now(),
          rawUserText: text || null,
          rawAiResponse: response.summary,
          imageReference: imageReference ?? null,
          parsedMuscleTags: hasMuscles ? response.muscles : [],
          source: source ?? (imageBase64 ? 'photo' : 'chat'),
        });

        const assistantMsg: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: response.summary,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        onEntryAdded?.();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        const errorMsg: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: message,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, onEntryAdded]
  );

  return { messages, isLoading, error, sendMessage, loadHistory };
}
