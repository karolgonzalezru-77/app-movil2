import React from "react";
import { Text } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { Collapsible } from "../components/ui/collapsible";

jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

describe("Collapsible", () => {
  it("inicia cerrado y abre/cierra al presionar", () => {
    const { getByText, queryByText } = render(
      <Collapsible title="Sección">
        <Text>Detalle</Text>
      </Collapsible>
    );

    expect(queryByText("Detalle")).toBeNull();
    fireEvent.press(getByText("Sección"));
    expect(getByText("Detalle")).toBeTruthy();
    fireEvent.press(getByText("Sección"));
    expect(queryByText("Detalle")).toBeNull();
  });
});
