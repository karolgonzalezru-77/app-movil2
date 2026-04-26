import React from "react";
import { render } from "@testing-library/react-native";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

jest.mock("@/hooks/use-theme-color", () => ({
  useThemeColor: jest.fn(() => "#123456"),
}));

describe("ThemedText", () => {
  it("renderiza con estilo default por defecto", () => {
    const { getByText } = render(<ThemedText>Hola</ThemedText>);
    expect(getByText("Hola")).toBeTruthy();
  });

  it("aplica tipo link como caso alterno", () => {
    const { getByText } = render(<ThemedText type="link">Abrir</ThemedText>);
    expect(getByText("Abrir")).toBeTruthy();
  });
});

describe("ThemedView", () => {
  it("renderiza hijos y color de fondo", () => {
    const { getByText } = render(
      <ThemedView>
        <ThemedText>Contenido</ThemedText>
      </ThemedView>
    );
    expect(getByText("Contenido")).toBeTruthy();
  });
});
