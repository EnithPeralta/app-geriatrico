import React, { useEffect, useState } from 'react'
import { useGeriatricoPersonaRol, usePersona } from '../../hooks';
import { PersonListGestion } from '../components/Gestions/PersonListGestion';
import { AssignCardGestion } from '../components/Gestions/AssignCardGestiona';
import { ModalEditPersonComponent } from '../components/ModalEditPersonComponent';
import '../../css/asignar.css'
import Swal from 'sweetalert2';
import { SideBarComponent } from '../../components';
import { GoBackComponet } from '../../components/GoBackComponent';

export const GestionarPersonasPage = () => {
    const { obtenerPersonasRegistradas, obtenerPersonaRoles, updatePerson } = usePersona();
    const { asignarRolGeriatrico } = useGeriatricoPersonaRol();
    const [activeCard, setActiveCard] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchCedula, setSearchCedula] = useState("");
    const [filteredPersona, setFilteredPersona] = useState(null);
    const [roles, setRoles] = useState({ rolesGeriatrico: [], rolesSede: [] });
    const [showAssignCard, setShowAssignCard] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [selectedGeriatrico, setSelectedGeriatrico] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedPersona, setEditedPersona] = useState({
        usuario: "",
        nombre: "",
        correo: "",
        telefono: "",
        genero: "",
        password: "",
        per_foto: "",
    });

    useEffect(() => {
        const fetchPersonas = async () => {
            setLoading(true);
            try {
                const response = await obtenerPersonasRegistradas();
                console.log(response);
                if (response.success) {
                    setPersonas(response.personas);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };
        fetchPersonas();
    }, []);



    const buscarPersonaPorCedula = () => {
        const personaEncontrada = personas.find(persona => persona.documento === searchCedula);
        if (personaEncontrada) {
            setFilteredPersona(personaEncontrada);
            setError("");
        } else {
            setFilteredPersona(null);
            Swal.fire({
                icon: 'error',
                text: 'No se encontró ninguna persona con el documento ingresado.',
            })
        }
    };

    const handleCardClick = async (persona) => {
        const isActive = activeCard === persona.id ? null : persona.id;
        console.log("Persona clickeada:", persona.id, "activeCard antes:", activeCard, "activeCard después:", isActive);
        setActiveCard(isActive);
        if (isActive) {
            try {
                const response = await obtenerPersonaRoles({ per_id: persona.id });
                console.log("Respuesta de la API:", response);
                if (response.success) {
                    setRoles({
                        rolesGeriatrico: response.persona.rolesGeriatrico || [],
                        rolesSede: response.persona.rolesSede || []
                    });
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error("Error al obtener los roles de la persona", error);
            }
        }
    };

    const openAssignCard = (persona) => {
        setShowAssignCard(true);
        setSelectedPersona(persona);
    };

    const handleAssignRole = async () => {
        if (!selectedPersona || !selectedGeriatrico || selectedRoles.length === 0 || !fechaInicio) {
            Swal.fire({
                icon: 'error',
                text: 'Debe seleccionar un geriátrico, al menos un rol y una fecha de inicio.',
            })
            return;
        }

        setAssigning(true);
        try {
            for (let rol_id of selectedRoles) {
                const response = await asignarRolGeriatrico({
                    per_id: selectedPersona.id,
                    ge_id: Number(selectedGeriatrico),
                    rol_id: Number(rol_id),
                    gp_fecha_inicio: fechaInicio, // Fecha ingresada manualmente
                    gp_fecha_fin: fechaFin || null // Fecha opcional
                });

                if (!response.success) {
                    console.error("Error al asignar rol:", response.message);
                    Swal.fire({
                        icon: 'error',
                        text: response.message,
                    })
                    setAssigning(false);
                    return;
                }
            }

            Swal.fire({
                icon: 'success',
                text: 'Rol asignado exitosamente',
            })
            setShowAssignCard(false);
            setSelectedPersona(null);
            setSelectedGeriatrico("");
            setSelectedRoles([]);
            setFechaInicio("");
            setFechaFin("");
        } catch (error) {
            console.error("Error en la asignación del rol:", error);
            Swal.fire({
                icon: 'error',
                text: 'Error al asignar el rol',
            })
        } finally {
            setAssigning(false);
        }
    };

    const openEditModal = (persona) => {
        setEditedPersona({
            id: persona.id,
            usuario: persona.usuario || "",
            nombre: persona.nombre || "",
            correo: persona.correo || "",
            telefono: persona.telefono || "",
            genero: persona.genero || "",
            password: persona.password || "",
            per_foto: persona.foto || "",
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (personaEditada) => {
        if (!personaEditada || !personaEditada.id) return;

        const personaActualizada = {
            per_id: personaEditada.id,
            per_usuario: personaEditada.usuario,
            per_nombre_completo: personaEditada.nombre,
            per_correo: personaEditada.correo,
            per_telefono: personaEditada.telefono,
            per_genero: personaEditada.genero,
            per_foto: personaEditada.per_foto instanceof File ? personaEditada.per_foto : undefined
        };

        console.log("Datos enviados corregidos:", personaActualizada);

        const result = await updatePerson(personaActualizada.per_id, personaActualizada);

        console.log("Respuesta del servidor:", result);

        if (result.success) {
            setPersonas(prev =>
                prev.map(p =>
                    p.id === result.persona.per_id
                        ? {
                            id: result.persona.per_id,
                            usuario: result.persona.per_usuario,
                            nombre: result.persona.per_nombre_completo,
                            correo: result.persona.per_correo,
                            telefono: result.persona.per_telefono,
                            genero: result.persona.per_genero,
                            per_foto: result.persona.per_foto
                        }
                        : p
                )
            );

            setShowEditModal(false);

            Swal.fire({
                icon: 'success',
                text: 'Persona actualizada exitosamente',
            });

        } else {
            console.error(result.message);
            Swal.fire({
                icon: 'error',
                text: result.message,
            });
        }
    };

    return (
        <>
            <GoBackComponet />
            <div className="bodyAsignar">
                <div className="container-asignar">
                    <div className="content-asignar">
                        <h2 className="title-asignar">Gestión de usuarios</h2>
                        <div className="search-bar">
                            <input
                                type="text"
                                className="search-input-asignar"
                                placeholder="Buscar por Cédula..."
                                value={searchCedula}
                                onChange={(e) => setSearchCedula(e.target.value)}
                            />
                            <button className="search-button-asignar" onClick={buscarPersonaPorCedula}>
                                <i className="fas fa-search" /> <span className="">Buscar</span>
                            </button>
                        </div>

                        {loading ? (
                            <p>Cargando personas...</p>
                        ) : error ? (
                            <p className="error">{error}</p>

                        ) : (
                            <div>
                                <PersonListGestion
                                    personasFiltradas={[filteredPersona]}
                                    activeCard={activeCard}
                                    handleCardClick={handleCardClick}
                                    openEditModal={openEditModal}
                                    openAssignCard={openAssignCard}
                                    roles={roles}
                                />
                                {showAssignCard && selectedPersona?.id === filteredPersona.id && (
                                    <AssignCardGestion
                                        selectedGeriatrico={selectedGeriatrico}
                                        setSelectedGeriatrico={setSelectedGeriatrico}
                                        selectedRoles={selectedRoles}
                                        setSelectedRoles={setSelectedRoles}
                                        fechaInicio={fechaInicio}
                                        setFechaInicio={setFechaInicio}
                                        fechaFin={fechaFin}
                                        setFechaFin={setFechaFin}
                                        assigning={assigning}
                                        handleAssignRole={handleAssignRole}
                                    />
                                )}
                            </div>
                        )}

                        {showEditModal && editedPersona && (
                            <ModalEditPersonComponent
                                editedPersona={editedPersona}
                                onSubmit={handleEditSubmit}
                                onClose={() => setShowEditModal(false)}
                            />
                        )}
                    </div>
                </div>
            </div>

        </>
    );

}
