import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    useColaboradores,
    useGeriatrico,
    useGeriatricoPersona,
    useSedesRol
} from '../../hooks';
import {
    LoadingComponet,
    SideBarComponent
} from '../../components';
import { PersonListColaborador } from '../components/Colaborador/PersonListColaborador';
import { ModalRegisterColaborador } from '../components/Colaborador/ModalRegisterColaborador';

export const ColaboradoresPage = () => {
    const { obtenerColaboradoresSede, obtenerRolesColaboradoresSede } = useColaboradores();
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { inactivarRolesSede } = useSedesRol();

    const [geriatrico, setGeriatrico] = useState(null);
    const [colaboradores, setColaboradores] = useState([]);
    const [showRegisterColaborador, setShowRegisterColaborador] = useState(false);
    const [search, setSearch] = useState("");
    const [activeCard, setActiveCard] = useState(null);
    const [roles, setRoles] = useState({ rolesGeriatrico: [], rolesSede: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Agregado para manejar errores

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [sedeResult, colaboradoresResult] = await Promise.all([
                    homeMiGeriatrico(),
                    obtenerColaboradoresSede()
                ]);

                if (sedeResult?.success) {
                    setGeriatrico(sedeResult.geriatrico);
                }

                if (colaboradoresResult?.success && Array.isArray(colaboradoresResult.data?.data)) {
                    setColaboradores(colaboradoresResult.data.data); // ← accede al array real aquí
                } else {
                    console.warn("❗ colaboradoresResult.data.data no es un array:", colaboradoresResult.data);
                    setColaboradores([]);
                }

            } catch (err) {
                console.error("❌ Error al cargar colaboradores:", err);
                setError("Error al cargar los colaboradores.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);




    const handleCardClick = async (colaborador) => {
        const isActive = activeCard === colaborador.per_id ? null : colaborador.per_id;
        setActiveCard(isActive);

        if (isActive) {
            try {
                const response = await obtenerRolesColaboradoresSede(colaborador.per_id);

                if (response?.success) {
                    setRoles({ rolesSede: response.data || [] });
                } else {
                    throw new Error(response.message || "Error al obtener los roles.");
                }
            } catch (error) {
                console.error("❌ Error al obtener roles:", error);
                Swal.fire({
                    icon: "error",
                    text: error.message || "Error al obtener los roles.",
                });
            }
        }
    };


    const handleInactivarRolesSede = async (persona) => {
        if (!persona || !persona.per_id) {
            Swal.fire({
                icon: "error",
                text: "Persona no encontrada o `per_id` inválido.",
            });
            return;
        }

        const perId = Number(persona.per_id);
        const response = await obtenerPersonaRolesMiGeriatricoSede(perId);

        if (!response.success || !response.data?.persona?.sedes) {
            Swal.fire({
                icon: "warning",
                text: "No se pudieron obtener los roles de la persona.",
            });
            return;
        }

        const rolesValidos = ["Paciente", "colaboradores(o)", "Colaborador"];
        const sedeConRol = response.data.persona.sedes.find(sede =>
            sede.roles.some(rol => rolesValidos.includes(rol.rol_nombre))
        );

        if (!sedeConRol) {
            Swal.fire({
                icon: "warning",
                text: "La persona no tiene el rol de Paciente, colaboradores(O) o Colaborador.",
            });
            return;
        }

        const rolSede = sedeConRol.roles.find(rol => rolesValidos.includes(rol.rol_nombre));
        const se_id = Number(sedeConRol.se_id);
        const rol_id = Number(rolSede.rol_id);

        const confirmacion = await Swal.fire({
            text: `Se inactivará el rol ${rolSede.rol_nombre}. ¿Deseas continuar?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        const resultado = await inactivarRolesSede({ per_id: perId, se_id, rol_id });

        if (resultado.success) {
            Swal.fire({
                icon: "success",
                text: resultado.message || "Rol inactivado exitosamente"
            });

            setColaboradores(prev => prev.map(colab => {
                if (colab.per_id === persona.per_id) {
                    return {
                        ...colab,
                        activoSede: false // O lo que uses para mostrar su estado
                    };
                }
                return colab;
            }));

        } else {
            Swal.fire({
                icon: "error",
                text: resultado.message || "No se pudo inactivar el rol"
            });
        }
    };


    // Validar antes de usar filter
    const filteredColaboradores = Array.isArray(colaboradores)
        ? colaboradores.filter((colaborador) =>
            (colaborador?.per_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
            (colaborador?.per_documento || "").includes(search)
        )
        : [];

    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content-area" style={{ backgroundColor: geriatrico?.color_principal }}>
                <div className="gestionar">
                    <h2 className="gestionar-title">Colaboradores</h2>
                    <button className="gestionar-btn" onClick={() => setShowRegisterColaborador(true)}>
                        Agregar Colaborador
                    </button>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input-field"
                        placeholder="Buscar por nombre o documento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {loading ? (
                    <LoadingComponet />
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <PersonListColaborador
                        activeCard={activeCard}
                        colaboradoresFiltrados={filteredColaboradores}
                        handleCardClick={handleCardClick}
                        handleInactivarColaborador={handleInactivarRolesSede}
                        roles={roles}
                    />
                )}
            </div>
            {showRegisterColaborador && (
                <ModalRegisterColaborador
                    onClose={() => setShowRegisterColaborador(false)}
                    setColaboradores={ setColaboradores }
                />
            )}
        </div>
    );
};
