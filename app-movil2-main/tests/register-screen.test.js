import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../screens/RegisterScreen";

const mockCreateUserWithEmailAndPassword = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUserWithEmailAndPassword(...args),
  updateProfile: (...args) => mockUpdateProfile(...args),
}));

jest.mock("../src/services/firebase", () => ({
  auth: {},
}));

describe("RegisterScreen", () => {
  const navigation = { navigate: jest.fn() };
  const renderRegister = () => render(<RegisterScreen navigation={navigation} />);
  const llenarDatosBase = (screen) => {
    fireEvent.changeText(screen.getByPlaceholderText("Ej: María González"), "Ana");
    fireEvent.changeText(screen.getByPlaceholderText("ejemplo@correo.com"), "ana@mail.com");
    fireEvent.changeText(screen.getByPlaceholderText("Mínimo 6 caracteres"), "123456");
  };

  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    navigation.navigate.mockReset();
    mockCreateUserWithEmailAndPassword.mockReset();
    mockUpdateProfile.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("si intento crear cuenta vacío, bloquea el envío", () => {
    const { getByText } = renderRegister();
    fireEvent.press(getByText("Crear Cuenta"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Todos los campos son obligatorios");
  });

  it("cuando todo sale bien, registra y devuelve al login", async () => {
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: "1" } });
    mockUpdateProfile.mockResolvedValueOnce();
    const screen = renderRegister();
    llenarDatosBase(screen);
    const { getByText } = screen;
    fireEvent.press(getByText("Crear Cuenta"));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
      expect(navigation.navigate).toHaveBeenCalledWith("Login");
    });
  });

  it("si el correo ya existe, muestra feedback claro", async () => {
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce({
      code: "auth/email-already-in-use",
    });
    const screen = renderRegister();
    llenarDatosBase(screen);
    const { getByText } = screen;
    fireEvent.press(getByText("Crear Cuenta"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith("Error", "El correo ya está registrado")
    );
  });
});
