import {
  buildAnnouncement,
  fetchDepartureAnnouncements,
  mapMonitorResponseToAnnouncements,
} from "./departureService";

describe("departureService", () => {
  it("builds announcement text in German format", () => {
    expect(buildAnnouncement("U1", "Leopoldau", 3)).toBe(
      "Linie U1 Richtung Leopoldau fährt ab in 3 Minuten.",
    );
  });

  it("maps API payload to announcement list", () => {
    const payload = {
      data: {
        monitors: [
          {
            lines: [
              {
                name: "U1",
                towards: "Leopoldau",
                departures: {
                  departure: [{ departureTime: { countdown: 3 } }],
                },
              },
            ],
          },
          {
            lines: [
              {
                name: "U2",
                towards: "Karlsplatz",
                departures: {
                  departure: [{ departureTime: { countdown: 5 } }],
                },
              },
            ],
          },
        ],
      },
    };

    expect(mapMonitorResponseToAnnouncements(payload)).toEqual([
      "Linie U1 Richtung Leopoldau fährt ab in 3 Minuten.",
      "Linie U2 Richtung Karlsplatz fährt ab in 5 Minuten.",
    ]);
  });

  it("throws when monitors array is missing", () => {
    expect(() =>
      mapMonitorResponseToAnnouncements({ data: {} }),
    ).toThrow("Invalid Wiener Linien response: monitors missing");
  });

  it("fetches and parses announcements", async () => {
    const mockFetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        data: {
          monitors: [
            {
              lines: [
                {
                  name: "71",
                  towards: "Borse",
                  departures: {
                    departure: [{ departureTime: { countdown: 1 } }],
                  },
                },
              ],
            },
          ],
        },
      }),
    })) as unknown as typeof fetch;

    await expect(
      fetchDepartureAnnouncements("60200439", mockFetch),
    ).resolves.toEqual(["Linie 71 Richtung Borse fährt ab in 1 Minuten."]);
  });
});
