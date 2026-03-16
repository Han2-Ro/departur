const BASE_URL = "https://www.wienerlinien.at/ogd_realtime/monitor";

type DepartureTime = {
  countdown?: number;
};

type Departure = {
  departureTime?: DepartureTime;
};

type Departures = {
  departure?: Departure[];
};

type Line = {
  name?: string;
  towards?: string;
  departures?: Departures;
};

type Monitor = {
  lines?: Line[];
};

type MonitorResponse = {
  data?: {
    monitors?: Monitor[];
  };
};

export const buildAnnouncement = (
  lineName: string,
  towards: string,
  countdownMinutes: number,
): string =>
  `Linie ${lineName} Richtung ${towards} fährt ab in ${countdownMinutes} Minuten.`;

export const mapMonitorResponseToAnnouncements = (
  payload: MonitorResponse,
): string[] => {
  const monitors = payload.data?.monitors;
  if (!Array.isArray(monitors)) {
    throw new Error("Invalid Wiener Linien response: monitors missing");
  }

  const announcements: string[] = [];
  for (const monitor of monitors) {
    const line = monitor.lines?.[0];
    const countdown = line?.departures?.departure?.[0]?.departureTime?.countdown;
    if (
      !line?.name ||
      !line.towards ||
      typeof countdown !== "number" ||
      !Number.isFinite(countdown)
    ) {
      continue;
    }
    announcements.push(buildAnnouncement(line.name, line.towards, countdown));
  }

  return announcements;
};

type FetchLike = typeof fetch;

export const fetchDepartureAnnouncements = async (
  diva: string,
  fetchImpl: FetchLike = fetch,
): Promise<string[]> => {
  const url = `${BASE_URL}?diva=${encodeURIComponent(diva)}`;
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Departure API request failed with status ${response.status}`);
  }
  const payload = (await response.json()) as MonitorResponse;
  return mapMonitorResponseToAnnouncements(payload);
};
