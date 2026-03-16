export type AnnouncerStatus = "idle" | "running" | "error";

type EngineDeps = {
  fetchAnnouncements: () => Promise<string[]>;
  speakAnnouncement: (text: string) => Promise<void>;
  intervalMs: number;
  onStatusChange?: (status: AnnouncerStatus) => void;
  onError?: (error: Error) => void;
};

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

export class DepartureAnnouncer {
  private readonly deps: EngineDeps;
  private timerId: ReturnType<typeof setInterval> | undefined = undefined;
  private running = false;
  private cycleInProgress = false;

  constructor(deps: EngineDeps) {
    this.deps = deps;
  }

  start(): boolean {
    if (this.running) {
      return false;
    }
    this.running = true;
    this.deps.onStatusChange?.("running");
    void this.executeCycle();
    this.timerId = setInterval(() => {
      void this.executeCycle();
    }, this.deps.intervalMs);
    return true;
  }

  stop(): void {
    this.running = false;
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
    this.deps.onStatusChange?.("idle");
  }

  isRunning(): boolean {
    return this.running;
  }

  private async executeCycle(): Promise<void> {
    if (!this.running || this.cycleInProgress) {
      return;
    }
    this.cycleInProgress = true;
    try {
      const announcements = await this.deps.fetchAnnouncements();
      for (const announcement of announcements) {
        if (!this.running) {
          break;
        }
        await this.deps.speakAnnouncement(announcement);
      }
      if (this.running) {
        this.deps.onStatusChange?.("running");
      }
    } catch (error) {
      const normalizedError = toError(error);
      this.deps.onStatusChange?.("error");
      this.deps.onError?.(normalizedError);
    } finally {
      this.cycleInProgress = false;
    }
  }
}
