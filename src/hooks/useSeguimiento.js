import { getToken } from "../helpers";
import geriatricoApi from "../api/geriatricoApi";
import { formatFecha } from "../utils";

export const useSeguimiento = () => {
    const limpiarDatosSeguimiento = (datos) => {
        const datosLimpios = {};

        Object.keys(datos).forEach((key) => {
            const valor = datos[key];

            if (
                valor !== null &&
                valor !== "" &&
                valor !== undefined &&
                valor !== "undefined"
            ) {
                datosLimpios[key] = valor;
            }
        });

        return datosLimpios;
    };


    const registrarSeguimientoPaciente = async ({ pac_id, seg_fecha, seg_pa, seg_talla, seg_fr, seg_peso, seg_temp, seg_fc, seg_glicemia, seg_foto, otro }) => {
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        // Limpiar los datos
        const datosLimpios = limpiarDatosSeguimiento({
            seg_fecha,
            seg_pa,
            seg_talla,
            seg_fr,
            seg_peso,
            seg_temp,
            seg_fc,
            seg_glicemia,
            otro,
        });

        try {
            const formData = new FormData();
            formData.append("pac_id", Number(pac_id));

            // Asegurar fecha con formato si está presente
            if (datosLimpios.seg_fecha) {
                formData.append("seg_fecha", formatFecha(datosLimpios.seg_fecha));
            }

            // Agregar solo los datos que existen en datosLimpios
            Object.entries(datosLimpios).forEach(([key, value]) => {
                if (key !== "seg_fecha") { // ya lo agregamos arriba con formato
                    formData.append(key, value);
                }
            });

            // Manejo de la foto (si está presente)
            if (seg_foto) {
                if (typeof seg_foto === "string" && seg_foto.startsWith("data:image")) {
                    const blob = await fetch(seg_foto).then(res => res.blob());
                    formData.append("seg_foto", blob, "seguimiento.jpg");
                } else {
                    formData.append("seg_foto", seg_foto);
                }
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
                error: error.response?.data?.error || error.message,
            };
        }
    };

    // const registrarSeguimientoPaciente = async (pac_id, datoSeguimientos) => {
    //     console.log("📌 Datos a enviar:", { pac_id, ...datoSeguimientos });

    //     const token = getToken();
    //     if (!token) {
    //         return { success: false, message: "Token de autenticación no encontrado." };
    //     }

    //     try {
    //         const formData = new FormData();
    //         formData.append("pac_id", Number(pac_id));
    //         formData.append("seg_fecha", formatFecha());

    //         if (datoSeguimientos && typeof datoSeguimientos === "object") {
    //             Object.keys(datoSeguimientos).forEach(key => {
    //                 const value = datoSeguimientos[key];
    //                 if (value !== undefined && value !== null) {
    //                     if (key === "seg_foto" && value instanceof File) {
    //                         formData.append(key, value);
    //                     } else if (key !== "seg_foto") {
    //                         formData.append(key, value);
    //                     }
    //                 }
    //             });
    //         }

    //         const response = await geriatricoApi.post(`/seguimientos/paciente/${pac_id}`, formData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         });

    //         console.log("✅ Respuesta del servidor:", response.data);

    //         return {
    //             success: true,
    //             message: response.data.message || "Seguimiento registrado con éxito.",
    //             data: response.data.datos || {},
    //         };
    //     } catch (error) {
    //         console.error("❌ Error al registrar seguimiento:", error);
    //         return {
    //             success: false,
    //             message: error.response?.data?.message || "Ocurrió un error inesperado.",
    //             error: error.response?.data || error.message,
    //         };
    //     }
    // };
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
                paciente: response.data.paciente
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

    const obtenerSeguimientosPorId = async (seg_id) => {
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
            // Convertir `datoSeguimiento` en FormData
            const formData = new FormData();
            Object.keys(datoSeguimiento).forEach((key) => {
                if (key === "seg_foto" && datoSeguimiento.seg_foto instanceof File) {
                    formData.append("seg_foto", datoSeguimiento.seg_foto); // Adjunta la imagen
                } else {
                    formData.append(key, datoSeguimiento[key]);
                }
            });

            const response = await geriatricoApi.put(`/seguimientos/actualizar/${segIdNum}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // Indicar que se envían archivos
                },
            });

            console.log("✅ Respuesta del servidor:", response.data);

            return {
                success: true,
                message: response.data.message || "Seguimiento actualizado con éxito.",
                data: response.data ?? {},
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
