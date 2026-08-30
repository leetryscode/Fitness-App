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
eas build --profile development --platform ios
```

Install the resulting build on your device, then start the dev server:

```bash
npx expo start --dev-client
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
