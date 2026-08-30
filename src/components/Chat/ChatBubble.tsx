import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage, SessionEffort } from '../../types/entry';
import { EffortSelector } from '../EffortSelector';
import { colors, spacing, radii, typography } from '../../theme/tokens';

type Props = {
  message: ChatMessage;
  onEffortChange?: (entryId: string, effort: SessionEffort | null) => void;
};

export function ChatBubble({ message, onEffortChange }: Props) {
  const isUser = message.role === 'user';
  const showEffortSelector =
    !isUser && message.hasMuscles && message.entryId && onEffortChange;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message.content}
        </Text>
        {showEffortSelector && (
          <EffortSelector
            value={message.sessionEffort ?? null}
            onChange={(effort) => onEffortChange(message.entryId!, effort)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.lg,
  },
  userBubble: {
    backgroundColor: colors.bubbleUser,
  },
  assistantBubble: {
    backgroundColor: colors.bubbleAssistant,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    ...typography.body,
    lineHeight: 20,
  },
  userText: {
    color: colors.bubbleUserText,
  },
  assistantText: {
    color: colors.bubbleAssistantText,
  },
});
