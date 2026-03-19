## Phase 2 Complete: Wire selected station into announcer creation

Updated announcer creation to accept an optional station diva and use the hardcoded default station when no override is provided. Added focused tests to prove default fallback and explicit override behavior without changing engine semantics.

**Files created/changed:**
- src/createDepartureAnnouncer.ts
- src/createDepartureAnnouncer.test.ts

**Functions created/changed:**
- createDepartureAnnouncer

**Tests created/changed:**
- uses default station diva when none is provided
- uses provided station diva instead of the default

**Review Status:** APPROVED

**Git Commit Message:**
feat: parameterize announcer station diva

- add optional stationDiva input to createDepartureAnnouncer
- preserve default station diva fallback of 60200439
- add tests for default and override station wiring
