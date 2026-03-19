## Phase 1 Complete: Add station domain and OGD search service

Implemented a strict station domain model and a Wiener Linien OGD-backed station search service with robust CSV parsing, case-insensitive matching, invalid-row filtering, and in-memory dataset caching. All phase-targeted tests pass and repository lint passes.

**Files created/changed:**
- src/types/station.ts
- src/stationSearchService.ts
- src/stationSearchService.test.ts

**Functions created/changed:**
- searchStationsByName
- parseCsv
- parseStationDataset
- loadStationDataset

**Tests created/changed:**
- returns empty list for blank query without fetching
- throws with status when station source request fails
- parses CSV rows, filters invalid entries, and searches by case-insensitive name
- caches parsed station dataset across calls

**Review Status:** APPROVED

**Git Commit Message:**
feat: add station search service

- add Station domain type with name and diva fields
- implement OGD CSV station search with cached dataset loading
- add unit tests for blank query, errors, parsing, and caching
