import { DepartureAnnouncer, AnnouncerStatus } from "./announcerEngine";
import { fetchDepartureAnnouncements } from "./departureService";
import { speakText } from "./speech";

export const DEFAULT_STATION_DIVA = "60200439";
const POLL_INTERVAL_MS = 60_000;

type CreateDepartureAnnouncerOptions = {
  stationDiva?: string;
  onStatusChange?: (status: AnnouncerStatus) => void;
  onError?: (error: Error) => void;
};

export { AnnouncerStatus };

export const createDepartureAnnouncer = (
  options: CreateDepartureAnnouncerOptions
): DepartureAnnouncer => {
  const stationDiva = options.stationDiva ?? DEFAULT_STATION_DIVA;

  return new DepartureAnnouncer({
    intervalMs: POLL_INTERVAL_MS,
    fetchAnnouncements: () => fetchDepartureAnnouncements(stationDiva),
    speakAnnouncement: (text) => speakText(text),
    onStatusChange: options.onStatusChange,
    onError: options.onError,
  });
};
