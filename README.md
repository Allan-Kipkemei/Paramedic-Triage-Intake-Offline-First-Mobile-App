# 🚑 Paramedic Triage Intake

<p align="center">
  <strong>Offline-First Mobile Triage Application</strong><br>
  Built with <strong>React Native (Expo)</strong>, <strong>TypeScript</strong>, and <strong>Zustand</strong>.
</p>

<p align="center">
Designed for emergency responders to capture patient triage information even without internet connectivity.
Every submission is stored locally first and automatically synchronized once the device reconnects.
</p>

<p align="center">
  <img src="./triage-demo.gif" alt="Paramedic Triage Demo" width="280"/>
</p>

<p align="center">
  <img src="./app-screenshot.jpg" alt="Paramedic Triage Screenshot" width="220"/>
</p>

<p align="center">

![React Native](https://img.shields.io/badge/React_Native-0.81-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK_54-black?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-orange)
![AsyncStorage](https://img.shields.io/badge/Storage-AsyncStorage-green)
![Offline First](https://img.shields.io/badge/Architecture-Offline_First-success)

</p>

---

# ✨ Features

- 🚑 Capture patient triage information quickly
- 💾 Offline-first architecture with local persistence
- 🔄 Automatic background synchronization
- 📡 Network monitoring using NetInfo
- ⚡ Instant submissions with optimistic updates
- 🏥 Priority classification (P1–P5)
- 📍 Patient transport status tracking
- 🧪 Unit tested using Jest

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native (Expo) | Mobile framework |
| TypeScript | Type safety |
| Zustand | State management |
| AsyncStorage | Local persistence |
| NetInfo | Network connectivity detection |
| Jest + jest-expo | Unit testing |

---

# 🏗 Architecture

```
components/
├── TriageForm.tsx
├── RecordList.tsx
└── PriorityBadge.tsx

store/
└── useTriageStore.ts

services/
├── api.ts
├── storage.ts
├── sync.ts
└── types.ts

__tests__/
```

## Design Principles

The application follows a clean separation of concerns.

### Presentation Layer

- React Native components
- Pure UI
- No persistence logic

### State Layer

Managed using **Zustand**.

Responsible for:

- Managing application state
- Coordinating storage
- Triggering synchronization

### Persistence Layer

Implemented using AsyncStorage.

Responsible for:

- Saving records locally
- Loading cached records
- Updating synchronization status

### Network Layer

A mock API simulates:

- POST `/api/v1/triage`
- Network latency
- Random failures

### Synchronization Layer

Handles:

- Connectivity changes
- Retry logic
- Background synchronization
- Queue processing

---

# 🔄 Offline-First Synchronization

The application guarantees that patient records are never lost because of network interruptions.

## 1. Local Persistence

When a paramedic submits a record:

- The record is immediately written to AsyncStorage.
- The UI updates instantly.
- No internet connection is required.

---

## 2. Sync Attempt

Immediately after saving, the application attempts to synchronize the record.

If no connection is available, the record simply remains queued.

---

## 3. Automatic Retry

Queued records automatically synchronize whenever:

- Internet connectivity returns.
- The application returns to the foreground.

No user interaction is required.

---

## 4. Synchronization Lock

A synchronization lock prevents multiple synchronization jobs from running simultaneously.

This avoids race conditions when multiple events trigger synchronization at nearly the same time.

---

## 5. Failure Isolation

Each queued record is synchronized independently.

If one upload fails:

- It remains queued.
- Successfully uploaded records remain synced.
- Failed records retry automatically during the next synchronization cycle.

---

## 6. Live Sync Status

Each record displays its synchronization status.

- 🟢 **SYNCED**
- 🟡 **QUEUED**

A banner also indicates how many records are currently waiting for synchronization.

---

# 🌐 Mock API

This assessment intentionally does not include a backend server.

Instead, the application uses a mock repository (`services/api.ts`) that simulates:

- POST `/api/v1/triage`
- ⏱ 2-second network delay
- ❌ 30% random network failure

This makes it possible to fully demonstrate the offline queue and automatic retry mechanism.

---

# 📂 Project Structure

```
.
├── components/
├── services/
│   ├── api.ts
│   ├── storage.ts
│   ├── sync.ts
│   └── types.ts
│
├── store/
├── __tests__/
│
├── triage-demo.gif
├── app-screenshot.jpg
├── App.tsx
├── package.json
└── README.md
```

---

# 🚀 Getting Started

Install dependencies

```bash
npm install
```

Start Expo

```bash
npx expo start
```

Run on Android

```bash
npm run android
```

Run on iOS

```bash
npm run ios
```

---

# 🧪 Running Tests

```bash
npm test
```

---

# 🎥 Demonstrating Offline Mode

1. Enable Airplane Mode.
2. Complete the triage form.
3. Submit the record.
4. Observe that the record is immediately saved with a **QUEUED** status.
5. Disable Airplane Mode.
6. Within a few seconds, the record automatically changes to **SYNCED** without any user interaction.

---

# 📌 Assessment Highlights

This project demonstrates:

- ✅ Offline-first mobile application design
- ✅ Local-first data persistence
- ✅ Automatic background synchronization
- ✅ Mock network layer
- ✅ Optimistic UI updates
- ✅ Network failure recovery
- ✅ Separation of concerns
- ✅ Clean architecture
- ✅ Zustand state management
- ✅ AsyncStorage persistence
- ✅ Unit testing with Jest