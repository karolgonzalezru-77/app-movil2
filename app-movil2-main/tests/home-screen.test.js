import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import HomeScreen from "../screens/HomeScreen";
import * as Notifications from "expo-notifications";

const mockValidarFrecuenciaMedica = jest.fn();
const mockAddDoc = jest.fn(() => Promise.resolve({ id: "remote-id" }));
const mockCollection = jest.fn(() => "collection-ref");
const mockDeleteDoc = jest.fn(() => Promise.resolve());
const mockDoc = jest.fn(() => "doc-ref");
const mockGetDocs = jest.fn();

jest.mock("../src/services/apiService", () => ({
  validarFrecuenciaMedica: (...args) => mockValidarFrecuenciaMedica(...args),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: (...args) => mockAddDoc(...args),
  collection: (...args) => mockCollection(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  doc: (...args) => mockDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
}));

jest.mock("../src/services/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: { id: "db" },
}));

describe("HomeScreen", () => {
  const navigation = { replace: jest.fn() };
  const renderHome = () => render(<HomeScreen navigation={navigation} />);
  const llenarFormulario = (screen, { nombre, hora, frecuencia }) => {
    fireEvent.changeText(screen.getByPlaceholderText("Medicamento (ej. Losartán)"), nombre);
    fireEvent.changeText(screen.getByPlaceholderText("Hora (ej. 08:30)"), hora);
    fireEvent.changeText(
      screen.getByPlaceholderText("Frecuencia horas (ej. 8)"),
      frecuencia
    );
  };

  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockAddDoc.mockClear();
    mockGetDocs.mockResolvedValue({
      forEach: (cb) => cb({ id: "m1", data: () => ({ nombre: "A", hora: "08:00", frecuencia: "8" }) }),
    });
    mockValidarFrecuenciaMedica.mockResolvedValue({
      esSeguro: true,
      mensaje: "Seguro",
    });
    Notifications.scheduleNotificationAsync.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("si dejo campos vacíos, no deja guardar", async () => {
    const { getByText } = renderHome();
    fireEvent.press(getByText("Validar y Agregar"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Llena todos los campos (Nombre, Hora y Frecuencia)"
    );
  });

  it("si la validación médica responde seguro, guarda y agenda alerta", async () => {
    const screen = renderHome();
    llenarFormulario(screen, { nombre: "Losartan", hora: "23:59", frecuencia: "8" });
    const { getByText } = screen;
    fireEvent.press(getByText("Validar y Agregar"));

    await waitFor(() => {
      expect(mockValidarFrecuenciaMedica).toHaveBeenCalledWith("Losartan", "8");
      expect(mockAddDoc).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  it("si la IA médica no recomienda, no persiste en firestore", async () => {
    mockValidarFrecuenciaMedica.mockResolvedValueOnce({
      esSeguro: false,
      mensaje: "No recomendado",
    });
    const screen = renderHome();
    llenarFormulario(screen, { nombre: "X", hora: "09:00", frecuencia: "4" });
    const { getByText } = screen;
    fireEvent.press(getByText("Validar y Agregar"));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith("Recomendación Médica", "No recomendado"));
    expect(mockAddDoc).not.toHaveBeenCalled();
  });
});
