import { useDispatch, useSelector } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import { setError, setLoading, setPerson } from "../store/geriatrico";
import { getToken } from "../helpers";

export const usePersona = () => {
    const dispatch = useDispatch();

    const getAuthenticatedPersona = async () => {
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            const errorMsg = "Token de autenticación no encontrado";
            dispatch(setError(errorMsg));
            return { success: false, message: errorMsg, persona: null };
        }

        try {
            const { data } = await geriatricoApi.get("personas/perfil", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (!data?.persona) {
                const errorMsg = "No se encontró la persona autenticada";
                dispatch(setError(errorMsg));
                return { success: false, message: errorMsg, persona: null };
            }

            dispatch(setPerson(data.persona));
            return { success: true, message: "Persona obtenida con éxito", persona: data.persona };

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al obtener los datos de la persona";
            dispatch(setError(errorMessage));
            return { success: false, message: errorMessage, persona: null };

        } finally {
            dispatch(setLoading(false));
        }
    };

    const updatePerfil = async (data) => {
        console.log(data);
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            dispatch(setError("Token de autenticación no encontrado"));
            return { success: false, message: "Token de autenticación no encontrado", persona: null };
        }

        try {
            // Mapeo para transformar las claves del modal a las que espera el backend
            const mapping = {
                usuario: "per_usuario",
                correo: "per_correo",
                telefono: "per_telefono",
                foto: "per_foto",
                // Si existe el campo nombre en algún caso, también se puede mapear:
                nombre: "per_nombre"
            };

            // Transformar el objeto recibido usando el mapping
            const datosMapeados = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [mapping[key] || key, value])
            );

            // Filtrar solo los campos permitidos
            const camposPermitidos = ["per_correo", "per_telefono", "per_usuario", "per_nombre", "per_foto"];
            const datosFiltrados = Object.fromEntries(
                Object.entries(datosMapeados).filter(([key]) => camposPermitidos.includes(key))
            );

            const formData = new FormData();
            for (const [key, value] of Object.entries(datosFiltrados)) {
                if (key === "per_foto" && typeof value === "string" && value.startsWith("data:image")) {
                    const blob = await fetch(value).then((res) => res.blob());
                    formData.append("per_foto", blob, "perfil.jpg");
                } else {
                    formData.append(key, value);
                }
            }

            const response = await geriatricoApi.put("personas/updateperfil", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            return { success: true, message: "Perfil actualizado con éxito", persona: response.data.persona };

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al actualizar el perfil";
            dispatch(setError(errorMessage));
            return { success: false, message: errorMessage, persona: null };
        } finally {
            dispatch(setLoading(false));
        }
    };


    const obtenerPersonasRegistradas = async () => {
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            dispatch(setError("Token de autenticación no encontrado"));
            return { success: false, message: "Token de autenticación no encontrado", personas: null };
        }

        try {
            const { data } = await geriatricoApi.get("/personas", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!data?.personas || data.personas.length === 0) {
                return { success: false, message: "No se han encontrado personas registradas", personas: [] };
            }

            return { success: true, message: "Personas obtenidas con éxito", personas: data.personas };

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al obtener las personas";
            dispatch(setError(errorMessage));
            return { success: false, message: errorMessage, personas: null };

        } finally {
            dispatch(setLoading(false));
        }
    };

    // Funcion para buscar si una persona ya esta vinculada a un geriatrico
    const buscarVincularPersona = async ({ documento }) => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.get(
                `/personas/buscar/${documento}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(data);
            if (!data) {
                return {
                    success: false,
                    message: "Persona no encontrada. ¿Desea registrarla?",
                    action: "register",
                };
            }

            const { per_id, per_nombre_completo, per_documento, geriatricos } = data;

            return {
                success: true,
                message: "Persona encontrada. ¿Desea asignarle un rol?",
                action: "assign_role",
                per_id,
                per_nombre: per_nombre_completo,
                per_documento,
                geriatricos, // Lista de geriátricos a los que ya pertenece
            };
        } catch (error) {
            console.error("❌ Error al buscar la persona:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al buscar la persona.",
                action: "error",
            };
        }
    };

    const obtenerPersonaRoles = async ({ per_id }) => {
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            dispatch(setError("Token de autenticación no encontrado"));
            return {
                success: false,
                message: "Token de autenticación no encontrado",
                persona: null
            };
        }

        try {
            const { data } = await geriatricoApi.get(`/personas/roles/${per_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(data);

            if (!data?.persona) {
                return {
                    success: false,
                    message: "No se han encontrado datos para esta persona",
                    persona: null,
                };
            }

            return {
                success: true,
                message: "Datos obtenidos con éxito",
                persona: data.persona,
            };
        } catch (error) {
            console.error("Error al obtener los roles de la persona:", error);
            const errorMessage = error.response?.data?.message || "Error al obtener los datos de la persona";
            dispatch(setError(errorMessage));
            return {
                success: false,
                message: errorMessage,
                persona: null,
            };
        }
    };

    const updatePerson = async (per_id, data) => {
        console.log("Datos enviados:", data);

        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado" };
        }

        try {
            // Mapeo de claves para que coincidan con los nombres esperados en el backend
            const mapping = {
                nombre: "per_nombre_completo",
                documento: "per_documento",
                telefono: "per_telefono",
                correo: "per_correo",
                genero: "per_genero",
                foto: "per_foto"
            };

            // Transformar las claves del objeto de entrada
            const datosMapeados = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [mapping[key] || key, value])
            );

            // Construcción de FormData
            const formData = new FormData();
            for (const [key, value] of Object.entries(datosMapeados)) {
                if (key === "per_foto") {
                    if (value instanceof File) {
                        formData.append("per_foto", value, value.name);
                    } else if (typeof value === "string" && value.startsWith("data:image")) {
                        try {
                            const blob = await fetch(value).then((res) => res.blob());
                            formData.append("per_foto", blob, "perfil.jpg");
                        } catch (error) {
                            console.error("Error al procesar la imagen:", error);
                            return { success: false, message: "Error al procesar la imagen" };
                        }
                    }
                } else {
                    formData.append(key, value);
                }
            }

            // Enviar la solicitud al backend
            const response = await geriatricoApi.put(`/personas/${per_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("Respuesta completa del servidor:", response.data);

            if (response.data?.persona) {
                console.log("Persona actualizada con éxito", response.data);
                return { success: true, message: response.data.message, persona: response.data.persona };
            } else {
                console.warn("No se encontró el objeto 'persona' en la respuesta:", response.data);
                return { success: false, message: response.data.message || "Error desconocido en la actualización" };
            }
        } catch (error) {
            console.error("Error en la actualización:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Error al actualizar la persona" };
        }
    };

    return {
        getAuthenticatedPersona,
        updatePerfil,
        obtenerPersonasRegistradas,
        buscarVincularPersona,
        obtenerPersonaRoles,
        updatePerson
    };
};
