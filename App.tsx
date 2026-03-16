import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { DepartureAnnouncerScreen } from "./src/DepartureAnnouncerScreen";
import {
  AnnouncerStatus,
  createDepartureAnnouncer,
} from "./src/createDepartureAnnouncer";

export default function App() {
  const [status, setStatus] = useState<AnnouncerStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const announcer = useMemo(
    () =>
      createDepartureAnnouncer({
        onStatusChange: setStatus,
        onError: (nextError) => setError(nextError.message),
      }),
    [],
  );

  const handleStart = () => {
    setError(undefined);
    announcer.start();
  };

  return (
    <>
      <DepartureAnnouncerScreen
        error={error}
        onStart={handleStart}
        status={status}
      />
      <StatusBar style="auto" />
    </>
  );
}
