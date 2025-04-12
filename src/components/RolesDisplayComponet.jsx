import React, { useState, useEffect } from "react";
import { FaUserAltSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useGeriatricoPersonaRol } from "../hooks";

export const RolesDisplayComponet = ({ rolesPersonas, person, getId }) => {
    const { inactivarRolGeriatrico } = useGeriatricoPersonaRol();
    if (!rolesPersonas) {
        console.warn("rolesPersonas no está definido.");
        return null;
    }

    console.log("rolesPersona", rolesPersonas);

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("");
    const [activeSede, setActiveSede] = useState("");
    const [activeRol, setActiveRol] = useState("");

    useEffect(() => {
        console.log("Estado del modal:", isModalOpen);
    }, [isModalOpen]);

    useEffect(() => {
        console.log("Estado de activeRol actualizado:", activeRol);
    }, [activeRol]);

    const handleInactivarRolGeriatrico = async () => {


        const per_id = Number(person.per_id);
        const ge_id = Number(getId)
        const rol_id = rolesPersonas.rolesGeriatrico?.[0]?.rol_id;

        // Verificar que per_id, ge_id y rol_id sean números válidos
        if (isNaN(per_id) || isNaN(ge_id) || isNaN(rol_id)) {
            console.error("❌ Parámetros inválidos para inactivar rol", { per_id, ge_id, rol_id });
            Swal.fire({
                icon: "error",
                text: "Parámetros inválidos para inactivar el rol.",
            });
            return;
        }

        // Confirmación del usuario
        const confirmacion = await Swal.fire({
            text: "¿Deseas inactivar el rol de Administrador Geriátrico?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            // Llamar a la función para inactivar el rol
            const resultado = await inactivarRolGeriatrico({ per_id, ge_id, rol_id });

            // Mostrar el resultado
            Swal.fire({
                icon: resultado.success ? "success" : "error",
                text: resultado.message || (resultado.success ? "Rol inactivado exitosamente" : "No se pudo inactivar el rol"),
            });
        } catch (error) {
            console.error("❌ Error al inactivar rol geriátrico:", error);
            Swal.fire({
                icon: "error",
                text: "Hubo un error al inactivar el rol. Intenta nuevamente.",
            });
        }
    };


    const handleGeriatricoChange = (event, rol_nombre) => {
        event.stopPropagation(); // Evita que el evento burbujee y cierre el modal por accidente
        setActiveTab(rol_nombre);
        const geriatrico = rolesPersonas.rolesGeriatrico?.find(r => r.rol_nombre === rol_nombre);
        console.log("geriatrico", geriatrico);
        setActiveSede("");
        const periodoActivo = geriatrico?.periodos?.find(p => p.activo) || null;
        console.log("periodoActivo", periodoActivo);
        setActiveRol(periodoActivo ? "Activo" : "Inactivo");
    };

    const handleSedeChange = (event, se_nombre) => {
        event.stopPropagation();
        setActiveSede(se_nombre);

        const sede = rolesPersonas.sedes?.find(s => s.se_nombre === se_nombre);
        console.log("sede", sede);

        if (!sede) {
            console.warn("No se encontró la sede");
            setActiveRol("Inactivo");
            return;
        }

        // Buscar un rol dentro de la sede que tenga periodos
        const rolConPeriodo = sede.roles?.find(r => r.periodos?.some(p => p.rol_activo));

        const periodoActivo = rolConPeriodo?.periodos?.find(p => p.rol_activo) || null;
        console.log("periodoActivo", periodoActivo);

        setActiveRol(periodoActivo ? "Activo" : "Inactivo");
    };

    const handleRolChange = (rol_nombre) => {
        setActiveRol(rol_nombre);
    };

    // Verifica el valor de activeTab y los rolesPersonas
    console.log("Active Tab:", activeTab);
    console.log("Roles Personales:", rolesPersonas);

    const periodoActivoGeriatrico = rolesPersonas.rolesGeriatrico
        ?.find(rol => rol.rol_nombre === activeTab)?.periodos
        ?.find(p => p.activo === true || p.activo === 'true' || p.activo === 1 || p.activo === false || p.activo === 'false' || p.activo === 0);  // Captura todos los valores

    console.log("Periodo Activo Geriátrico:", periodoActivoGeriatrico);


    const periodoActivoSede = rolesPersonas.sedes
        ?.find(sede => sede.se_nombre === activeSede)
        ?.roles
        ?.find(rol => rol.rol_nombre === activeRol) 
        ?.periodos
        ?.find(p => p.rol_activo !== undefined) || null;

    console.log("periodoActivoSede", periodoActivoSede);

    return isModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{rolesPersonas.nombre}</h2>
                    <button
                        className="close-btn"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>
                <div className="tabs-container">
                    <div className="geriatrico-tabs">
                        {(rolesPersonas.rolesGeriatrico || []).map((rol, index) => (
                            <button
                                key={index}
                                className={`geriatrico-tab ${activeTab === rol.rol_nombre ? "active" : ""}`}
                                onClick={(e) => handleGeriatricoChange(e, rol.rol_nombre)}
                            >
                                {rol.rol_nombre}
                            </button>
                        ))}
                    </div>

                    {activeTab && (
                        <div>
                            <div className="sede-tabs">
                                {(rolesPersonas.sedes || []).map((sede, index) => (
                                    <button
                                        key={index}
                                        className={`sede-tab ${activeSede === sede.se_nombre ? "active" : ""}`}
                                        onClick={(e) => handleSedeChange(e, sede.se_nombre)}
                                    >
                                        {sede.se_nombre}
                                    </button>
                                ))}
                            </div>

                            <div className="role-details">
                                <div className="detail-card">
                                    <h4>Información del Geriatrico</h4>
                                    <p><strong>Rol Geriatrico:</strong> {activeTab || "No seleccionado"}</p>
                                    <p>
                                        <strong>Estado: </strong>
                                        {periodoActivoGeriatrico?.activo ? (
                                            <i className="fa-solid fa-circle-check activo"></i>
                                        ) : (
                                            <i className="fa-solid fa-circle-xmark inactivo"></i>
                                        )}
                                    </p>
                                    <p><strong>Fecha de Inicio:</strong> {periodoActivoGeriatrico?.fechaInicio || "No disponible"}</p>
                                    <p><strong>Fecha de Fin:</strong> {periodoActivoGeriatrico?.fechaFin || "No disponible"}</p>
                                    {periodoActivoGeriatrico?.activo && (
                                        <button className="inactive" onClick={() => handleInactivarRolGeriatrico(activeTab)}>
                                            <FaUserAltSlash />
                                        </button>
                                    )
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {(!rolesPersonas.rolesGeriatrico?.length > 0) && (
                        <div className="sede-tabs">
                            {rolesPersonas.sedes?.map((sede, index) => (
                                <button
                                    key={index}
                                    className={`sede-tab ${activeSede === sede.se_nombre ? "active" : ""}`}
                                    onClick={(e) => handleSedeChange(e, sede.se_nombre)}
                                >
                                    {sede.se_nombre}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeSede && rolesPersonas.sedes?.length > 0 && (
                        <div className="role-tabs">
                            {(rolesPersonas.sedes || [])
                                .find(sede => sede.se_nombre === activeSede)
                                ?.roles?.map(rol => (
                                    <button
                                        key={rol.rol_nombre}
                                        className={`role-tab ${activeRol === rol.rol_nombre ? "active" : ""}`}
                                        onClick={() => handleRolChange(rol.rol_nombre)}
                                    >
                                        {rol.rol_nombre}
                                    </button>
                                ))}
                        </div>
                    )}

                    {activeSede && (
                        <div className="role-details">
                            <div className="detail-card">
                                <h4>Información del Rol</h4>
                                <p><strong>Sede:</strong> {activeSede || "No seleccionado"}</p>
                                <p>
                                    <strong>Estado: </strong>
                                    {periodoActivoSede?.rol_activo ? (
                                        <i className="fa-solid fa-circle-check activo"></i>
                                    ) : (
                                        <i className="fa-solid fa-circle-xmark inactivo"></i>
                                    )}
                                </p>

                                <p><strong>Fecha de Inicio:</strong> {periodoActivoSede?.fechaInicio || "N/A"}</p>

                                <p><strong>Fecha de Fin:</strong> {periodoActivoSede?.fechaFin || "N/A"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};
