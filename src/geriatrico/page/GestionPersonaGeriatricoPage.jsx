import { useEffect, useState } from "react";
import { LoadingComponet, ModalEnfermera, ModalRegistrarPaciente, SideBarComponent } from "../../components";
import { useEnfermera, useForm, useGeriatrico, useGeriatricoPersona, usePaciente, useSedesRol } from "../../hooks";
import { ModalEditPersonComponent } from "../components/ModalEditPersonComponent";
import Swal from "sweetalert2";
import { PersonList } from "../components/PersonasVinculadas/PersonList";
import { AssignCard } from "../components/PersonasVinculadas/AssignCard";


export const GestionPersonaGeriatricoPage = () => {
    const { registrarPaciente } = usePaciente();
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerPersonaRolesMiGeriatricoSede, personasVinculadasMiGeriatrico, inactivarVinculacionGeriatrico, reactivarVinculacionGeriatrico } = useGeriatricoPersona();
    const { asignarRolAdminSede, asignarRolesSede } = useSedesRol();
    const { startRegisterEnfermera } = useEnfermera();
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCard, setActiveCard] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [showAssignCard, setShowAssignCard] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [geriatrico, setGeriatrico] = useState(null);
    const [fechaFin, setFechaFin] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalEnfermera, setShowModalEnfermera] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedSedes, setSelectedSedes] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [editedPersona, setEditedPersona] = useState({
        usuario: "",
        nombre: "",
        documento: "",
        correo: "",
        telefono: "",
        genero: "",
        password: "",
        foto: "",
    });

    const [rolesPersonas, setRolesPersonas] = useState([]);
    const { onResetForm } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [sedeResult, personasResult] = await Promise.all([
                    homeMiGeriatrico(),
                    personasVinculadasMiGeriatrico()
                ]);
    
                console.log("📡 Respuesta de la API (sede):", sedeResult);
    
                if (sedeResult?.success && sedeResult.geriatrico) {
                    setGeriatrico(sedeResult.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }
    
                if (personasResult?.success && personasResult.personas?.data) {
                    setPersonas(personasResult.personas.data);
                } else {
                    setError(personasResult?.message || "No se pudieron obtener las personas vinculadas.");
                }
            } catch (err) {
                console.error(err);
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    // Filtrar personas por nombre o documento
    const personasFiltradas = personas.filter(personas =>
        personas?.per_nombre?.toLowerCase()?.includes(search.toLowerCase()) ||
        personas?.per_documento?.includes(search)
    );

    const handleCardClick = async (persona) => {
        console.log("Persona seleccionada:", persona);

        const isActive = activeCard === persona.per_id ? null : persona.per_id;
        setActiveCard(isActive);

        if (isActive) {
            try {
                const response = await obtenerPersonaRolesMiGeriatricoSede(persona.per_id);
                console.log("Respuesta de la API:", response);

                // Verificar si la respuesta tiene los datos esperados
                if (response && response.success && response.data && response.data.persona) {
                    setRolesPersonas(response.data.persona); // Usar la propiedad correcta
                } else {
                    console.error(response.message);
                }
                console.log(`Roles para ${persona.per_nombre}:`, response);

            } catch (error) {
                console.error("Error al obtener roles:", error);
            }
        }
    };
    const openAssignCard = (persona) => {
        setShowAssignCard(true);
        setSelectedPersona(persona);
    };

    // const handleInactivarRolAdminSede = async (persona) => {
    //     console.log("Persona seleccionada para inactivar:", persona);

    //     if (!persona || !persona.per_id) {
    //         console.warn("⚠️ Información incompleta para inactivar el rol: falta per_id.");
    //         return;
    //     }

    //     if (!persona.rolesSede?.length) {
    //         Swal.fire({
    //             icon: "warning",
    //             text: " La persona no tiene roles en una sede.",
    //         });
    //         console.warn("⚠️ La persona no tiene roles en una sede.");
    //         return;
    //     }

    //     const rolSede = persona.rolesSede[0];
    //     console.log("Rol de sede seleccionado:", rolSede);

    //     if (!rolSede.sede?.id || !rolSede.rol_id) {
    //         console.warn("⚠️ Información incompleta: falta sede ID o rol ID.");
    //         return;
    //     }

    //     // Convertir valores a números válidos antes de enviarlos
    //     const per_id = Number(persona.per_id);
    //     const se_id = Number(rolSede.sede.id);
    //     const rol_id = Number(rolSede.rol_id);

    //     if (isNaN(per_id) || isNaN(se_id) || isNaN(rol_id) || per_id <= 0 || se_id <= 0 || rol_id <= 0) {
    //         console.error("❌ Error: Uno o más valores no son números válidos:", { per_id, se_id, rol_id });
    //         return;
    //     }

    //     const confirmacion = await Swal.fire({
    //         text: "Esta acción inactivará el rol de la persona en la sede.",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Sí, inactivar",
    //         cancelButtonText: "Cancelar"
    //     });

    //     if (!confirmacion.isConfirmed) return;

    //     const resultado = await inactivarRolAdminSede({ per_id, se_id, rol_id });

    //     if (resultado.success) {
    //         Swal.fire({
    //             icon: "success",
    //             text: resultado.message || "Rol inactivado exitosamente"
    //         });
    //     } else {
    //         Swal.fire({
    //             icon: "error",
    //             text: resultado.message || "No se pudo inactivar el rol"
    //         });
    //     }
    // };


    const handleInactivarVinculacion = async (persona) => {
        console.log("Persona seleccionada para inactivar:", persona);

        if (!persona || !persona.per_id) {
            console.warn("⚠️ Información incompleta para inactivar el rol: falta per_id.");
            return;
        }

        const confirmacion = await Swal.fire({
            text: "Deseas inactivará la vinculación de la persona al geriatrico.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        const resultado = await inactivarVinculacionGeriatrico(persona.per_id);

        if (resultado.success) {
            Swal.fire({
                icon: "success",
                text: resultado.message || "Vinculación inactivada exitosamente"
            });
        } else {
            Swal.fire({
                icon: "error",
                text: resultado.message || "No se pudo inactivar la vinculación"
            });
        }

    }

    const handleReactivarVinculacion = async (persona) => {
        console.log("Persona seleccionada para reactivar:", persona);

        if (!persona || !persona.per_id) {
            console.warn("⚠️ Información incompleta para reactivar el rol: falta per_id.");
            return;
        }

        const confirmacion = await Swal.fire({
            text: "Deseas reactivará la vinculación de la persona al geriatrico.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, reactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        const resultado = await reactivarVinculacionGeriatrico(persona.per_id);

        if (resultado.success) {
            Swal.fire({
                icon: "success",
                text: resultado.message || "Vinculación reactivada exitosamente"
            });
            resetForm();
        } else {
            Swal.fire({
                icon: "error",
                text: resultado.message || "No se pudo reactivar la vinculación"
            });
        }

    }


    const handlePaciente = async (datosPaciente) => {
        if (!datosPaciente || !datosPaciente.per_id) {
            Swal.fire({
                icon: 'warning',
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }

        console.log("📤 Enviando datos del paciente:", datosPaciente);

        try {
            const response = await registrarPaciente(datosPaciente);

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    text: response.message,
                });
                setShowModal(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: response.message,
                });
            }
        } catch (error) {
            console.error("❌ Error al registrar paciente:", error);

            let errorMessage = "Ocurrió un error inesperado. Inténtalo nuevamente.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "No se pudo conectar con el servidor.";
            }

            Swal.fire({
                icon: 'error',
                text: errorMessage,
            });
        }
    };

    const handleEnfermera = async (datosEnfermera) => {
        if (!datosEnfermera.per_id) {
            Swal.fire({
                icon: 'warning',
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }

        console.log("📤 Enviando datos de la enfermera:", datosEnfermera)

        try {
            const response = await startRegisterEnfermera(datosEnfermera);
            console.log(response);

            Swal.fire({
                icon: response.success ? 'success' : 'error',
                text: response.message,
            });

            if (response.success) {
                setShowModal(false); // Cierra el modal si el registro es exitoso
            } else {
                console.error("❌ Error al registrar enfermera:", response.message);
            }
        } catch (error) {
            console.error("❌ Error al registrar enfermera:", error);
            let errorMessage = "Ocurrido un error inesperado. Inténtalo nuevamente.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "No se pudo conectar con el servidor.";
            }

            Swal.fire({
                icon: 'error',
                text: errorMessage,
            })
        }
    };

    const handleAssignSedes = async () => {
        try {
            // Validar que los valores requeridos estén presentes
            if (!selectedPersona?.per_id || !selectedRoles || !fechaInicio) {
                console.warn("❌ Datos incompletos para la asignación del rol.");
                await Swal.fire({
                    icon: "warning",
                    text: "Por favor, complete todos los campos obligatorios antes de asignar el rol."
                });
                return;
            }

            // Enviar solicitud para asignar rol
            const response = await asignarRolesSede({
                per_id: selectedPersona.per_id,
                rol_id: selectedRoles,
                sp_fecha_inicio: fechaInicio,
                sp_fecha_fin: fechaFin || null,
            });
            onResetForm();

            console.log(response)
            // Manejo de la respuesta del servidor
            if (response?.success) {
                console.log("✅ Rol asignado con éxito:", response.message);
                await Swal.fire({
                    icon: "success",
                    text: response.message
                });

                // Si el rol asignado es "Paciente", mostrar mensaje adicional y abrir modal
                if (response.rolNombre === "Paciente" && response.message) {
                    await Swal.fire({
                        icon: "info",
                        text: response.message,
                    });
                    setShowModal(true);
                }
                if (response.rolNombre === "Enfermera(O)" && response.message) {
                    await Swal.fire({
                        icon: "info",
                        text: response.message,
                    })
                    setShowModalEnfermera(true);
                }
            } else {
                console.warn("⚠️ Error en la asignación del rol:", response?.message || "Error desconocido.");
                await Swal.fire({
                    icon: "error",
                    text: response?.message || "Hubo un problema al asignar el rol."
                });
            }
        } catch (error) {
            console.error("❌ Error inesperado al asignar el rol:", error);
            await Swal.fire({
                icon: "error",
                text: error?.message || "Ocurrió un error inesperado. Inténtelo nuevamente."
            });
        }
    };

    const handleAssignRole = async () => {
        if (!selectedPersona || !selectedSedes || selectedRoles.length === 0 || !fechaInicio) {
            Swal.fire({
                icon: "error",
                text: "Debe seleccionar al menos una sede y un rol, y definir la fecha de inicio.",
            });
            return;
        }
        setAssigning(true);
        try {
            for (let rol_id of selectedRoles) {
                const response = await asignarRolAdminSede({
                    per_id: selectedPersona.per_id,
                    se_id: Number(selectedSedes),
                    rol_id: rol_id,
                    sp_fecha_inicio: fechaInicio,
                    sp_fecha_fin: fechaFin || null,
                });

                console.log("Respuesta del servidor:", response);

                if (!response.success) {
                    throw new Error(response.message);
                }

                // ✅ Mostrar el modal si el rol asignado es "Paciente"
                if (response.rolNombre === "Paciente") {
                    Swal.fire({
                        icon: "success",
                        text: response.mensajeAdicional,
                    });
                    setShowModal(true);
                }
            }
            resetForm();
        } catch (error) {
            console.error("Error al asignar rol:", error);
            Swal.fire({
                icon: "error",
                text: error.message || "Error al asignar rol",
            });
        } finally {
            setAssigning(false);
        }
    };

    const resetForm = () => {
        setShowAssignCard(false);
        setSelectedPersona(null);
        setSelectedRoles([]);
        setSelectedSedes("");
        setFechaInicio("");
        setFechaFin("");
    };

    const openEditModal = (persona) => {
        setEditedPersona({
            id: persona.per_id,
            usuario: persona.per_usuario || "",
            nombre: persona.per_nombre || "",
            documento: persona.per_documento || "",
            correo: persona.per_correo || "",
            telefono: persona.per_telefono || "",
            genero: persona.per_genero || "",
            password: "",
            foto: persona.per_foto || "",
        });
        setShowEditModal(true);
    };




    if (loading) {
        <span className="loader" />
    }

    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content-area" style={{ backgroundColor: geriatrico?.color_principal }}>
                <h2 className="gestionar-title">Personas Vinculadas</h2>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre o documento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {loading ? (
                    <LoadingComponet />
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div>
                        <PersonList
                            personasFiltradas={personasFiltradas}
                            activeCard={activeCard}
                            handleCardClick={handleCardClick}
                            openEditModal={openEditModal}
                            openAssignCard={openAssignCard}
                            handleInactivarVinculacion={handleInactivarVinculacion}
                            handleReactivarVinculacion={handleReactivarVinculacion}
                            rolesPersonas={rolesPersonas}
                        />

                        {showAssignCard && selectedPersona?.per_id && (
                            <AssignCard
                                selectedRoles={selectedRoles}
                                setSelectedRoles={setSelectedRoles}
                                selectedSedes={selectedSedes}
                                setSelectedSedes={setSelectedSedes}
                                fechaInicio={fechaInicio}
                                setFechaInicio={setFechaInicio}
                                fechaFin={fechaFin}
                                setFechaFin={setFechaFin}
                                assigning={assigning}
                                handleAssignRole={handleAssignRole}
                                handleAssignSedes={handleAssignSedes}
                                onClose={resetForm}
                            />
                        )}
                        {showEditModal && editedPersona && (
                            <ModalEditPersonComponent
                                editedPersona={{ ...editedPersona }}
                                setPersonas={setPersonas}
                                onClose={() => setShowEditModal(false)}
                            />
                        )}
                        {showModal && selectedPersona && (
                            <ModalRegistrarPaciente
                                datosIniciales={selectedPersona}
                                onRegister={handlePaciente}
                                onClose={() => setShowModal(false)}
                                selectedRoles={selectedRoles}
                                setSelectedRoles={setSelectedRoles}
                            />
                        )}
                        {showModalEnfermera && selectedPersona && (
                            <ModalEnfermera
                                datosInicial={selectedPersona}
                                onRegistrar={handleEnfermera}
                                onClose={() => setShowModalEnfermera(false)}
                                selectedRoles={selectedRoles}
                                setSelectedRoles={setSelectedRoles}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};