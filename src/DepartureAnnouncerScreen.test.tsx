import { fireEvent, render } from "@testing-library/react-native";
import type { Station } from "./types/station";
import { DepartureAnnouncerScreen } from "./DepartureAnnouncerScreen";

const DEFAULT_STATION: Station = {
  diva: "60200439",
  name: "Default Station",
};

describe("DepartureAnnouncerScreen", () => {
  it("calls onStart when idle start button is pressed", () => {
    const onStart = jest.fn();
    const { getByText } = render(
      <DepartureAnnouncerScreen
        onSearchQueryChange={jest.fn()}
        onSelectStation={jest.fn()}
        onStart={onStart}
        searchQuery=""
        searchResults={[]}
        selectedStation={DEFAULT_STATION}
        status="idle"
      />,
    );

    fireEvent.press(getByText("Announcer starten"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("disables search and selection controls while running", () => {
    const onStart = jest.fn();
    const onSelectStation = jest.fn();
    const searchResult: Station = { diva: "60200002", name: "Westbahnhof" };

    const { getByDisplayValue, getByRole, getByText } = render(
      <DepartureAnnouncerScreen
        onSearchQueryChange={jest.fn()}
        onSelectStation={onSelectStation}
        onStart={onStart}
        searchQuery="west"
        searchResults={[searchResult]}
        selectedStation={DEFAULT_STATION}
        status="running"
      />,
    );

    const startButton = getByRole("button", { name: "Announcer läuft..." });
    const stationButton = getByRole("button", { name: `Station wählen: ${searchResult.name}` });

    fireEvent.changeText(getByDisplayValue("west"), "kar");
    fireEvent.press(stationButton);
    fireEvent.press(startButton);

    expect(onSelectStation).not.toHaveBeenCalled();
    expect(onStart).not.toHaveBeenCalled();
    expect(startButton.props.accessibilityState.disabled).toBe(true);
    expect(stationButton.props.accessibilityState.disabled).toBe(true);
    expect(getByText("Ausgewählte Station: Default Station (60200439)")).toBeTruthy();
  });

  it("allows selecting a search result", () => {
    const onSelectStation = jest.fn();
    const searchResult: Station = { diva: "60200002", name: "Westbahnhof" };
    const { getByRole } = render(
      <DepartureAnnouncerScreen
        onSearchQueryChange={jest.fn()}
        onSelectStation={onSelectStation}
        onStart={jest.fn()}
        searchQuery="west"
        searchResults={[searchResult]}
        selectedStation={DEFAULT_STATION}
        status="idle"
      />,
    );

    fireEvent.press(getByRole("button", { name: `Station wählen: ${searchResult.name}` }));

    expect(onSelectStation).toHaveBeenCalledWith(searchResult);
  });

  it("shows error text when provided", () => {
    const { getByText } = render(
      <DepartureAnnouncerScreen
        error="API down"
        onSearchQueryChange={jest.fn()}
        onSelectStation={jest.fn()}
        onStart={jest.fn()}
        searchQuery=""
        searchResults={[]}
        selectedStation={DEFAULT_STATION}
        status="error"
      />,
    );

    expect(getByText("Fehler: API down")).toBeTruthy();
  });
});
