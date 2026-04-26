import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";

const mockSignInWithEmailAndPassword = jest.fn();

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
}));

jest.mock("../src/services/firebase", () => ({
  auth: { currentUser: null },
}));

describe("LoginScreen", () => {
  const navigation = { navigate: jest.fn() };
  const renderLogin = () => render(<LoginScreen navigation={navigation} />);

  const completarFormulario = ({ correo, password }) => {
    const screen = renderLogin();
    fireEvent.changeText(screen.getByPlaceholderText("ejemplo@correo.com"), correo);
    fireEvent.changeText(screen.getByPlaceholderText("********"), password);
    return screen;
  };

  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    navigation.navigate.mockReset();
    mockSignInWithEmailAndPassword.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("si toco Ingresar vacío, me avisa que faltan datos", async () => {
    const { getByText } = renderLogin();
    fireEvent.press(getByText("Ingresar"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Completa todos los campos");
  });

  it("con credenciales válidas, entra y manda a Home", async () => {
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: "1" } });
    const { getByText } = completarFormulario({ correo: "a@a.com", password: "secret123" });
    fireEvent.press(getByText("Ingresar"));

    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith("Home"));
  });

  it("si la clave está mal, muestra el mensaje de firebase", async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce({ code: "auth/wrong-password" });
    const { getByText } = completarFormulario({ correo: "a@a.com", password: "badpass" });
    fireEvent.press(getByText("Ingresar"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Contraseña incorrecta")
    );
  });
});
