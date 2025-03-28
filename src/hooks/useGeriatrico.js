import { useDispatch } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import { saveGeriatricoFailure, saveGeriatricoSuccess, startSavingGeriatrico, clearGeriatricoState  } from "../store/geriatrico";
import { getToken } from "../helpers";

export const useGeriatrico = () => {
    const dispatch = useDispatch();

    const crearGeriatrico = async ({ ge_nombre, ge_nit, ge_color_principal, ge_color_secundario, ge_color_terciario, ge_logo }) => {
        dispatch(startSavingGeriatrico()); // Iniciar la carga

        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "No hay token disponible",
                geriatrico: null
            };
        }

        try {
            if (!ge_logo) {
                throw new Error("El logo del geriátrico es obligatorio.");
            }

            // Crear FormData con la clave correcta esperada por el backend
            const formData = new FormData();
            formData.set("ge_logo", ge_logo);
            formData.set("ge_nombre", ge_nombre);
            formData.set("ge_nit", ge_nit);
            formData.set("ge_color_principal", ge_color_principal);
            formData.set("ge_color_secundario", ge_color_secundario);
            formData.set("ge_color_terciario", ge_color_terciario);

            // Enviar los datos al backend
            const { data } = await geriatricoApi.post("/geriatricos", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            dispatch(saveGeriatricoSuccess(data)); // Guardar en Redux

            return {
                success: true,
                message: data.message || "Geriátrico creado exitosamente",
                geriatrico: data.geriatrico
            };

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Error al crear el geriátrico";
            dispatch(saveGeriatricoFailure(errorMessage)); // Guardar error en Redux

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const obtenerGeriatricos = async () => {
        dispatch(startSavingGeriatrico()); // Indicar que está cargando datos

        const token = getToken();

        if (!token) {
            dispatch(saveGeriatricoFailure("No hay token disponible"));
            return {
                success: false,
                message: "No hay token disponible",
                geriatricos: []
            };
        }

        try {
            const { data } = await geriatricoApi.get('/geriatricos', {
                headers: {
                    Authorization: `Bearer ${token}`, // Agregar token en los headers
                }
            });

            if (data?.geriatricos?.length > 0) {
                dispatch(saveGeriatricoSuccess({
                    message: "Geriátricos obtenidos",
                    geriatrico: data.geriatricos
                }));

                return {
                    success: true,
                    message: data.message || "Geriátricos obtenidos exitosamente",
                    geriatricos: data.geriatricos
                };
            } else {
                console.warn("No se han encontrado geriátricos.");
                return {
                    success: false,
                    message: "No se han encontrado geriátricos.",
                    geriatricos: []
                };
            }
        } catch (error) {
            console.error("Error al obtener los geriátricos:", error);
            dispatch(saveGeriatricoFailure("Error al obtener los geriátricos"));

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener los geriátricos",
                geriatricos: []
            };
        }
    };

    const obtenerGeriatricosActive = async () => {
        dispatch(startSavingGeriatrico()); // Indicar que está cargando datos

        const token = getToken();

        if (!token) {
            dispatch(saveGeriatricoFailure("No hay token disponible"));
            return {
                success: false,
                message: "No hay token disponible",
                geriatricos: []
            };
        }

        try {
            const { data } = await geriatricoApi.get('/geriatricos/activos', {
                headers: {
                    Authorization: `Bearer ${token}`, // Agregar token en los headers
                }
            });
            if (data?.geriatricos?.length > 0) {
                dispatch(saveGeriatricoSuccess({
                    message: "Geriátricos obtenidos",
                    geriatrico: data.geriatricos
                }));

                return {
                    success: true,
                    message: data.message || "Geriátricos obtenidos exitosamente",
                    geriatricos: data.geriatricos
                };
            } else {
                console.warn("No se han encontrado geriátricos.");
                return {
                    success: false,
                    message: "No se han encontrado geriátricos.",
                    geriatricos: []
                };
            }
        } catch (error) {
            console.error("Error al obtener los geriátricos:", error);
            dispatch(saveGeriatricoFailure("Error al obtener los geriátricos"));

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener los geriátricos",
                geriatricos: []
            };
        }
    };

    const obtenerGeriatricosInactivos = async () => {
        dispatch(startSavingGeriatrico()); // Indicar que está cargando datos

        const token = getToken();

        if (!token) {
            dispatch(saveGeriatricoFailure("No hay token disponible"));
            return {
                success: false,
                message: "No hay token disponible",
                geriatricos: []
            };
        }

        try {
            const { data } = await geriatricoApi.get('/geriatricos/inactivos', {
                headers: {
                    Authorization: `Bearer ${token}`, // Agregar token en los headers
                }
            });
            console.log(data);

            if (data?.geriatricosInactivos?.length > 0) {
                dispatch(saveGeriatricoSuccess({
                    message: "Geriátricos obtenidos",
                    geriatrico: data.geriatricos
                }));

                return {
                    success: true,
                    message: data.message || "Geriátricos obtenidos exitosamente",
                    geriatricos: data.geriatricosInactivos
                };
            } else {
                console.warn("No se han encontrado geriátricos.");
                return {
                    success: false,
                    message: "No se han encontrado geriátricos.",
                    geriatricos: []
                };
            }
        } catch (error) {
            console.error("Error al obtener los geriátricos:", error);
            dispatch(saveGeriatricoFailure("Error al obtener los geriátricos"));

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener los geriátricos",
                geriatricos: []
            };
        }
    }

    const actualizarGeriatrico = async (ge_id, datosGeriatrico) => {
        dispatch(startSavingGeriatrico()); // Iniciar la carga
        console.log(ge_id, datosGeriatrico);

        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "No hay token disponible",
                geriatrico: null
            };
        }

        if (!ge_id) {
            return {
                success: false,
                message: "El ID del geriátrico es requerido",
                geriatrico: null
            };
        }

        try {
            const formData = new FormData();

            for (const [key, value] of Object.entries(datosGeriatrico)) {
                if (key === "ge_logo" && typeof value === "string" && value.startsWith("data:image")) {
                    const blob = await fetch(value).then(res => res.blob());
                    formData.append("ge_logo", blob, "logo.jpg");
                } else {
                    formData.append(key, value);
                }
            }

            const { data } = await geriatricoApi.put(`/geriatricos/${ge_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return {
                success: true,
                message: data.message || "Geriátrico actualizado exitosamente",
                geriatrico: data.geriatrico
            };
        } catch (error) {
            console.error("Error en actualizarGeriatrico:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Error al actualizar el geriátrico",
                error: error.response?.data || error.message
            };
        }
    };

    const reactivarGeriatrico = async (ge_id) => {
        dispatch(startSavingGeriatrico()); // Iniciar la carga
        console.log("Intentando reactivar geriátrico con ID:", ge_id);
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "No hay token disponible"
            };
        }

        if (!ge_id) {
            return {
                success: false,
                message: "El ID del geriátrico es requerido",
                geriatrico: null
            };
        }

        try {
            // Realizar la solicitud al backend para reactivar el geriátrico
            const { data } = await geriatricoApi.put(
                `/geriatricos/reactivar/${ge_id}`,
                {}, // El cuerpo vacío porque el backend solo necesita el ID en la URL
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Geriátrico reactivado:", data);

            return {
                success: true,
                message: data.message || "Geriátrico reactivado exitosamente",
                geriatrico: data.geriatrico
            };
        } catch (error) {
            console.error("Error en reactivarGeriatrico:", error.response || error.message);

            return {
                success: false,
                message: error.response?.data?.message || "Error al reactivar el geriátrico",
                error: error.response?.data || error.message
            };
        }
    };

    const inactivarGeriatrico = async (ge_id) => {
        dispatch(startSavingGeriatrico()); // Iniciar la carga
        console.log("Intentando inactivar geriátrico con ID:", ge_id);
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "No hay token disponible"
            };
        }

        if (!ge_id) {
            return {
                success: false,
                message: "El ID del geriátrico es requerido",
                geriatrico: null
            };
        }

        try {
            // Realizar la solicitud al backend para inactivar el geriátrico
            const { data } = await geriatricoApi.put(
                `/geriatricos/inactivar/${ge_id}`,
                {}, // No se necesita un cuerpo, el ID está en la URL
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Respuesta de la API:", data);

            return {
                success: true,
                message: data.message || "Geriátrico inactivado exitosamente",
                geriatrico: data.geriatrico
            };
        } catch (error) {
            console.error("Error en inactivarGeriatrico:", error.response || error.message);

            return {
                success: false,
                message: error.response?.data?.message || "Error al inactivar el geriátrico",
                error: error.response?.data || error.message
            };
        }
    };

    const limpiarEstadoGeriatrico = () => {
        dispatch(clearGeriatricoState());
    };

    const homeMiGeriatrico = async () => {
        dispatch(startSavingGeriatrico()); // Iniciar la carga
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "No hay token disponible",
                geriatrico: null,
                usuario: null,
                rol: null
            };
        }

        try {
            const { data } = await geriatricoApi.get('/geriatricos/homeGeriatrico', {
                headers: {
                    Authorization: `Bearer ${token}`, // Agregar token en los headers
                }
            });

            dispatch(saveGeriatricoSuccess({
                message: "Geriátrico obtenido",
                geriatrico: data.geriatrico,
                usuario: data.usuario,
                rol: data.rol
            }));

            return {
                success: true,
                message: data.message || "Geriátrico obtenido exitosamente",
                geriatrico: data.geriatrico,
                usuario: data.usuario,
                rol: data.rol
            };
        } catch (error) {
            console.error("Error al obtener geriátrico:", error);

            dispatch(saveGeriatricoFailure("Error al obtener geriátrico"));

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener geriátrico",
                geriatrico: null,
                usuario: null,
                rol: null
            };
        }
    };

    const obtenerColoresGeriatrico = async (ge_id) => {
        const token = getToken();
    
        if (!token) {
            return {
                success: false,
                message: "No hay token disponible",
                colores: null
            };
        }
    
        try {
            const { data } = await geriatricoApi.get(`/geriatricos/${ge_id}/colores`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Agregar token en los headers
                }
            });
    
            return {
                success: true,
                colores: data.colores
            };
        } catch (error) {
            console.error('Error al obtener colores:', error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener colores del geriátrico",
                colores: null
            };
        }
    };
    
    return { crearGeriatrico, obtenerGeriatricosActive, obtenerGeriatricos, limpiarEstadoGeriatrico, actualizarGeriatrico, obtenerGeriatricosInactivos, reactivarGeriatrico, inactivarGeriatrico, homeMiGeriatrico, obtenerColoresGeriatrico };
};
