import { fireEvent, render } from "@testing-library/react-native";
import { DepartureAnnouncerScreen } from "./DepartureAnnouncerScreen";

describe("DepartureAnnouncerScreen", () => {
  it("calls onStart when idle start button is pressed", () => {
    const onStart = jest.fn();
    const { getByText } = render(
      <DepartureAnnouncerScreen onStart={onStart} status="idle" />,
    );

    fireEvent.press(getByText("Announcer starten"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("disables button while running", () => {
    const onStart = jest.fn();
    const { getByRole } = render(
      <DepartureAnnouncerScreen onStart={onStart} status="running" />,
    );

    const button = getByRole("button");
    fireEvent.press(button);

    expect(onStart).not.toHaveBeenCalled();
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("shows error text when provided", () => {
    const { getByText } = render(
      <DepartureAnnouncerScreen
        error="API down"
        onStart={jest.fn()}
        status="error"
      />,
    );

    expect(getByText("Fehler: API down")).toBeTruthy();
  });
});
