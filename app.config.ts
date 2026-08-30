import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Gym Recovery',
  slug: 'gym-recovery',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'gym-recovery',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.gymrecovery.app',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        'Take photos of gym equipment to log what you worked.',
      NSMicrophoneUsageDescription:
        'Use the keyboard microphone to dictate your workout.',
      NSPhotoLibraryUsageDescription:
        'Save workout photos to your device.',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    package: 'com.gymrecovery.app',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-dev-client',
    'expo-router',
    'expo-sqlite',
    'expo-secure-store',
    'expo-sharing',
    [
      'expo-image-picker',
      {
        cameraPermission:
          'Take photos of gym equipment to log what you worked.',
        photosPermission: 'Save workout photos to your device.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'ed0132a8-53e0-4e77-b0af-927bd1ad32a9',
    },
  },
});
