import Swal from "sweetalert2";
import { useSedesRol } from "../hooks";

export const AsignarRolSedeUtil = () => {
    const { asignarRolesSede } = useSedesRol();
    const handleAssignSedes = async (per_id, rol_id, sp_fecha_inicio, sp_fecha_fin,) => {
        try {
            if (!per_id || !rol_id || !sp_fecha_inicio || !sp_fecha_fin) {
                console.warn("❌ Datos incompletos para la asignación del rol.");
                await Swal.fire({
                    icon: "warning",
                    text: "Por favor, complete todos los campos antes de asignar el rol."
                });
                return false;
            }

            const response = await asignarRolesSede({
                per_id, rol_id, sp_fecha_inicio, sp_fecha_fin
            });

            if (response?.success) {
                console.log("✅ Rol asignado con éxito:", response.message);
                return true;
            } else {
                console.warn("⚠️ Error en la asignación del rol:", response?.message || "Error desconocido.");
                await Swal.fire({
                    icon: "error",
                    text: response?.message || "Hubo un problema al asignar el rol."
                });
                return false;
            }
        } catch (error) {
            console.error("❌ Error inesperado al asignar el rol:", error);
            await Swal.fire({
                icon: "error",
                text: error?.message || "Ocurrió un error inesperado. Inténtelo nuevamente."
            });
            return false;
        }
    };

    return {
        handleAssignSedes
    }
}
