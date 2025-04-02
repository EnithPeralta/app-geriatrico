import React, { useState, useEffect } from "react";
import { FaUserAltSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useSedesRol, useSession } from "../../../hooks";

const RolesDisplayVinculada = ({ rolesPersonas, person }) => {
    const { inactivarRolAdminSede, inactivarRolesSede } = useSedesRol();
    const { session } = useSession();
    if (!rolesPersonas) {
        console.warn("rolesPersonas no está definido.");
        return null;
    }


    const [isModalOpen, setIsModalOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("");
    const [activeSede, setActiveSede] = useState("");
    const [activeRol, setActiveRol] = useState("");

    useEffect(() => {
    }, [isModalOpen]);

    useEffect(() => {
    }, [activeRol]);


    //     const per_id = Number(person.per_id);
    //     const se_id = rolesPersonas.sedes?.[0]?.se_id;
    //     const rol_id = rolesPersonas.sedes?.[0]?.roles?.[0]?.rol_id;

    //     console.log("per_id", per_id);
    //     console.log("se_id", se_id);
    //     console.log("rol_id", rol_id);


    //     // Verificar que per_id, ge_id y rol_id sean números válidos
    //     if (isNaN(per_id) || isNaN(se_id) || isNaN(rol_id)) {
    //         console.error("❌ Parámetros inválidos para inactivar rol", { per_id, se_id, rol_id });
    //         Swal.fire({
    //             icon: "error",
    //             text: "Parámetros inválidos para inactivar el rol.",
    //         });
    //         return;
    //     }

    //     // Confirmación del usuario
    //     const confirmacion = await Swal.fire({
    //         text: "¿Deseas inactivará el rol de Administrador Sede?",
    //         icon: "question",
    //         showCancelButton: true,
    //         confirmButtonText: "Sí, inactivar",
    //         cancelButtonText: "Cancelar",
    //     });

    //     if (!confirmacion.isConfirmed) return;

    //     try {
    //         // Llamar a la función para inactivar el rol
    //         const resultado = await inactivarRolAdminSede({ per_id, se_id, rol_id });

    //         // Mostrar el resultado
    //         Swal.fire({
    //             icon: resultado.success ? "success" : "error",
    //             text: resultado.message || (resultado.success ? "Rol inactivado exitosamente" : "No se pudo inactivar el rol"),
    //         });
    //     } catch (error) {
    //         console.error("❌ Error al inactivar rol geriátrico:", error);
    //         Swal.fire({
    //             icon: "error",
    //             text: "Hubo un error al inactivar el rol. Intenta nuevamente.",
    //         });
    //     }
    // };

    const handleInactivarRolAdminSede = async () => {
        const per_id = Number(person.per_id);

        // Buscar la sede que contenga el rol "Administrador Sede" (rol_id: 3)
        const sedeAdmin = rolesPersonas.sedes?.find(sede =>
            sede.roles.some(rol => rol.rol_id === 3)
        );

        if (!sedeAdmin) {
            console.error("❌ No se encontró una sede con rol Administrador Sede.");
            Swal.fire({
                icon: "error",
                text: "No se encontró una sede con rol Administrador Sede.",
            });
            return;
        }

        // Encontrar el rol dentro de la sede
        const rolAdmin = sedeAdmin.roles.find(rol => rol.rol_id === 3);

        if (!rolAdmin) {
            console.error("❌ No se encontró el rol Administrador Sede en la sede correspondiente.");
            Swal.fire({
                icon: "error",
                text: "No se encontró el rol Administrador Sede en la sede correspondiente.",
            });
            return;
        }

        const se_id = sedeAdmin.se_id;
        const rol_id = rolAdmin.rol_id;

        console.log("📌 Parámetros para inactivar:");
        console.log("per_id:", per_id);
        console.log("se_id:", se_id);
        console.log("rol_id:", rol_id);

        // Validar que los datos sean correctos
        if (isNaN(per_id) || isNaN(se_id) || isNaN(rol_id)) {
            console.error("❌ Parámetros inválidos", { per_id, se_id, rol_id });
            Swal.fire({
                icon: "error",
                text: "Parámetros inválidos para inactivar el rol.",
            });
            return;
        }

        // Confirmación del usuario
        const confirmacion = await Swal.fire({
            text: "¿Deseas inactivar el rol de Administrador Sede?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const resultado = await inactivarRolAdminSede({ per_id, se_id, rol_id });

            Swal.fire({
                icon: resultado.success ? "success" : "error",
                text: resultado.message || (resultado.success ? "Rol inactivado exitosamente" : "No se pudo inactivar el rol"),
            });
        } catch (error) {
            console.error("❌ Error al inactivar rol:", error);
            Swal.fire({
                icon: "error",
                text: "Hubo un error al inactivar el rol. Intenta nuevamente.",
            });
        }
    };

    const handleInactivarRolesSede = async () => {

        const per_id = Number(person.per_id);
        const se_id = rolesPersonas.sedes?.[0]?.se_id;
        const rol_id = rolesPersonas.sedes?.[0]?.roles?.[0]?.rol_id;

        // Confirmación del usuario
        const confirmacion = await Swal.fire({
            text: `¿Deseas inactivar el rol de Paciente, Enfermera(O), Colaborador`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            // Llamar a la función para inactivar el rol
            const resultado = await inactivarRolesSede({ per_id, se_id, rol_id });

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
        setActiveSede("");
        const periodoActivo = geriatrico?.periodos?.find(p => p.activo) || null;
        setActiveRol(periodoActivo ? "Activo" : "Inactivo");
    };

    const handleSedeChange = (event, se_nombre) => {
        event.stopPropagation();
        setActiveSede(se_nombre);

        const sede = rolesPersonas.sedes?.find(s => s.se_nombre === se_nombre);

        if (!sede) {
            console.warn("No se encontró la sede");
            setActiveRol("Inactivo");
            return;
        }

        // Buscar un rol dentro de la sede que tenga periodos
        const rolConPeriodo = sede.roles?.find(r => r.periodos?.some(p => p.rol_activo));

        const periodoActivo = rolConPeriodo?.periodos?.find(p => p.rol_activo) || null;

        setActiveRol(periodoActivo ? "Activo" : "Inactivo");
    };

    const handleRolChange = (rol_nombre) => {
        setActiveRol(rol_nombre);
    };


    const periodoActivoGeriatrico = rolesPersonas.rolesGeriatrico
        ?.find(rol => rol.rol_nombre === activeTab)?.periodos
        ?.find(p => p.activo === true || p.activo === 'true' || p.activo === 1 || p.activo === false || p.activo === 'false' || p.activo === 0);  // Captura todos los valores


    const periodoActivoSede = rolesPersonas.sedes
        ?.find(sede => sede.se_nombre === activeSede)  // Filtra por el nombre de la sede
        ?.roles
        ?.find(rol => rol.rol_nombre === activeRol)  // Filtra por el nombre del rol
        ?.periodos
        ?.find(p => p.activo !== undefined); // Asegúrate de que el periodo tiene un valor para `activo`

    const esAdminSedeActivo = rolesPersonas.sedes?.some(sede =>
        sede.roles?.some(rol =>
            rol.rol_nombre === "Administrador Sede" &&
            rol.periodos?.some(periodo => periodo.activo)
        )
    );
    
    const tieneRolAcudiente = rolesPersonas?.sedes?.some(sede =>
        sede.roles?.some(rol => rol.rol_nombre === "Acudiente")
    );
    
    
    

    const tieneRolDiferenteDeAcudiente = rolesPersonas.sedes?.some(sede =>
        sede.roles?.length > 0 && sede.roles.some(rol => rol.rol_nombre !== "Acudiente")
    );




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
                                    {periodoActivoSede?.activo ? (
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

                    {periodoActivoSede?.activo && activeSede &&  !tieneRolAcudiente && (
                        (session.rol_id === 2 && esAdminSedeActivo) ? (
                            <button className="inactive" onClick={() => handleInactivarRolAdminSede(activeSede)}>
                                <FaUserAltSlash />
                            </button>
                        ) : (session.rol_id === 3 && tieneRolDiferenteDeAcudiente) && (
                            <button className="inactive" onClick={() => handleInactivarRolesSede(activeSede)}>
                                <FaUserAltSlash />
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

export default RolesDisplayVinculada;
