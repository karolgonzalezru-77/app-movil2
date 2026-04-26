import { validarFrecuenciaMedica } from "../src/services/apiService";

describe("validarFrecuenciaMedica", () => {
  const armarResponse = (payload) => ({
    json: jest.fn().mockResolvedValueOnce(payload),
  });

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("devuelve tal cual el payload del backend cuando todo sale bien", async () => {
    const payload = { ok: true, mensaje: "Seguro", esSeguro: true };
    global.fetch.mockResolvedValueOnce(armarResponse(payload));

    const result = await validarFrecuenciaMedica("Losartan", "8");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://medicare-backend-a0vq.onrender.com/api/validar-frecuencia",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(result).toEqual(payload);
  });

  it("convierte frecuencia con cero a la izquierda (08 -> 8)", async () => {
    global.fetch.mockResolvedValueOnce(armarResponse({ ok: true }));

    await validarFrecuenciaMedica("Aspirina", "08");
    const request = global.fetch.mock.calls[0][1];
    const body = JSON.parse(request.body);

    expect(body.frecuenciaHoras).toBe(8);
  });

  it("si el fetch cae, retorna objeto de error controlado", async () => {
    global.fetch.mockRejectedValueOnce(new Error("network down"));

    const result = await validarFrecuenciaMedica("Ibuprofeno", "12");

    expect(result).toEqual({
      ok: false,
      mensaje: "Error de conexión con el servidor",
      esSeguro: false,
    });
    expect(console.error).toHaveBeenCalled();
  });
});
