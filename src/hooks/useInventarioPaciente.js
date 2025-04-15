import { getToken } from '../helpers';
import geriatricoApi from '../api/geriatricoApi';

export const useInventarioPaciente = () => {
    const vincularMedicamentoInvPac = async ({ med_id, pac_id, cantidad, med_origen }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const medicamentoId = Number(med_id);
            const pacienteId = Number(pac_id);

            const { data } = await geriatricoApi.post(
                `/inventariomedicamentospaciente/vinculoinicial/${medicamentoId}/${pacienteId}`,
                {
                    cantidad,
                    med_origen,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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
                error: error.response?.data || error.message,
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

    const entradaStockMedicamentoInvPaciente = async ({ med_pac_id, cantidad, med_origen }) => {
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
                `/inventariomedicamentospaciente/entradastock/${medicamentoId}`,
                { cantidad, med_origen },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { inventario, message } = data;

            return {
                success: true,
                message: message || "Stock actualizado correctamente.",
                data: inventario,
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

    const salidaStockMedicamentoInvPaciente = async ({ med_pac_id, cantidad, med_destino }) => {
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
                `/inventariomedicamentospaciente/salidastock/${medicamentoId}`,
                { cantidad, med_destino },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { inventario, message } = data;

            return {
                success: true,
                message: message || "Stock actualizado correctamente.",
                data: inventario,
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
    return {
        vincularMedicamentoInvPac,
        obtenerMedicamentosInvPaciente,
        entradaStockMedicamentoInvPaciente,
        salidaStockMedicamentoInvPaciente
    };
};