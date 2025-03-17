import { getToken } from "../helpers";
import geriatricoApi from "../api/geriatricoApi";
import { formatFecha } from "../utils/FechaUtils";

export const useSeguimiento = () => {
    
    const registrarSeguimientoPaciente = async (pac_id, datoSeguimientos = {}) => {
        console.log("📌 Datos a enviar:", { pac_id, ...datoSeguimientos });
    
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }
    
        try {
            const formData = new FormData();
            formData.append("pac_id", Number(pac_id));
            formData.append("seg_fecha", formatFecha());

    
            if (datoSeguimientos && typeof datoSeguimientos === "object") {
                Object.keys(datoSeguimientos).forEach(key => {
                    const value = datoSeguimientos[key];
                    if (value !== undefined && value !== null) {
                        if (key === "seg_foto" && value instanceof File) {
                            formData.append(key, value);
                        } else if (key !== "seg_foto") {
                            formData.append(key, value);
                        }
                    }
                });
            }
    
            const response = await geriatricoApi.post(`/seguimientos/paciente/${pac_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            console.log("✅ Respuesta del servidor:", response.data);
    
            return {
                success: true,
                message: response.data.message || "Seguimiento registrado con éxito.",
                data: response.data.datos || {},
            };
        } catch (error) {
            console.error("❌ Error al registrar seguimiento:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message,
            };
        }
    };
    
    const obtenerHistorialSeguimientos = async (pac_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        const pacIdNum = Number(pac_id);
       
    
        try {
            const response = await geriatricoApi.get(`/seguimientos/historialpaciente/${pacIdNum}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", response.data);
            return {
                success: true,
                message: response.data.message || "Historial de seguimientos obtenido exitosamente.",
                data: response.data.historial_seguimientos || [],
                paciente:response.data.paciente
            };
            
        } catch (error) {
            console.error("❌ Error al obtener historial de seguimientos:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message,
            };
        }
    };
    
    const obtenerSeguimientosPorId = async(seg_id) =>{
        console.log("📌 Datos a enviar:", { seg_id });
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
       
    
        try {
            const response = await geriatricoApi.get(`/seguimientos/${seg_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", response.data);
            return {
                success: true,
                message: response.data.message || "Historial de seguimientos obtenido exitosamente.",
                data: response.data,
            };
            
        } catch (error) {
            console.error("❌ Error al obtener historial de seguimientos:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message,
            };
        }
    }

    const actualizarSeguimientoPaciente = async (seg_id, datoSeguimiento) => {
        const token = getToken();
        
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }
    
        const segIdNum = Number(seg_id);
        if (isNaN(segIdNum) || segIdNum <= 0) {
            return { success: false, message: "ID del seguimiento no válido." };
        }
    
        try {
            const response = await geriatricoApi.put(`/seguimientos/actualizar/${segIdNum}`, datoSeguimiento, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", response.data);
            
            return {
                success: true,
                message: response.data.message || "Seguimiento actualizado con éxito.",
                data: response.datos ?? {},
            };
    
        } catch (error) {
            console.error("❌ Error al actualizar seguimiento:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message,
            };
        }
    };
    

    return {
        registrarSeguimientoPaciente,
        obtenerHistorialSeguimientos,
        obtenerSeguimientosPorId,
        actualizarSeguimientoPaciente
    };
};
