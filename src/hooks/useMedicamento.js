import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers"

export const useMedicamento = () => {
    const registrarMedicamento = async ({ med_nombre, med_presentacion, unidades_por_presentacion, med_descripcion }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        try {
            const { data } = await geriatricoApi.post(
                "/medicamentos/registrar",
                {
                    med_nombre,
                    med_presentacion,
                    unidades_por_presentacion,
                    med_descripcion: med_descripcion || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            console.log("�� Respuesta del servidor:", data)
            return {
                success: true,
                message: data.message || "Medicamento registrado correctamente.",
                data
            }
        } catch (error) {
            console.error("❌ Error al registrar medicamento:", error)
            return {
                success: false,
                message: error.response.data.message || "Error al registrar medicamento.",
            }
        }
    }

    const obtenerMedicamentos = async () => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        try {
            const { data } = await geriatricoApi.get(
                "/medicamentos",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            console.log("�� Respuesta del servidor:", data)
            return {
                success: true,
                message: data.message || "Medicamentos obtenidos correctamente.",
                data:data.medicamentos
            }
        } catch (error) {
            console.error("❌ Error al obtener medicamentos:", error)
            return {
                success: false,
                message: error.response.data.message || "Error al obtener medicamentos.",
            }
        }
    }

    const actualizarMedicamento = async (med_sede_id, { med_nombre, med_presentacion, unidades_por_presentacion, med_descripcion }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        try {
            const { data } = await geriatricoApi.put(
                `/medicamentos/actualizar/${med_sede_id}`,
                {
                    med_nombre,
                    med_presentacion,
                    unidades_por_presentacion,
                    med_descripcion
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            console.log("�� Respuesta del servidor:", data)
            return {
                success: true,
                message: data.message || "Medicamento actualizado correctamente.",
                data: data.medicamentoActualizado
            }
        } catch (error) {
            console.error("❌ Error al actualizar medicamento:", error)
            return {
                success: false,
                message: error.response.data.message || "Error al actualizar medicamento.",
            }
        }
    }

    return {
        registrarMedicamento,
        obtenerMedicamentos,
        actualizarMedicamento
    }
}
