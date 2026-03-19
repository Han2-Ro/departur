## Plan: Station Search And Selection

Add station search by name and station selection so departure announcements use the selected station instead of a fixed hardcoded value. Keep the current hardcoded station as the default selected station, preserve announcer start/error semantics, and implement each phase with strict TDD.

**Phases 4**
1. **Phase 1: Add station domain and OGD search service**
    - **Objective:** Introduce typed station model and a Wiener Linien OGD-backed station search service with robust parsing and caching primitives.
    - **Files/Functions to Modify/Create:** `src/types/station.ts`; `src/stationSearchService.ts` (`searchStationsByName`, parsing helpers); `src/stationSearchService.test.ts`.
    - **Tests to Write:** parses OGD CSV rows into stations; filters invalid rows; matches by case-insensitive name query; returns empty for blank query; caches source dataset after first fetch; throws on non-OK response.
    - **Steps:**
        1. Write failing unit tests for station type-safe parsing, filtering, query matching, and network error handling.
        2. Run targeted tests to confirm failures.
        3. Implement minimal station search service and helpers against OGD CSV with strict typing.
        4. Run targeted tests to confirm pass.

2. **Phase 2: Wire selected station into announcer creation**
    - **Objective:** Make announcer fetch departures for selected station diva while preserving default `60200439` and existing start/stop semantics.
    - **Files/Functions to Modify/Create:** `src/createDepartureAnnouncer.ts` (parameterize station diva/default constant); `src/createDepartureAnnouncer.test.ts`; optional `src/announcerEngine.test.ts` non-regression updates.
    - **Tests to Write:** uses default diva when none selected; uses provided diva when selected; does not regress existing cycle/start guards.
    - **Steps:**
        1. Write failing tests for default and selected diva wiring.
        2. Run targeted tests to confirm failures.
        3. Implement minimal factory changes to inject effective diva without changing engine guarantees.
        4. Run targeted tests to confirm pass.

3. **Phase 3: Implement UI search and station selection**
    - **Objective:** Extend single-screen UI with station search and selection controls, showing default selected station and locking selection while announcer is running.
    - **Files/Functions to Modify/Create:** `App.tsx`; `src/DepartureAnnouncerScreen.tsx`; `src/DepartureAnnouncerScreen.test.tsx`; `src/App.test.tsx`.
    - **Tests to Write:** renders default station; typing search triggers lookup; selecting result updates selected station; start uses selected station; selection controls disabled while running; error rendering remains prefixed with `Fehler:`.
    - **Steps:**
        1. Write failing UI and wiring tests for search, selection, running-state lock, and default selection.
        2. Run targeted tests to confirm failures.
        3. Implement minimal UI props/state wiring and async search integration in app layer.
        4. Run targeted tests to confirm pass.

4. **Phase 4: Final verification and docs update**
    - **Objective:** Ensure end-to-end behavior is covered by existing test suite and update docs for new station selection behavior.
    - **Files/Functions to Modify/Create:** `README.md`; any touched test files for final adjustments.
    - **Tests to Write:** no net-new behavior tests unless required by regressions discovered in full suite.
    - **Steps:**
        1. Run repository lint and full tests to detect regressions.
        2. Apply minimal fixes if regressions appear and re-run affected tests.
        3. Update README to document default station and station search/selection behavior.
        4. Re-run lint and tests to confirm green.

**Open Questions 1**
1. Should selected station persist across app restarts? Option A: no persistence (in-memory only) / Option B: persist locally.
