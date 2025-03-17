import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers";

export const useCuidadosEnfermeria = () => {

    const registrarCuidadosEnfermeria = async (pac_id, datosCuidados) => {
        console.log("📌 Datos a enviar:", pac_id, datosCuidados);
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        const pacienteId = Number(pac_id); // Asegurar que es un número

        try {
            const { data } = await geriatricoApi.post(
                `/cuidadosenfermeria/paciente/${pacienteId}`,
                datosCuidados,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Operación realizada con éxito.",
                data: data.datos || []
            };
        } catch (error) {
            console.error("❌ Error al registrar/actualizar cuidados de enfermería:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
                data: []
            };
        }
    };

    const obtenerCuidadosEnfermeria = async (pac_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        const pacienteId = Number(pac_id);
       
        try {
            const response = await geriatricoApi.get(`/cuidadosenfermeria/paciente/${pacienteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            const { data } = response;
            console.log("✅ Respuesta del servidor:", data);
    
            if (!data || !data.datos) {
                console.warn("⚠️ No se encontraron datos en la respuesta del servidor.");
                return {
                    success: false,
                    message: data?.message || "No hay datos disponibles.",
                    data: []
                };
            }
    
            return {
                success: true,
                message: data.message || "Operación realizada con éxito.",
                data: data.datos
            };
        } catch (error) {
            console.error("❌ Error al obtener cuidados de enfermería:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
                data: []
            };
        }
    };
    

    return {
        registrarCuidadosEnfermeria,
        obtenerCuidadosEnfermeria
    };
};
