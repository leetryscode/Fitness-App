# Gym Recovery

A personal iOS app for logging workouts through casual chat and tracking muscle recovery on a color-coded body map.

## What it does

- **Chat logging** — describe workouts in plain language ("did squats today, felt pretty hard 8/10")
- **Body map** — see per-muscle fatigue on a front/back SVG figure (green = fresh → red = fatigued)
- **Recovery decay** — fatigue fades over time at different rates per muscle group
- **Photo logging** — snap a gym machine photo and let the LLM identify muscles worked
- **On-device only** — SQLite storage, API key in secure store, no backend

## Tech stack

- Expo + React Native (TypeScript)
- expo-router (2 screens: main + settings modal)
- expo-sqlite, expo-secure-store, expo-image-picker
- Provider-swappable LLM client (OpenAI-compatible API shape)

## Getting started

### Prerequisites

- Node.js 18+
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)
- Apple Developer account (for TestFlight)

### Install

```bash
npm install
```

### Development build (required — not Expo Go)

Native modules (SQLite, secure store, camera) require a development build:

```bash
npx eas-cli build --profile development --platform ios
```

Install the resulting build on your device, then start the dev server:

```bash
npx expo start --dev-client
```

### iOS signing with App Store Connect API Key (no Apple ID login)

If EAS cannot sign you in with an Apple ID, use an **App Store Connect API key** instead. This is the recommended approach for CI and often more reliable than Apple ID login.

**1. Create the key** (one-time, in a browser):

1. Go to [App Store Connect → Users and Access → Integrations → App Store Connect API](https://appstoreconnect.apple.com/access/integrations/api)
2. Click **Generate API Key** (or use an existing key with **Admin** or **App Manager** role)
3. Download the `.p8` file (you can only download it once)
4. Note the **Key ID** and **Issuer ID** (shown on the same page)

**2. Store the key locally** (never commit it — `*.p8` is gitignored):

```bash
mkdir -p credentials
mv ~/Downloads/AuthKey_XXXXXXXXXX.p8 credentials/asc-api-key.p8
```

**3. Set environment variables** before building:

```bash
export EXPO_APPLE_APP_STORE_CONNECT_KEY_PATH="./credentials/asc-api-key.p8"
export EXPO_APPLE_APP_STORE_CONNECT_KEY_ID="YOUR_KEY_ID"        # e.g. ABC123XYZ
export EXPO_APPLE_APP_STORE_CONNECT_ISSUER_ID="YOUR_ISSUER_ID"  # UUID from App Store Connect
```

**4. Configure credentials** (one-time):

```bash
npx eas-cli credentials --platform ios
```

When prompted, choose **App Store Connect API Key** (not Apple ID). EAS will use the env vars above and store the credentials remotely for future builds.

**5. Build:**

```bash
npx eas-cli build --profile development --platform ios
```

### Expo account access token (if `eas login` fails)

If you cannot sign in to your Expo account interactively, create an access token at [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens), then:

```bash
export EXPO_TOKEN="your_expo_access_token"
npx eas-cli build --profile development --platform ios
```


### Configure API key

1. Open the app → tap the gear icon
2. Enter your LLM provider API key (OpenAI, Qwen, or Gemini)
3. Pick a model and start logging

API keys are stored on-device only and sent directly to your chosen provider.

### Production / TestFlight

```bash
eas build --profile production --platform ios
eas submit --platform ios
```

## Project structure

```
app/           # expo-router screens (main, settings)
src/
  components/  # BodyMap, Chat, Header
  db/          # SQLite schema and data access
  domain/      # Recovery decay engine
  hooks/       # useChat, useRecoveryState, useSettings
  llm/         # Provider-swappable LLM client
  storage/     # Secure API key storage
  theme/       # Design tokens (B/W/G + fatigue colors)
  types/       # Entry, muscle regions, fatigue levels
  utils/       # Photos, export, reminders
```

## Design

Monochrome UI (black, white, gray). Color is reserved exclusively for the body map fatigue scale.
