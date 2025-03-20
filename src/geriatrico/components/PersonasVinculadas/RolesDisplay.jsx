import Swal from "sweetalert2";
import { useGeriatricoPersona, useSedesRol } from "../../../hooks";

export const RolesDisplay = ({ roles, persona }) => {
    if (roles.rolesGeriatrico.length === 0 && roles.rolesSede.length === 0) {
        return null; // No hay roles que mostrar
    }
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { inactivarRolAdminSede, inactivarRolesSede } = useSedesRol();

    const handleInactivarRolAdminSede = async (persona) => {
        console.log("Persona seleccionada para inactivar:", persona);

        if (!persona || !persona.per_id) {
            console.error("❌ Persona no encontrada o `per_id` inválido.", persona);
            Swal.fire({
                icon: "error",
                text: "Persona no encontrada o `per_id` inválido.",
            });
            return;
        }

        const perId = Number(persona.per_id);
        if (isNaN(perId) || perId <= 0) {
            console.error("❌ Error: `per_id` no es un número válido:", perId);
            return;
        }

        console.log(`🔍 Solicitando roles para la persona con ID: ${perId}`);

        // Obtener los roles de la persona
        const response = await obtenerPersonaRolesMiGeriatricoSede(perId);
        console.log("Respuesta de la API Roles: ", response);

        if (!response.success) {
            console.error("❌ Error al obtener los roles:", response.message);
            Swal.fire({
                icon: "warning",
                text: response.message,
            });
            return;
        }

        const { rolesSede } = response.persona || {};

        // Buscar el rol de Administrador Sede
        const rolSede = rolesSede?.find(rol => rol.rol_nombre === "Administrador Sede");

        if (!rolSede) {
            console.warn("⚠️ La persona no tiene el rol de Administrador Sede.");
            Swal.fire({
                icon: "warning",
                text: "La persona no tiene el rol de Administrador Sede.",
            });
            return;
        }

        if (!rolSede.se_id || !rolSede.rol_id) {
            console.warn("⚠️ Faltan datos del rol de sede.", rolSede);
            return;
        }

        const per_id = Number(persona.per_id);
        const se_id = Number(rolSede.se_id);
        const rol_id = Number(rolSede.rol_id);

        if ([per_id, se_id, rol_id].some(isNaN) || per_id <= 0 || se_id <= 0 || rol_id <= 0) {
            console.error("❌ Error: Uno o más valores no son números válidos:", { per_id, se_id, rol_id });
            return;
        }

        // Confirmación del usuario
        const confirmacion = await Swal.fire({
            text: "Esta acción inactivará el rol de Administrador Sede.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        // Llamar a la función para inactivar el rol
        const resultado = await inactivarRolAdminSede({ per_id, se_id, rol_id });

        Swal.fire({
            icon: resultado.success ? "success" : "error",
            text: resultado.message || (resultado.success ? "Rol inactivado exitosamente" : "No se pudo inactivar el rol")
        });
    };

    const handleInactivarRolesSede = async (persona) => {
        console.log("Persona seleccionada para inactivar:", persona);

        if (!persona || !persona.per_id) {
            console.error("❌ Persona no encontrada o `per_id` inválido.", persona);
            Swal.fire({
                icon: "error",
                text: "Persona no encontrada o `per_id` inválido.",
            });
            return;
        }

        const perId = Number(persona.per_id);
        if (isNaN(perId) || perId <= 0) {
            console.error("❌ Error: `per_id` no es un número válido:", perId);
            return;
        }

        console.log(`🔍 Solicitando roles para la persona con ID: ${perId}`);

        // Obtener los roles de la persona
        const response = await obtenerPersonaRolesMiGeriatricoSede(perId);
        console.log("Respuesta de la API Roles: ", response);

        if (!response.success) {
            console.error("❌ Error al obtener los roles:", response.message);
            Swal.fire({
                icon: "warning",
                text: response.message,
            });
            return;
        }

        const { rolesSede } = response.persona || {};

        // Buscar el rol de Paciente, Enfermera(O) o Colaborador.
        const rolSede = rolesSede?.find(rol =>
            ["Paciente", "Enfermera(O)", "Colaborador"].includes(rol.rol_nombre)
        );

        if (!rolSede) {
            console.warn("⚠️ La persona no tiene el rol de Paciente, Enfermera(O) o Colaborador.");
            Swal.fire({
                icon: "warning",
                text: "La persona no tiene el rol de Paciente, Enfermera(O) o Colaborador..",
            });
            return;
        }

        if (!rolSede.se_id || !rolSede.rol_id) {
            console.warn("⚠️ Faltan datos del rol de sede.", rolSede);
            return;
        }

        const per_id = Number(persona.per_id);
        const se_id = Number(rolSede.se_id);
        const rol_id = Number(rolSede.rol_id);

        if ([per_id, se_id, rol_id].some(isNaN) || per_id <= 0 || se_id <= 0 || rol_id <= 0) {
            console.error("❌ Error: Uno o más valores no son números válidos:", { per_id, se_id, rol_id });
            return;
        }

        // Confirmación del usuario
        const confirmacion = await Swal.fire({
            text: "Esta acción inactivará el rol de Paciente, Enfermera(O) o Colaborador.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        // Llamar a la función para inactivar el rol
        const resultado = await inactivarRolesSede({ per_id, se_id, rol_id });

        Swal.fire({
            icon: resultado.success ? "success" : "error",
            text: resultado.message || (resultado.success ? "Rol inactivado exitosamente" : "No se pudo inactivar el rol")
        });


    }

    return (
        <>
            {roles.rolesGeriatrico.length > 0 && (
                <div className="user-card-container">
                    {roles.rolesGeriatrico.map((rol, index) => (
                        <div key={index} className="user-details">
                            <div className="status-icon-active-rol">
                                {rol.activoRolGer ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <span className="user-name">{rol.rol_nombre}</span>
                            <span className="user-id">{rol.fechaInicio} - {rol.fechaFin ? rol.fechaFin : "Indefinido"}</span>
                        </div>
                    ))}
                </div>
            )}

            {roles.rolesSede.length > 0 && (
                <div className="user-card-container">
                    {roles.rolesSede.map((rol, index) => (
                        <div key={index} className="">
                            <div className="status-icon-active-rol">
                                {rol.activoRolSede ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{rol.rol_nombre}</span>
                                <span className="user-id">{rol.se_nombre}</span>
                                <span className="user-id">{rol.fechaInicio} - {rol.fechaFin ? rol.fechaFin : "Indefinido"}</span>
                                <span className="user-id">{rol.activoRolSede ? "Activo" : "Inactivo"}</span>
                            </div>
                            {["Paciente", "Enfermera(O)", "Colaborador"].includes(rol.rol_nombre) && rol.activoRolSede && (
                                <div className="buttons-asignar">
                                    <button
                                        className="active"
                                        onClick={() => handleInactivarRolesSede(persona)}
                                    >
                                        <i className="fa-solid fa-user-gear i-asignar"></i>
                                    </button>
                                </div>
                            )}



                            {rol.rol_nombre === "Administrador Sede" && rol.activoRolSede && (
                                <div className="buttons-asignar">
                                    <button
                                        className="inactive-button-fa"
                                        onClick={() => handleInactivarRolAdminSede(persona)}
                                    >
                                        <i className="fa-solid fa-user-slash i-asignar"></i>
                                    </button>

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};