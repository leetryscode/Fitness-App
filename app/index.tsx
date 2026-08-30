import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../src/components/Header';
import { BodyMap } from '../src/components/BodyMap/BodyMap';
import { ChatThread } from '../src/components/Chat/ChatThread';
import { ChatInputBar } from '../src/components/Chat/ChatInputBar';
import { useRecoveryState } from '../src/hooks/useRecoveryState';
import { useChat } from '../src/hooks/useChat';
import { captureAndSavePhoto } from '../src/utils/photos';
import { ALL_REGIONS, MuscleRegion } from '../src/types/muscles';
import { FatigueLevel } from '../src/types/fatigue';
import { colors } from '../src/theme/tokens';

const defaultFatigue = ALL_REGIONS.reduce(
  (acc, region) => {
    acc[region] = 'fresh' as FatigueLevel;
    return acc;
  },
  {} as Record<MuscleRegion, FatigueLevel>
);

export default function MainScreen() {
  const router = useRouter();
  const { fatigue, refresh } = useRecoveryState();
  const { messages, isLoading, sendMessage } = useChat(refresh);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleCamera = useCallback(async () => {
    try {
      const photo = await captureAndSavePhoto();
      if (!photo) return;
      await sendMessage({
        text: '',
        imageBase64: photo.base64,
        imageMimeType: photo.mimeType,
        imageReference: photo.uri,
        source: 'photo',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to capture photo';
      await sendMessage({ text: `[Camera error: ${message}]` });
    }
  }, [sendMessage]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Header onSettingsPress={() => router.push('/settings')} />

        <View style={styles.mapSection}>
          <BodyMap fatigue={fatigue ?? defaultFatigue} />
        </View>

        <View style={styles.chatSection}>
          <ChatThread messages={messages} isLoading={isLoading} />
        </View>

        <ChatInputBar
          onSend={handleSend}
          onCamera={handleCamera}
          disabled={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
  mapSection: {
    maxHeight: '42%',
  },
  chatSection: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
