import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { ExternalLink } from "../components/external-link";

const mockOpenBrowserAsync = jest.fn();
let capturedProps: any = null;

jest.mock("expo-web-browser", () => ({
  openBrowserAsync: (...args: any[]) => mockOpenBrowserAsync(...args),
  WebBrowserPresentationStyle: { AUTOMATIC: "automatic" },
}));

jest.mock("expo-router", () => ({
  Link: (props: any) => {
    capturedProps = props;
    return null;
  },
}), { virtual: true });

describe("ExternalLink", () => {
  beforeEach(() => {
    capturedProps = null;
    mockOpenBrowserAsync.mockReset();
  });

  it("en nativo previene default y abre navegador interno", async () => {
    process.env.EXPO_OS = "ios";
    render(<ExternalLink href="https://example.com">Go</ExternalLink>);

    const preventDefault = jest.fn();
    await capturedProps.onPress({ preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(mockOpenBrowserAsync).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({ presentationStyle: "automatic" })
    );
  });
});
