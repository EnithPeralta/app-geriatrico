import React, { useEffect, useState } from 'react'
import { useGeriatricoPersona, useGeriatricoPersonaRol, usePersona } from '../../hooks';
import { PersonListGestion } from '../components/Gestions/PersonListGestion';
import { AssignCardGestion } from '../components/Gestions/AssignCardGestiona';
import { ModalEditPersonComponent } from '../components/ModalEditPersonComponent';
import '../../css/asignar.css'
import Swal from 'sweetalert2';
import { LoadingComponet, SideBarComponent } from '../../components';

export const GestionarPersonasPage = () => {
    const { obtenerPersonasRegistradas, updatePerson } = usePersona();
    const { vinculoGeriatricoPersona } = useGeriatricoPersona();
    const { asignarRolGeriatrico } = useGeriatricoPersonaRol();
    const [activeCard, setActiveCard] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchCedula, setSearchCedula] = useState("");
    const [filteredPersona, setFilteredPersona] = useState(null);
    const [geriatrico, setGeriatrico] = useState(false);
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
        documento: "",
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
        setActiveCard(isActive);

        if (isActive) {
            try {
                const response = await vinculoGeriatricoPersona(persona.id);

                if (response.success) {
                    setGeriatrico(response.data);
                } else {
                    console.error("Error en la respuesta de la API:", response.message);
                }
            } catch (error) {
                console.error("Error al obtener los roles de la persona:", error);
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
            documento: persona.documento || "",
            telefono: persona.telefono || "",
            genero: persona.genero || "",
            password: persona.password || "",
            per_foto: persona.foto || "",
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (event, personaEditada) => {
        event.preventDefault();
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

        const result = await updatePerson(personaActualizada.per_id, personaActualizada);

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
            <div className="main-container">
                <SideBarComponent />
                <div className="content-area">
                    <h2 className="gestionar-title">Gestionar Usuarios</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar por Cédula..."
                            value={searchCedula}
                            onChange={(e) => setSearchCedula(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    buscarPersonaPorCedula(); // Ejecuta la búsqueda solo al presionar "Enter"
                                }
                            }} />
                    </div>

                    {loading ? (
                        <LoadingComponet />
                    ) : error ? (
                        <p className="error">{error}</p>

                    ) : (
                        <div>
                            <PersonListGestion
                                // personasFiltradas={filteredPersonas}
                                personasFiltradas={[filteredPersona]}
                                activeCard={activeCard}
                                handleCardClick={handleCardClick}
                                openEditModal={openEditModal}
                                openAssignCard={openAssignCard}
                                geriatrico={geriatrico}
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
                                    onClose={() => setShowAssignCard(false)}
                                />
                            )}
                        </div>
                    )}

                    {showEditModal && editedPersona && (
                        <ModalEditPersonComponent
                            editedPersona={editedPersona}
                            onSubmit={handleEditSubmit}
                            onClose={() => setShowEditModal(false)}
                            setPersonas={setPersonas}
                        />
                    )}
                </div>
            </div>
        </>
    );

}
