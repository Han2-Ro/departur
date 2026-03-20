import type { Station } from "./types/station";

describe("stationSearchService", () => {
  const csvPayload = [
    "DIVA,NAME,EXTRA",
    '"60200001","Karlsplatz","x"',
    '"60200002","Westbahnhof, Europaplatz","x"',
    '","No Diva","x"',
    '"60200003","","x"',
    '"60200004","Praterstern","x"',
  ].join("\n");

  const loadService = (): {
    searchStationsByName: (query: string, fetchImpl?: typeof fetch) => Promise<Station[]>;
  } => {
    jest.resetModules();
    return jest.requireActual("./stationSearchService") as {
      searchStationsByName: (
        query: string,
        fetchImpl?: typeof fetch,
      ) => Promise<Station[]>;
    };
  };

  it("returns empty list for blank query without fetching", async () => {
    const mockFetch = jest.fn(async () => {
      throw new Error("should not fetch for blank query");
    }) as unknown as typeof fetch;

    const { searchStationsByName } = loadService();

    await expect(searchStationsByName("   ", mockFetch)).resolves.toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throws with status when station source request fails", async () => {
    const mockFetch = jest.fn(async () => ({
      ok: false,
      status: 503,
    })) as unknown as typeof fetch;

    const { searchStationsByName } = loadService();

    await expect(searchStationsByName("kar", mockFetch)).rejects.toThrow(
      "Station search request failed with status 503",
    );
  });

  it("parses CSV rows, filters invalid entries, and searches by case-insensitive name", async () => {
    const mockFetch = jest.fn(async () => ({
      ok: true,
      text: async () => csvPayload,
    })) as unknown as typeof fetch;

    const { searchStationsByName } = loadService();

    await expect(searchStationsByName("westbahnhof", mockFetch)).resolves.toEqual<
      Station[]
    >([{ diva: "60200002", name: "Westbahnhof, Europaplatz" }]);

    await expect(searchStationsByName("platz", mockFetch)).resolves.toEqual<
      Station[]
    >([
      { diva: "60200001", name: "Karlsplatz" },
      { diva: "60200002", name: "Westbahnhof, Europaplatz" },
    ]);
  });

  it("caches parsed station dataset across calls", async () => {
    const mockFetch = jest.fn(async () => ({
      ok: true,
      text: async () => csvPayload,
    })) as unknown as typeof fetch;

    const { searchStationsByName } = loadService();

    await expect(searchStationsByName("kar", mockFetch)).resolves.toEqual<Station[]>(
      [{ diva: "60200001", name: "Karlsplatz" }],
    );
    await expect(searchStationsByName("prater", mockFetch)).resolves.toEqual<
      Station[]
    >([{ diva: "60200004", name: "Praterstern" }]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it(
    "loads stations from the live OGD URL without a mocked fetch",
    async () => {
      const { searchStationsByName } = loadService();

      const results = await searchStationsByName("schra");

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toEqual(
        expect.objectContaining({
          diva: expect.any(String),
          name: expect.any(String),
        }),
      );
    },
    30000,
  );
});
