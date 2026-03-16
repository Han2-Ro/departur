import { DepartureAnnouncer, AnnouncerStatus } from "./announcerEngine";
import { fetchDepartureAnnouncements } from "./departureService";
import { speakText } from "./speech";

const STATION_DIVA = "60200439";
const POLL_INTERVAL_MS = 60_000;

type Callbacks = {
  onStatusChange?: (status: AnnouncerStatus) => void;
  onError?: (error: Error) => void;
};

export { AnnouncerStatus };

export const createDepartureAnnouncer = (callbacks: Callbacks): DepartureAnnouncer =>
  new DepartureAnnouncer({
    intervalMs: POLL_INTERVAL_MS,
    fetchAnnouncements: () => fetchDepartureAnnouncements(STATION_DIVA),
    speakAnnouncement: (text) => speakText(text),
    onStatusChange: callbacks.onStatusChange,
    onError: callbacks.onError,
  });
