import React from "react";
import { render } from "@testing-library/react-native";
import { HapticTab } from "../components/haptic-tab";

const mockImpactAsync = jest.fn();
let pressableProps: any = null;

jest.mock("expo-haptics", () => ({
  impactAsync: (...args: any[]) => mockImpactAsync(...args),
  ImpactFeedbackStyle: { Light: "light" },
}));

jest.mock("@react-navigation/elements", () => ({
  PlatformPressable: (props: any) => {
    pressableProps = props;
    return null;
  },
}));

describe("HapticTab", () => {
  beforeEach(() => {
    process.env.EXPO_OS = "web";
    pressableProps = null;
    mockImpactAsync.mockReset();
  });

  it("en iOS dispara haptics y callback", () => {
    process.env.EXPO_OS = "ios";
    const onPressIn = jest.fn();
    render(<HapticTab onPressIn={onPressIn} />);
    pressableProps.onPressIn("event");

    expect(mockImpactAsync).toHaveBeenCalled();
    expect(onPressIn).toHaveBeenCalledWith("event");
  });

  it("en web no dispara haptics", () => {
    process.env.EXPO_OS = "web";
    const onPressIn = jest.fn();
    render(<HapticTab onPressIn={onPressIn} />);
    pressableProps.onPressIn("event");
    expect(onPressIn).toHaveBeenCalledWith("event");
  });
});
