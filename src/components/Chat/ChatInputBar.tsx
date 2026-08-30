import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { colors, spacing, radii } from '../../theme/tokens';

type Props = {
  onSend: (text: string) => void;
  onCamera: () => void;
  disabled?: boolean;
};

export function ChatInputBar({ onSend, onCamera, disabled }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleMic = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Tell me what you did…"
          placeholderTextColor={colors.inputPlaceholder}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={1000}
          editable={!disabled}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          style={styles.iconBtn}
          onPress={onCamera}
          disabled={disabled}
          hitSlop={8}
        >
          <Text style={styles.icon}>📷</Text>
        </Pressable>
        <Pressable
          style={styles.iconBtn}
          onPress={handleMic}
          disabled={disabled}
          hitSlop={8}
        >
          <Text style={styles.icon}>🎤</Text>
        </Pressable>
        <Pressable
          style={[styles.sendBtn, disabled && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={disabled || !text.trim()}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: colors.bg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    color: colors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
