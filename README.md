# Paramedic Triage Intake — Offline-First Mobile App

A field triage intake app for paramedics, built with **React Native (Expo) + TypeScript**.
Designed so that a submission never fails due to connectivity — records are saved locally
first, then synced in the background the moment the network comes back.

## Showcase

### Demo video

[Watch the offline-first sync demo](./IMG_9520.MOV)

### App photos

<img src="./photo_5947458141144419833_y%20(1).jpg" alt="Paramedic triage app screenshot" width="320" />

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Expo (React Native) + TypeScript | Fast to run on a real device via Expo Go, no native build step needed for the demo |
| State management | Zustand | Minimal boilerplate, keeps UI components decoupled from persistence/sync logic |
| Local persistence | `@react-native-async-storage/async-storage` | Lightweight, zero native config, sufficient for a flat list of triage records at assessment scale |
| Connectivity | `@react-native-community/netinfo` | Standard for detecting reconnection events on RN |
| Testing | Jest + `jest-expo` | Default RN testing setup |

> Persistence is isolated behind `services/storage.ts`. Swapping AsyncStorage for
> SQLite / WatermelonDB / MMKV later means changing one file — the store and UI
> are untouched.

## Architecture

```
components/        <- pure UI, no persistence or network code
  TriageForm.tsx
  RecordList.tsx
  PriorityBadge.tsx

store/
  useTriageStore.ts <- single source of truth for UI state (Zustand)

services/
  types.ts          <- shared TriageRecord type
  storage.ts         <- local persistence layer (swappable)
  api.ts              <- mock POST /api/v1/triage (2s delay + 30% random failure)
  sync.ts              <- background sync queue + connectivity/app-state listeners

__tests__/               <- unit tests for storage + sync
```

**Separation of concerns:** UI components only ever call `useTriageStore`. The
store is the only thing that talks to `storage.ts` and `sync.ts`. Neither
`storage.ts` nor `sync.ts` know that React exists — they're plain async
functions, which makes them trivially unit-testable without rendering any UI.

## How the offline-first sync queue works

1. **Submit is always instant.** `addRecord()` in the store writes to
   AsyncStorage immediately and returns — there is no network round-trip in
   the submit path. The paramedic never sees a spinner tied to connectivity.
2. **Optimistic sync attempt.** Right after saving, the store calls
   `trySync()`, which checks `NetInfo.fetch()`. If offline, it no-ops
   silently — no error shown, no retry loop spun up.
3. **Two independent triggers pick it back up:**
   - `NetInfo.addEventListener` fires when the device transitions from
     offline → online, and calls `trySync()`.
   - `AppState.addEventListener` fires when the app returns to the
     foreground, as a safety net for cases where the OS suspended the
     connectivity listener while backgrounded.
4. **A `isSyncing` lock** prevents two sync passes from racing each other if
   both triggers fire close together (e.g. reconnecting right as you
   foreground the app).
5. **Per-record failure isolation.** `trySync()` loops through all pending
   records and posts them one at a time. If one fails (simulated by the mock
   API's 30% random failure rate), it stays `synced: false` and is retried
   on the *next* sync trigger — it doesn't block or roll back the rest of
   the batch.
6. **UI reflects sync state live.** Each record shows a `SYNCED` / `QUEUED`
   tag, and a banner shows the count of records still pending, both driven
   by AsyncStorage state via the Zustand store.

## Mock server

Per the assessment note, there's no live backend. `services/api.ts` simulates
`POST /api/v1/triage` with a 2-second artificial delay and a 30% random
failure rate, so the retry path is actually exercised rather than just the
happy path.

## Running it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android/iOS) or run `npm run android` / `npm run ios`.

## Running tests

```bash
npm test
```

## Demoing the offline behavior (for the video clip)

1. Turn on Airplane Mode.
2. Fill in and submit a triage record — it saves instantly, no error, and
   shows a `QUEUED` tag with a "records queued for sync" banner.
3. Turn off Airplane Mode.
4. Within a few seconds the record flips to `SYNCED` and the pending banner
   disappears — no user action required.
