import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useInventarioSede = () => {
    const registrarMedicamentoSede = async ({
        med_nombre,
        med_presentacion,
        unidades_por_presentacion,
        med_descripcion
    }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        try {
            const { data } = await geriatricoApi.post(
                "/inventariomedicamentosede",
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
            );
    
            console.log("✅ Respuesta del servidor:", data);
    
            return {
                success: true,
                message: data.message || "Medicamento registrado exitosamente. Ahora puedes agregar stock.",
                medicamento: data.medicamento || null
            };
        } catch (error) {
            console.error("❌ Error al registrar medicamento a sede:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error interno del servidor.",
            };
        }
    };
    
    const obtenerMedicamentosSede = async () => {
        const token = getToken();

        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const { data } = await geriatricoApi.get("/inventariomedicamentosede", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Medicamentos obtenidos exitosamente.",
                data: data.medicamentos || [], // Ajustado para coincidir con la respuesta del backend
            };
        } catch (error) {
            console.error("❌ Error al obtener medicamentos sede:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
            };
        }
    };

    const agregarStockMedicamento = async (med_sede_id,  med_total_unidades_disponibles) => {
        const token = getToken();

        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const result = await geriatricoApi.put(
                `/inventariomedicamentosede/agregarstock/${med_sede_id}`,
                {  med_total_unidades_disponibles },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("✅ Respuesta del servidor:", result);

            return {
                success: true,
                message: result.data.message || "Stock del medicamento actualizado exitosamente.",
                data: result.data,
            }
        } catch (error) {
            console.error("❌ Error al agregar stock de medicamento:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Error al actualizar el stock del medicamento.",
            };
        }
    };

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
                `/inventariomedicamentosede/${med_sede_id}`,
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
            );

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Medicamento actualizado exitosamente.",
                medicamento: data.medicamento,
            };
        } catch (error) {
            console.error("❌ Error al actualizar medicamento en sede:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
            };
        }
    };



    return {
        registrarMedicamentoSede,
        obtenerMedicamentosSede,
        agregarStockMedicamento,
        actualizarMedicamento
    };
};