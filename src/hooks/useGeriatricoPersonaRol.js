import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers";

export const useGeriatricoPersonaRol = () => {

  // Función para asignar un rol a un geriatrico
  const asignarRolGeriatrico = async ({ per_id, ge_id, rol_id, gp_fecha_inicio, gp_fecha_fin }) => {
    console.log("Datos enviados para asignar rol:", { per_id, ge_id, rol_id, gp_fecha_inicio, gp_fecha_fin });

    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: "Token de autenticación no encontrado",
      };
    }

    try {
      const { data } = await geriatricoApi.post(
        "/geriatricopersonarol/rolGeriatrico",
        { per_id, ge_id, rol_id, gp_fecha_inicio, gp_fecha_fin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (data?.data?.gp_id) {
        return {
          success: true,
          message: data.message || "Rol asignado exitosamente",
          gp_id: data.data.gp_id,
        };
      } else {
        return {
          success: false,
          message: "Respuesta inesperada del servidor",
        };
      }
    } catch (error) {
      console.error("Error al asignar el rol:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al asignar el rol",
      };
    }
  };

  const inactivarRolGeriatrico = async ({ per_id, ge_id, rol_id }) => {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: "Token de autenticación no encontrado",
      };
    }

    try {
      const { data } = await geriatricoApi.post(
        `/geriatricopersonarol/inactivarRolGeriatrico`,
        { per_id, ge_id, rol_id }, // Enviar datos en el cuerpo
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      return {
        success: true,
        message: data.message || "Rol inactivado exitosamente",
        data: data.data, // Retorna los datos de la respuesta
        rolNombre: data.rolNombre || "Desconocido",
        geriatrico: data.geriatrico || {},
      };
    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data?.message || "Error al inactivar el rol",
        error: error.response?.data?.error || error.message,
      };
    }
  };

  return {
    asignarRolGeriatrico,
    inactivarRolGeriatrico
  };
};
