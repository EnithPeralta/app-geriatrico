import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useMovimientosStockSede = () => {
    const historialMovimientosMedicamento = async (med_sede_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            };
        }
        try {
            const { data } = await geriatricoApi.get(`/movimientosstocksede/${med_sede_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('✅ Respuesta del servidor:', data);

            return {
                success: true,
                data: data || [],
                message:data.message,
                entrada:data.entradas,
                salida:data.salidas
            };

        } catch (error) {
            console.error('❌ Error al obtener movimientos:', error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado",
            };
        }
    };

    return {
        historialMovimientosMedicamento
    };
};
