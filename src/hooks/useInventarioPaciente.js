import { getToken } from '../helpers';
import geriatricoApi from '../api/geriatricoApi';

export const useInventarioPaciente = () => {
    const registrarMedicamentoPaciente = async ({
        pac_id,
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
            const pacienteId = Number(pac_id);

            const { data } = await geriatricoApi.post(
                `/inventariomedicamentospaciente/registrar/${pacienteId}`,
                {
                    med_nombre,
                    med_presentacion,
                    unidades_por_presentacion,
                    med_descripcion,
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
                message: data.message || "Medicamento registrado correctamente.",
                data,
            };
        } catch (error) {
            console.error("❌ Error al registrar medicamento:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    };

    const obtenerMedicamentosInvPaciente = async (pac_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        try {
            const pacienteId = Number(pac_id);
            const { data } = await geriatricoApi.get(
                `/inventariomedicamentospaciente/${pacienteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("✅ Respuesta del servidor:", data);
            return {
                success: true,
                message: data.message || "Medicamentos obtenidos correctamente.",
                data: data.medicamentos,
            };
        } catch (error) {
            console.error("❌ Error al obtener medicamentos:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    }

    const agregarStockMedicamentoPac = async ({ med_pac_id, med_cantidad }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        try {
            const medicamentoId = Number(med_pac_id);
            const { data } = await geriatricoApi.put(
                `/inventariomedicamentospaciente/agregarstock/${medicamentoId}`,
                { med_cantidad },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Stock actualizado correctamente.",
                data,
            };

        } catch (error) {
            console.error("❌ Error al actualizar stock:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    }

    const actualizarMedicamentoPac = async (med_pac_id, { med_nombre, med_presentacion, unidades_por_presentacion, med_descripcion }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        try {
            const medicamentoId = Number(med_pac_id);
            const { data } = await geriatricoApi.put(
                `/inventariomedicamentospaciente/${medicamentoId}`,
                { med_nombre, med_presentacion, unidades_por_presentacion, med_descripcion },
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
                data,
            };
        } catch (error) {
            console.error("❌ Error al actualizar medicamento:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrio un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    }
    return {
        registrarMedicamentoPaciente,
        obtenerMedicamentosInvPaciente,
        agregarStockMedicamentoPac,
        actualizarMedicamentoPac
    };
};