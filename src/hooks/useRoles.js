import { useDispatch } from "react-redux";
import { store } from "../store/store";
import { setSedeError, setRolSeleccionado, startSeleccion } from "../store/geriatrico";
import { getToken } from "../helpers";
import geriatricoApi from "../api/geriatricoApi";

export const useRoles = () => {
    const dispatch = useDispatch();

    const crearRol = async ({ rol_nombre, rol_descripcion }) => {
        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            console.error(errorMessage);
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, rol: null };
        }
        try {
            const { data } = await geriatricoApi.post('/roles',
                { rol_nombre, rol_descripcion }
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (data && data.rol) {
                return {
                    success: true,
                    message: data.message || 'Rol creado exitosamente',
                    rol: data.rol
                };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al crear el rol:', error);

            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear el rol'
            };
        }
    };

    const obtenerRoles = async () => {
        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, rol: null };
        }
        try {
            const { data } = await geriatricoApi.get('/roles',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (data && data.roles) {
                return {
                    success: true,
                    message: data.message || 'Roles obtenidos exitosamente',
                    roles: data.roles
                };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al obtener los roles:', error);

            return {
                success: false,
                message: error.response?.data?.message || 'Error al obtener los roles'
            };
        }
    };

    const actualizarRol = async ({ rol_id, rol_nombre, rol_descripcion }) => {
        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, rol: null };
        }
        try {
            // Hacer la solicitud PUT con los datos a actualizar
            const { data } = await geriatricoApi.put(`/roles/${rol_id}`, { rol_nombre, rol_descripcion },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            // Validar la respuesta
            if (data?.rol) {
                return {
                    success: true,
                    message: data.message || 'Rol actualizado exitosamente',
                    rol: data.rol
                };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al actualizar el rol:', error);

            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar el rol'
            };
        }
    };

    const obtenerRolesAsignados = async () => {
        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, rol: null };
        }
        try {
            const { data } = await geriatricoApi.get('/roles/rolesAsignados',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            // Extraemos los roles de ambas categorías
            const rolesGeriatrico = data?.opcionesGeriatrico?.map(rol => ({
                rol_id: rol.rol_id,
                rol_nombre: rol.rol_nombre,
                ge_id: rol.ge_id,
                ge_nombre: rol.ge_nombre,
                tipo: "geriatrico"
            })) || [];

            const rolesSede = data?.opcionesSede?.map(rol => ({
                rol_id: rol.rol_id,
                rol_nombre: rol.rol_nombre,
                se_id: rol.se_id,
                se_nombre: rol.se_nombre,
                tipo: "sede"
            })) || [];

            const roles = [...rolesGeriatrico, ...rolesSede];

            if (roles.length > 0) {
                return {
                    success: true,
                    message: data.message || 'Roles asignados obtenidos exitosamente',
                    roles
                };
            }

            return {
                success: false,
                message: "No tienes roles asignados.",
                roles: []
            };

        } catch (error) {
            console.error("Error al obtener los roles asignados:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener los roles asignados"
            };
        }
    };

    const seleccionarRol = async ({ rol_id, se_id, ge_id }) => {
        const rolIdNum = Number(rol_id); // Convertir a número
        const geIdNum = ge_id ? Number(ge_id) : undefined; // Convertir si existe
        const seIdNum = se_id ? Number(se_id) : undefined; // Convertir si existe

        dispatch(startSeleccion());

        const token = getToken();

        if (!token) {
            const errorMessage = "Token de autenticación no encontrado";
            dispatch(setRolError(errorMessage));
            return { success: false, message: errorMessage };
        }

        if (!rolIdNum || (!seIdNum && !geIdNum)) {
            const errorMessage = "Debe seleccionar un rol y una sede o geriátrico.";
            dispatch(setRolError(errorMessage));
            return { success: false, message: errorMessage };
        }

        if (seIdNum && geIdNum) {
            const errorMessage = "Debe seleccionar solo una sede o geriátrico, no ambos.";
            dispatch(setRolError(errorMessage));
            return { success: false, message: errorMessage };
        }

        try {
            const payload = {
                rol_id: rolIdNum,
                ...(seIdNum ? { se_id: seIdNum } : {}),
                ...(geIdNum ? { ge_id: geIdNum } : {}),
            };


            const { data } = await geriatricoApi.post(
                "/roles/rolSeleccionado",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );


            if (data.ge_id) {

                // Guardar en Redux
                dispatch(setRolSeleccionado({ rol_id: rolIdNum, se_id: seIdNum, ge_id: data.ge_id }));
                // Guardar en localStorage para persistencia
                localStorage.setItem("ge_id", data.ge_id);
                localStorage.setItem("rol_id", data.rol_id);
                localStorage.setItem("se_id", data.se_id);

            }

            return { success: true, message: data.message, data };
        } catch (error) {
            console.error("❌ Error en la petición:", error);

            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al seleccionar rol";
            dispatch(setRolError(errorMessage));

            return { success: false, message: errorMessage };
        }
    };

    const obtenerHistorialRoles = async ({ ge_id }) => {
        const token = getToken();

        if (!token) {
            const errorMessage = "No hay token disponible";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, data: [] };
        }

        try {
            const { data } = await geriatricoApi.get(`/roles/historialGeriatrico/${ge_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.data && data.data.length > 0) {
                return {
                    success: true,
                    message: data.message || "Historial de roles obtenido exitosamente",
                    data: data.data, // Retorna la estructura completa del backend
                };
            } else {
                return {
                    success: false,
                    message: data.message || "No hay historial de roles.",
                    data: [],
                };
            }
        } catch (error) {
            console.error("Error al obtener el historial de roles:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener el historial de roles",
                data: [],
            };
        }
    };


    return {
        crearRol,
        obtenerRoles,
        actualizarRol,
        obtenerRolesAsignados,
        seleccionarRol,
        obtenerHistorialRoles
    };
}
