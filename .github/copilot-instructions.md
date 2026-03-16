# Copilot Instructions for this Repository

## Build, test, and lint commands

- Install deps: `pnpm install`
- Start Expo dev server: `pnpm start`
- Run Android target: `pnpm android`
- Lint: `pnpm lint`
- Run all tests: `pnpm test`
- Run a single test file: `pnpm test src/departureService.test.ts`
- Run a single test case by name: `pnpm test -t "surfaces error status and callback on cycle failure"`

## High-level architecture

This app is a single-screen Expo React Native announcer for Wiener Linien realtime departures.

- `App.tsx` wires state (`idle`/`running`/`error`) to UI and creates one announcer instance with `useMemo`.
- `src/createDepartureAnnouncer.ts` composes the runtime dependencies and fixed behavior:
  - station `diva=60200439`
  - polling interval `60_000 ms`
  - fetch via `fetchDepartureAnnouncements`
  - speech via `speakText`
- `src/announcerEngine.ts` is the core orchestrator:
  - starts/stops interval polling
  - runs one cycle at a time (`cycleInProgress`) to avoid overlapping fetch/speak cycles
  - emits status changes and normalized errors through callbacks
- `src/departureService.ts` fetches and maps Wiener Linien monitor payloads into spoken German sentences.
- `src/speech.ts` adapts `expo-speech` to a Promise API and uses `language: "de-DE"`.
- `src/DepartureAnnouncerScreen.tsx` is a presentational screen with one start action and German user-facing labels.

## Key conventions in this codebase

- Keep `DepartureAnnouncer` dependency-injected (fetch/speak/interval/callbacks). Tests rely on constructor-injected mocks.
- Preserve start semantics: `start()` returns `false` if already running, and repeated cycles must not overlap.
- API mapping convention:
  - throw if `data.monitors` is missing
  - skip incomplete monitor entries (do not throw for partial line data)
  - announcement format is exact: `Linie {name} Richtung {towards} fährt ab in {countdown} Minuten.`
- Speech wrapper convention: resolve on both `onDone` and `onStopped`; reject on `onError`.
- UI/UX convention for current app scope: single screen, single start button (`Announcer starten`), error text prefixed with `Fehler:`.
- TypeScript is strict (`tsconfig.json`), and linting uses Expo flat config (`eslint-config-expo/flat`).

## TDD workflow

1. Add/adjust a test first.
2. Run `pnpm test` and confirm it fails (red).
3. Implement minimal code to pass (green).
4. Refactor while keeping tests green.
