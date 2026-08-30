import React, { useRef, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ChatBubble } from './ChatBubble';
import { ChatMessage } from '../../types/entry';
import { colors, spacing } from '../../theme/tokens';

type Props = {
  messages: ChatMessage[];
  isLoading?: boolean;
};

export function ChatThread({ messages, isLoading }: Props) {
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isLoading]);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatBubble message={item} />}
      contentContainerStyle={styles.content}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.loadingText}>Thinking…</Text>
            </View>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.sm,
    flexGrow: 1,
  },
  loadingContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bubbleAssistant,
  },
  loadingText: {
    fontSize: 14,
    color: colors.muted,
  },
});
