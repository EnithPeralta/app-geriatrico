import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const usePaciente = () => {
    const registrarPaciente = async (datosPaciente) => {
        console.log("📤 Enviando datos para registrar/actualizar paciente:", datosPaciente);
    
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Error: Token de autenticación no encontrado.",
            };
        }
    
        try {
            const { data } = await geriatricoApi.post(
                "/pacientes/registrar",
                datosPaciente,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            console.log("✅ Respuesta del servidor:", data);
    
            return {
                success: true,
                message: data.message || "Paciente registrado o actualizado con éxito.",
                data, 
            };
        } catch (error) {
            console.error("❌ Error al registrar/actualizar paciente:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message,
            };
        }
    };
    

    const obtenerPacientesSede = async () => {
        const token = getToken();
        
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
                data: null
            };
        }

        try {
            const { data } = await geriatricoApi.get("pacientes/sede", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Pacientes obtenidos exitosamente",
                data: data.data || []
            };

        } catch (error) {
            console.error("❌ Error al obtener pacientes:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener pacientes",
                data: []
            };
        }
    };

    const obtenerRolesPacientesSede = async ( per_id ) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
                data: null
            };
        }

        try {
            const { data } = await geriatricoApi.get(`pacientes/roles/${per_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Pacientes obtenidos exitosamente",
                data: data.roles || [] // Acceder a data dentro de la respuesta
            };


        } catch (error) {
            console.error("❌ Error al obtener los pacientes:", error);

            let errorMessage = "Error al obtener los pacientes";
            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                errorMessage = "No se recibió respuesta del servidor";
            }

            return {
                success: false,
                message: errorMessage,
                data: []
            };
        }
    };

    const obtenerDetallePacienteSede = async (per_id) => {
        console.log("📤 Enviando ID del paciente:", per_id);
        if (!per_id) {
            return {
                success: false,
                message: "ID del paciente no proporcionado",
                paciente: null
            };
        }

        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
                paciente: null
            };
        }

        try {
            const { data } = await geriatricoApi.get(`pacientes/sede/${per_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            if (!data?.paciente) {
                return {
                    success: false,
                    message: data.message || "Paciente no encontrado en el geriátrico al que perteneces.",
                    paciente: null
                };
            }

            return {
                success: true,
                message: data.message || "Paciente obtenido exitosamente",
                paciente: data.paciente
            };

        } catch (error) {
            console.error("❌ Error al obtener el paciente:", error);
            console.error(error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener el paciente",
                paciente: null
            };
        }
    };

    const actualizarDetallePaciente = async (per_id, datosPaciente) => {
        console.log("📤 Enviando datos para actualizar paciente:", datosPaciente);
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "❌ Token de autenticación no encontrado",
                paciente: null
            };
        }

        try {
            const formData = new FormData();
            Object.keys(datosPaciente).forEach((key) => {
                if (key === "foto" && datosPaciente.foto instanceof File) {
                    formData.append("foto", datosPaciente.foto); // Adjunta la imagen
                } else {
                    formData.append(key, datosPaciente[key]);
                }
            });
            const { data } = await geriatricoApi.put(`pacientes/${per_id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            if (!data?.paciente) {
                return {
                    success: false,
                    message: "⚠️ Paciente no encontrado en el geriátrico al que perteneces.",
                    paciente: null
                };
            }

            return {
                success: true,
                message: data.message,
                paciente: data.paciente
            };

        } catch (error) {
            console.error(error.response?.data || error.message);

            return {
                success: false,
                message: error.response?.data?.message,
                paciente: null
            };
        }
    };


    return {
        actualizarDetallePaciente,
        registrarPaciente,
        obtenerRolesPacientesSede,
        obtenerDetallePacienteSede,
        obtenerPacientesSede
    };
};
