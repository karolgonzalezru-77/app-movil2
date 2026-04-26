import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { HelloWave } from "../components/hello-wave";
import ParallaxScrollView from "../components/parallax-scroll-view";

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: {
      Text: (props: any) => React.createElement("Text", props, props.children),
      ScrollView: (props: any) => React.createElement("ScrollView", props, props.children),
      View: (props: any) => React.createElement("View", props, props.children),
    },
    interpolate: () => 0,
    useAnimatedRef: () => null,
    useAnimatedStyle: () => ({}),
    useScrollOffset: () => ({ value: 0 }),
  };
});

jest.mock("@/hooks/use-theme-color", () => ({
  useThemeColor: () => "#fff",
}));

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

describe("HelloWave", () => {
  it("renderiza el emoji", () => {
    const { getByText } = render(<HelloWave />);
    expect(getByText("👋")).toBeTruthy();
  });
});

describe("ParallaxScrollView", () => {
  it("renderiza header e hijos", () => {
    const { getByText } = render(
      <ParallaxScrollView
        headerImage={<Text>HEADER</Text>}
        headerBackgroundColor={{ light: "#fff", dark: "#000" }}>
        <Text>CONTENIDO</Text>
      </ParallaxScrollView>
    );

    expect(getByText("HEADER")).toBeTruthy();
    expect(getByText("CONTENIDO")).toBeTruthy();
  });
});
