import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers";

export const useDetalleAdministracionMedicamento = () => {
    const registrarAdministracionDosis = async (
        admin_id,
        { origen_inventario, detalle_hora, detalle_observaciones }
    ) => {
        const token = getToken();
    
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            };
        }
    
        try {
            const response = await geriatricoApi.post(
                `/detalleadministracionmedicamento/${admin_id}`,
                {
                    origen_inventario,
                    detalle_hora,
                    detalle_observaciones,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            const { message, detalle, descuento } = response.data;
    
            return {
                success: true,
                message: message || "Administración registrada con éxito",
                detalle: detalle || null,
                descuento: descuento || null,
            };
        } catch (error) {
            console.error("❌ Error al registrar administración:", error);
    
            const errMessage = error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.";
            const errDetail = error.response?.data?.error || null;
    
            return {
                success: false,
                message: errMessage,
                error: errDetail,
            };
        }
    };
    



    const obtenerDetallesDeAdministracionPorFormula = async (admin_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            };
        }

        try {
            const { data } = await geriatricoApi.get(
                `/detalleadministracionmedicamento/formula/${admin_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                success: true,
                message: data.message || "Administraciones obtenidas con éxito",
                data: data.resultado || {},
            };
        } catch (error) {
            console.error("❌ Error al obtener administraciones:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Ocurrió un error inesperado. Inténtalo nuevamente",
            };
        }
    };
    return {
        registrarAdministracionDosis,
        obtenerDetallesDeAdministracionPorFormula
    }
}
