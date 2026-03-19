import { createDepartureAnnouncer, DEFAULT_STATION_DIVA } from "./createDepartureAnnouncer";
import { fetchDepartureAnnouncements } from "./departureService";
import { speakText } from "./speech";

jest.mock("./departureService", () => ({
  fetchDepartureAnnouncements: jest.fn<Promise<string[]>, [string]>(),
}));

jest.mock("./speech", () => ({
  speakText: jest.fn<Promise<void>, [string]>(),
}));

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("createDepartureAnnouncer", () => {
  const fetchDepartureAnnouncementsMock =
    fetchDepartureAnnouncements as jest.MockedFunction<
      typeof fetchDepartureAnnouncements
    >;
  const speakTextMock = speakText as jest.MockedFunction<typeof speakText>;

  beforeEach(() => {
    jest.useFakeTimers();
    fetchDepartureAnnouncementsMock.mockReset();
    speakTextMock.mockReset();

    fetchDepartureAnnouncementsMock.mockResolvedValue(["next train"]);
    speakTextMock.mockResolvedValue();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("uses default station diva when none is provided", async () => {
    const announcer = createDepartureAnnouncer({});

    expect(announcer.start()).toBe(true);
    await flushPromises();

    expect(fetchDepartureAnnouncementsMock).toHaveBeenCalledWith(
      DEFAULT_STATION_DIVA
    );

    announcer.stop();
  });

  it("uses provided station diva instead of the default", async () => {
    const announcer = createDepartureAnnouncer({ stationDiva: "12345678" });

    expect(announcer.start()).toBe(true);
    await flushPromises();

    expect(fetchDepartureAnnouncementsMock).toHaveBeenCalledWith("12345678");
    expect(fetchDepartureAnnouncementsMock).not.toHaveBeenCalledWith(
      DEFAULT_STATION_DIVA
    );

    announcer.stop();
  });
});
