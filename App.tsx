import { StatusBar } from "expo-status-bar";
import { useCallback, useRef, useState } from "react";
import { DepartureAnnouncerScreen } from "./src/DepartureAnnouncerScreen";
import {
  AnnouncerStatus,
  createDepartureAnnouncer,
  DEFAULT_STATION_DIVA,
} from "./src/createDepartureAnnouncer";
import { searchStationsByName } from "./src/stationSearchService";
import type { Station } from "./src/types/station";

const DEFAULT_STATION: Station = {
  diva: DEFAULT_STATION_DIVA,
  name: "Standardstation",
};

export default function App() {
  const [status, setStatus] = useState<AnnouncerStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedStation, setSelectedStation] = useState<Station>(DEFAULT_STATION);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);

  const searchRequestId = useRef(0);

  const isRunning = status === "running";

  const handleStart = () => {
    setError(undefined);

    const announcer = createDepartureAnnouncer({
      stationDiva: selectedStation.diva,
      onStatusChange: setStatus,
      onError: (nextError) => setError(nextError.message),
    });

    announcer.start();
  };

  const handleSearchQueryChange = useCallback(
    async (query: string) => {
      if (isRunning) {
        return;
      }

      setSearchQuery(query);
      setError(undefined);

      const normalizedQuery = query.trim();
      if (!normalizedQuery) {
        searchRequestId.current += 1;
        setSearchResults([]);
        return;
      }

      const requestId = searchRequestId.current + 1;
      searchRequestId.current = requestId;

      try {
        const results = await searchStationsByName(query);
        if (searchRequestId.current !== requestId) {
          return;
        }
        setSearchResults(results);
      } catch (searchError) {
        if (searchRequestId.current !== requestId) {
          return;
        }

        const message =
          searchError instanceof Error
            ? searchError.message
            : String(searchError);
        setSearchResults([]);
        setError(message);
      }
    },
    [isRunning],
  );

  const handleSelectStation = useCallback(
    (station: Station) => {
      if (isRunning) {
        return;
      }
      setSelectedStation(station);
    },
    [isRunning],
  );

  return (
    <>
      <DepartureAnnouncerScreen
        error={error}
        onSearchQueryChange={handleSearchQueryChange}
        onSelectStation={handleSelectStation}
        onStart={handleStart}
        searchQuery={searchQuery}
        searchResults={searchResults}
        selectedStation={selectedStation}
        status={status}
      />
      <StatusBar style="auto" />
    </>
  );
}
