import type { Station } from "./types/station";

const OGD_STATIONS_CSV_URL =
  "https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-haltestellen.csv"

type FetchLike = typeof fetch;
type CsvDelimiter = "," | ";";

let stationCache: Promise<Station[]> | null = null;

const detectDelimiter = (headerLine: string): CsvDelimiter => {
  const semicolonCount = (headerLine.match(/;/g) ?? []).length;
  const commaCount = (headerLine.match(/,/g) ?? []).length;

  return semicolonCount >= commaCount ? ";" : ",";
};

const parseCsvLine = (line: string, delimiter: CsvDelimiter): string[] => {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
};

const parseStationsCsv = (csvText: string): Station[] => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const delimiter = detectDelimiter(lines[0]);
  const header = parseCsvLine(lines[0], delimiter).map((cell) =>
    cell.toLowerCase().replace(/^\uFEFF/, ""),
  );
  const divaIndex = header.indexOf("diva");
  const nameIndex = ["name", "platformtext", "haltestellenname", "stopname"]
    .map((key) => header.indexOf(key))
    .find((index) => index !== -1);

  if (divaIndex === -1 || nameIndex === undefined) {
    return [];
  }

  const stations: Station[] = [];

  for (const line of lines.slice(1)) {
    const cells = parseCsvLine(line, delimiter);
    const diva = cells[divaIndex]?.trim();
    const name = cells[nameIndex]?.trim();

    if (!diva || !name) {
      continue;
    }

    stations.push({ diva, name });
  }

  return stations;
};

const loadStations = async (fetchImpl: FetchLike): Promise<Station[]> => {
  if (!stationCache) {
    stationCache = (async () => {
      const response = await fetchImpl(OGD_STATIONS_CSV_URL);
      if (!response.ok) {
        throw new Error(
          `Station search request failed with status ${response.status}`,
        );
      }

      const csvText = await response.text();
      return parseStationsCsv(csvText);
    })();
  }

  return stationCache;
};

export const searchStationsByName = async (
  query: string,
  fetchImpl: FetchLike = fetch,
): Promise<Station[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const stations = await loadStations(fetchImpl);

  return stations.filter((station) =>
    station.name.toLowerCase().includes(normalizedQuery),
  );
};
