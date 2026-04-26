jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: jest.fn(),
}));

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

describe("useThemeColor", () => {
  it("usa color pasado por props para tema activo", () => {
    (useColorScheme as jest.Mock).mockReturnValue("dark");
    const result = useThemeColor({ dark: "#000111" }, "text");
    expect(result).toBe("#000111");
  });

  it("usa color por defecto del tema si no hay prop", () => {
    (useColorScheme as jest.Mock).mockReturnValue("light");
    const result = useThemeColor({}, "text");
    expect(result).toBe(Colors.light.text);
  });

  it("edge case: tema null cae a light", () => {
    (useColorScheme as jest.Mock).mockReturnValue(null);
    const result = useThemeColor({}, "background");
    expect(result).toBe(Colors.light.background);
  });
});
