import { fireEvent, render, waitFor } from "@testing-library/react-native";
import App from "./App";

const mockStart = jest.fn<boolean, []>();
const mockCreateDepartureAnnouncer = jest.fn();
const mockSearchStationsByName = jest.fn();

jest.mock("./src/createDepartureAnnouncer", () => ({
  createDepartureAnnouncer: (options: unknown) =>
    mockCreateDepartureAnnouncer(options),
  DEFAULT_STATION_DIVA: "60200439",
}));

jest.mock("./src/stationSearchService", () => ({
  searchStationsByName: (...args: unknown[]) => mockSearchStationsByName(...args),
}));

describe("App", () => {
  beforeEach(() => {
    mockStart.mockReset();
    mockStart.mockReturnValue(true);

    mockCreateDepartureAnnouncer.mockReset();
    mockCreateDepartureAnnouncer.mockImplementation(() => ({
      start: mockStart,
      stop: jest.fn(),
      isRunning: jest.fn(() => false),
    }));

    mockSearchStationsByName.mockReset();
    mockSearchStationsByName.mockResolvedValue([]);
  });

  it("shows default selected station and starts with default diva initially", () => {
    const { getByText } = render(<App />);

    expect(
      getByText("Ausgewählte Station: Standardstation (60200439)"),
    ).toBeTruthy();

    fireEvent.press(getByText("Announcer starten"));

    expect(mockCreateDepartureAnnouncer).toHaveBeenCalledWith(
      expect.objectContaining({ stationDiva: "60200439" }),
    );
    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  it("updates selected station from search and starts with that diva", async () => {
    mockSearchStationsByName.mockResolvedValue([
      { diva: "60200002", name: "Westbahnhof" },
    ]);

    const { getByPlaceholderText, getByRole, getByText } = render(<App />);

    fireEvent.changeText(getByPlaceholderText("Station suchen"), "west");

    await waitFor(() => {
      expect(mockSearchStationsByName).toHaveBeenCalledWith("west");
    });

    fireEvent.press(getByRole("button", { name: "Station wählen: Westbahnhof" }));

    expect(getByText("Ausgewählte Station: Westbahnhof (60200002)")).toBeTruthy();

    fireEvent.press(getByText("Announcer starten"));

    expect(mockCreateDepartureAnnouncer).toHaveBeenLastCalledWith(
      expect.objectContaining({ stationDiva: "60200002" }),
    );
    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  it("does not repopulate stale search results after query is cleared", async () => {
    let resolveSearch: ((stations: { diva: string; name: string }[]) => void) | undefined;
    const pendingSearch = new Promise<{ diva: string; name: string }[]>((resolve) => {
      resolveSearch = resolve;
    });
    mockSearchStationsByName.mockReturnValue(pendingSearch);

    const { getByPlaceholderText, queryByRole } = render(<App />);

    fireEvent.changeText(getByPlaceholderText("Station suchen"), "west");

    await waitFor(() => {
      expect(mockSearchStationsByName).toHaveBeenCalledWith("west");
    });

    fireEvent.changeText(getByPlaceholderText("Station suchen"), "");

    resolveSearch?.([{ diva: "60200002", name: "Westbahnhof" }]);

    await waitFor(() => {
      expect(
        queryByRole("button", { name: "Station wählen: Westbahnhof" }),
      ).toBeNull();
    });
  });

  it("shows search errors with Fehler prefix", async () => {
    mockSearchStationsByName.mockRejectedValue(new Error("Suche kaputt"));
    const { getByPlaceholderText, findByText } = render(<App />);

    fireEvent.changeText(getByPlaceholderText("Station suchen"), "west");

    expect(await findByText("Fehler: Suche kaputt")).toBeTruthy();
  });

  it("shows search results from service and selects one end-to-end in app", async () => {
    mockSearchStationsByName.mockResolvedValue([
      { diva: "60200001", name: "Schrankenberggasse" },
      { diva: "60200002", name: "Achengasse" },
    ]);

    const { getByPlaceholderText, getByRole, getByText } = render(<App />);

    fireEvent.changeText(getByPlaceholderText("Station suchen"), "schrank");

    const firstResult = await waitFor(() =>
      getByRole("button", { name: "Station wählen: Schrankenberggasse" }),
    );

    fireEvent.press(firstResult);

    expect(
      getByText("Ausgewählte Station: Schrankenberggasse (60200001)"),
    ).toBeTruthy();
  });
});
