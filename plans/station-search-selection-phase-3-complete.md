## Phase 3 Complete: Implement UI search and station selection

Added station search and selection controls to the single-screen UI, wired app state so selected station drives announcer station diva at start, and preserved existing status/error UX. Also fixed and covered a stale async search race so cleared queries cannot repopulate old results.

**Files created/changed:**
- App.tsx
- App.test.tsx
- src/DepartureAnnouncerScreen.tsx
- src/DepartureAnnouncerScreen.test.tsx

**Functions created/changed:**
- App (state and handlers)
- handleSearchQueryChange
- handleStationSelect
- DepartureAnnouncerScreen

**Tests created/changed:**
- renders default selected station in app
- typing search query triggers station lookup
- selecting a search result updates selected station
- starting announcer uses selected station diva
- search failure surfaces Fehler prefix
- does not repopulate stale search results after query is cleared
- disables search input and station selection while running
- renders selected station and invokes onSelectStation callback

**Review Status:** APPROVED

**Git Commit Message:**
feat: add station search and station selection UI

- wire app state for selected station and station search results
- add searchable station UI and lock controls while announcer runs
- cover app and screen interactions including stale-search race fix
