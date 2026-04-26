import React from "react";
import { render } from "@testing-library/react-native";
import { IconSymbol } from "../components/ui/icon-symbol.ios";

const mockSymbolView = jest.fn(() => null);
jest.mock("expo-symbols", () => ({
  SymbolView: (props: any) => mockSymbolView(props),
}));

describe("IconSymbol iOS", () => {
  it("renderiza SymbolView con dimensiones según size", () => {
    render(<IconSymbol name="house.fill" color="#fff" size={30} />);
    expect(mockSymbolView).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "house.fill",
        tintColor: "#fff",
      })
    );
  });
});
