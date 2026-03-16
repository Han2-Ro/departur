import { DepartureAnnouncer } from "./announcerEngine";

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("DepartureAnnouncer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts once and rejects duplicate starts", async () => {
    const fetchAnnouncements = jest
      .fn<Promise<string[]>, []>()
      .mockResolvedValue(["one"]);
    const speakAnnouncement = jest.fn<Promise<void>, [string]>().mockResolvedValue();

    const announcer = new DepartureAnnouncer({
      fetchAnnouncements,
      speakAnnouncement,
      intervalMs: 1000,
    });

    expect(announcer.start()).toBe(true);
    expect(announcer.start()).toBe(false);

    await flushPromises();
    expect(fetchAnnouncements).toHaveBeenCalledTimes(1);
    expect(speakAnnouncement).toHaveBeenCalledWith("one");
  });

  it("repeats cycles based on interval and stops cleanly", async () => {
    const fetchAnnouncements = jest
      .fn<Promise<string[]>, []>()
      .mockResolvedValue(["announcement"]);
    const speakAnnouncement = jest.fn<Promise<void>, [string]>().mockResolvedValue();

    const announcer = new DepartureAnnouncer({
      fetchAnnouncements,
      speakAnnouncement,
      intervalMs: 1000,
    });

    announcer.start();
    await flushPromises();
    expect(fetchAnnouncements).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    await flushPromises();
    expect(fetchAnnouncements).toHaveBeenCalledTimes(2);

    announcer.stop();
    jest.advanceTimersByTime(5000);
    await flushPromises();
    expect(fetchAnnouncements).toHaveBeenCalledTimes(2);
  });

  it("surfaces error status and callback on cycle failure", async () => {
    const onStatusChange = jest.fn<void, ["idle" | "running" | "error"]>();
    const onError = jest.fn<void, [Error]>();
    const fetchAnnouncements = jest
      .fn<Promise<string[]>, []>()
      .mockRejectedValue(new Error("boom"));

    const announcer = new DepartureAnnouncer({
      fetchAnnouncements,
      speakAnnouncement: jest.fn<Promise<void>, [string]>().mockResolvedValue(),
      intervalMs: 1000,
      onError,
      onStatusChange,
    });

    announcer.start();
    await flushPromises();

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(onStatusChange).toHaveBeenCalledWith("error");
  });
});
