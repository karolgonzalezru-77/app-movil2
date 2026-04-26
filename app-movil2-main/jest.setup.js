import "@testing-library/jest-native/extend-expect";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  scheduleNotificationAsync: jest.fn(async () => "mock-notification-id"),
  AndroidNotificationPriority: {
    HIGH: "high",
  },
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: () => null,
}));
