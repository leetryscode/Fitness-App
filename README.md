# Fitness App

A personal, single-user iOS app: log workouts by chatting or snapping a photo of a machine, and see a color-coded body map of which muscles are fatigued vs. recovered.

No workout plans, no exercise picklists, no rep/weight forms required. Just talk to it, and it keeps a visual map of your recovery state.

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
- Development builds via EAS, TestFlight for dogfooding

## Scope (v1)

- Chat-based workout logging (text or voice)
- Camera photo of a gym machine → auto-identify + muscle tag
- Color-coded recovery body map (front/back), per-muscle decay rates
- In-chat "what else should I do" suggestions

Not in v1: workout plans/programs, mandatory set/rep logging, social features, cloud sync, graphs/analytics, exercise database.

## Getting started

### Prerequisites

- Node.js 18+
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npx eas-cli`)
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

If EAS cannot sign you in with an Apple ID, use an **App Store Connect API key** instead.

**1. Create the key** at [App Store Connect → Integrations → API](https://appstoreconnect.apple.com/access/integrations/api)

**2. Store the key locally** (never commit — `*.p8` is gitignored):

```bash
mkdir -p credentials
# Windows PowerShell:
copy $env:USERPROFILE\Downloads\AuthKey_4FG26BT4YV.p8 .\credentials\asc-api-key.p8
```

Or drag the `.p8` file into the `credentials/` folder in Cursor's file explorer.

**3. Set environment variables** before building:

```bash
export EXPO_APPLE_APP_STORE_CONNECT_KEY_PATH="./credentials/asc-api-key.p8"
export EXPO_APPLE_APP_STORE_CONNECT_KEY_ID="YOUR_KEY_ID"
export EXPO_APPLE_APP_STORE_CONNECT_ISSUER_ID="YOUR_ISSUER_ID"
```

**4. Configure credentials and build:**

```bash
npx eas-cli credentials --platform ios
npx eas-cli build --profile development --platform ios
```

### Expo account access token (if `eas login` fails)

Create a token at [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens), then:

```bash
export EXPO_TOKEN="your_expo_access_token"
npx eas-cli build --profile development --platform ios
```

### Configure LLM API key (in the app)

1. Open the app → tap the gear icon
2. Enter your LLM provider API key (OpenAI, Qwen, or Gemini)
3. Pick a model and start logging

### Production / TestFlight

```bash
npx eas-cli build --profile production --platform ios
npx eas-cli submit --platform ios
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
