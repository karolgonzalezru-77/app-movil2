const BASE_URL = 'https://medicare-backend-a0vq.onrender.com';

export const validarFrecuenciaMedica = async (nombre, frecuencia) => {
    try {
        const response = await fetch(`${BASE_URL}/api/validar-frecuencia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                medicamento: nombre,
                frecuenciaHoras: parseInt(frecuencia)
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        return { ok: false, mensaje: "Error de conexión con el servidor", esSeguro: false };
    }
};