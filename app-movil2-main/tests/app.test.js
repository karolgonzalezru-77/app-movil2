import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("@react-navigation/native", () => ({
  NavigationContainer: ({ children }) => children,
}));

jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));

jest.mock("../screens/LoginScreen", () => () => null);
jest.mock("../screens/RegisterScreen", () => () => null);
jest.mock("../screens/HomeScreen", () => () => null);

import App from "../App";

describe("App", () => {
  it("renderiza contenedor de navegación sin romper", () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
