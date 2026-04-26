const mockInitializeApp = jest.fn(() => ({ name: "app" }));
const mockGetAuth = jest.fn(() => ({ currentUser: null }));
const mockGetFirestore = jest.fn(() => ({ db: true }));

jest.mock("firebase/app", () => ({
  initializeApp: (...args) => mockInitializeApp(...args),
}));

jest.mock("firebase/auth", () => ({
  getAuth: (...args) => mockGetAuth(...args),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: (...args) => mockGetFirestore(...args),
}));

describe("firebase service", () => {
  it("inicializa app y exporta auth/db", () => {
    const module = require("../src/services/firebase");

    expect(mockInitializeApp).toHaveBeenCalledTimes(1);
    expect(mockGetAuth).toHaveBeenCalledWith({ name: "app" });
    expect(mockGetFirestore).toHaveBeenCalledWith({ name: "app" }, "medicare-db");
    expect(module.auth).toEqual({ currentUser: null });
    expect(module.db).toEqual({ db: true });
  });
});
