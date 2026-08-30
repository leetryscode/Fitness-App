# Fitness App

A personal, single-user iOS app: log workouts by chatting or snapping a photo of a machine, and see a color-coded body map of which muscles are fatigued vs. recovered.

No workout plans, no exercise picklists, no rep/weight forms required. Just talk to it, and it keeps a visual map of your recovery state.

## Status

Early build. Design and spec complete — implementation starting via Expo + Cursor.

## Stack

- Expo + React Native (TypeScript)
- On-device SQLite (`expo-sqlite`) — no backend, no accounts
- LLM call for parsing chat/photo input into muscle tags (provider TBD — evaluating Qwen3-VL, Gemini, others)
- Development builds via EAS, TestFlight for dogfooding

## Scope (v1)

- Chat-based workout logging (text or voice)
- Camera photo of a gym machine → auto-identify + muscle tag
- Color-coded recovery body map (front/back), per-muscle decay rates
- In-chat "what else should I do" suggestions

Not in v1: workout plans/programs, mandatory set/rep logging, social features, cloud sync, graphs/analytics, exercise database. Those are deliberately deferred.
