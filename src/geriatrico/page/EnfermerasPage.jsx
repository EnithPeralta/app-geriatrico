import { useEffect, useState } from "react";
import { useEnfermera, useGeriatrico, useGeriatricoPersona, useSedesRol } from "../../hooks";
import { LoadingComponet, SideBarComponent } from "../../components";
import { ModalRegisterEnfermera } from "../components/Enfermeras/ModalRegisterEnfermera";
import Swal from "sweetalert2";
import { PersonListEnfermera } from "../components/Enfermeras/PersonListEnfermera";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/Socket";


export const EnfermerasPage = () => {
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerEnfermerasSede, obtenerRolesEnfermerasSede } = useEnfermera();
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { inactivarRolesSede } = useSedesRol();
    const [enfermeras, setEnfermeras] = useState([]);
    const [geriatrico, setGeriatrico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [activeCard, setActiveCard] = useState(null);
    const [roles, setRoles] = useState({ rolesGeriatrico: [], rolesSede: [] });
    const navigate = useNavigate();



    const [showRegisterEnfermera, setShowRegisterEnfermera] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sedeResult, enfermerasResult] = await Promise.all([
                    homeMiGeriatrico(),
                    obtenerEnfermerasSede(),
                ]);

                if (sedeResult?.success) {
                    setGeriatrico(sedeResult.geriatrico);
                }

                if (enfermerasResult?.success && Array.isArray(enfermerasResult.data)) {
                    setEnfermeras(enfermerasResult.data);
                } else {
                    setError(enfermerasResult.message || "No se encontraron enfermeras.");
                }

            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleEnfermeraRegistrado = ({ enfermera }) => {
            setEnfermeras(prev => {
                const existe = prev.some(p => p.per_id === enfermera.per_id);
                if (!existe) {
                    return [enfermera, ...prev];
                }
                return prev.map(p =>
                    p.per_id === enfermera.per_id ? { ...p, ...enfermera } : p
                );
            });
        };

        socket.on("enfermeraRegistrada", handleEnfermeraRegistrado);

        return () => {
            socket.off("enfermeraRegistrada", handleEnfermeraRegistrado);
        };
    }, []);

    const handleCardClick = async (enfermera) => {

        const isActive = activeCard === enfermera.per_id ? null : enfermera.per_id;
        setActiveCard(isActive);

        if (isActive) {
            try {
                const response = await obtenerRolesEnfermerasSede(enfermera.per_id);

                if (response.success) {
                    setRoles({
                        rolesSede: response.data || [],
                    });
                } else {
                    throw new Error(response.message || "Error al obtener los roles.");
                }
            } catch (error) {
                console.error("Error al obtener roles:", error);
                Swal.fire({
                    icon: "error",
                    text: error.message || "Error al obtener los roles.",
                });
            }
        }
    };
    const handleInactivarRolesSede = async (persona) => {

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


        // Obtener los roles de la persona
        const response = await obtenerPersonaRolesMiGeriatricoSede(perId);

        if (!response.success || !response.data?.persona?.sedes) {
            console.error("❌ Error al obtener los roles o la persona no tiene sedes.");
            Swal.fire({
                icon: "warning",
                text: "No se pudieron obtener los roles de la persona.",
            });
            return;
        }


        // Buscar el rol correcto en las sedes
        const rolesValidos = ["enfermera", "Enfermera(o)", "Colaborador"];
        const sedeConRol = response.data.persona.sedes.find(sede =>
            sede.roles.some(rol => rolesValidos.includes(rol.rol_nombre))
        );

        if (!sedeConRol) {
            console.warn("⚠️ La persona no tiene el rol de enfermera, Enfermera(O) o Colaborador.");
            Swal.fire({
                icon: "warning",
                text: "La persona no tiene el rol de enfermera, Enfermera(O) o Colaborador.",
            });
            return;
        }

        const rolSede = sedeConRol.roles.find(rol => rolesValidos.includes(rol.rol_nombre));

        if (!rolSede || !sedeConRol.se_id) {
            console.warn("⚠️ Faltan datos del rol o sede.", rolSede, sedeConRol);
            return;
        }


        const se_id = Number(sedeConRol.se_id);
        const rol_id = Number(rolSede.rol_id);

        if ([perId, se_id, rol_id].some(isNaN) || perId <= 0 || se_id <= 0 || rol_id <= 0) {
            console.error("❌ Error: Uno o más valores no son números válidos:", { perId, se_id, rol_id });
            return;
        }

        // Confirmación del usuario
        const confirmacion = await Swal.fire({
            text: `Se inactivará el rol ${rolSede.rol_nombre}. ¿Deseas continuar?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        // Llamar a la función para inactivar el rol
        const resultado = await inactivarRolesSede({ per_id: perId, se_id, rol_id });

        if (resultado.success) {
            Swal.fire({
                icon: "success",
                text: resultado.message || "Rol inactivado exitosamente"
            });

            setEnfermeras((prev) => {
                const updatedEnfermeras = prev.map(enfermera =>
                    enfermera.per_id === persona.per_id
                        ? { ...enfermera, activoSede: false }  
                        : enfermera
                );
                return updatedEnfermeras;
            });


        } else {
            Swal.fire({
                icon: "error",
                text: resultado.message || "No se pudo inactivar el rol"
            });
        }
    };

    const enfermerasFiltradas = (enfermeras || []).filter((enfermera) =>
        (enfermera?.per_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (enfermera?.per_documento || "").includes(search)
    );
    


    const handleCloseModal = async (nuevaEnfermera) => {
        setShowRegisterEnfermera(false);
    
        if (nuevaEnfermera) {
            try {
                const enfermerasResult = await obtenerEnfermerasSede();
                if (enfermerasResult?.success) {
                    setEnfermeras(enfermerasResult.data);
                }
            } catch (error) {
                console.error("Error actualizando lista de enfermeras", error);
            }
        }
    };
    

    const handleCrearTurno = (enfermera) => {
        console.log("Enfermera seleccionado:", enfermera.enf_id);
        navigate(`/geriatrico/crearTurno/${enfermera.enf_id}`);

    };

    return (
        <div className="main-container" >
            <SideBarComponent />
            <div className="content-area" style={{ backgroundColor: geriatrico?.color_principal }}>
                <div className="gestionar">
                    <h2 className="gestionar-title">Enfermeras</h2>
                    <button className="gestionar-btn" onClick={() => setShowRegisterEnfermera(true)}>
                        Agregar Enfermera
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
                    <PersonListEnfermera
                        enfermerasFiltradas={enfermerasFiltradas}
                        activeCard={activeCard}
                        handleCardClick={handleCardClick}
                        handleInactivarEnfermera={handleInactivarRolesSede}
                        handleCrearTurno={handleCrearTurno}
                        roles={roles}
                    />
                )}
            </div>
            {showRegisterEnfermera && (
                <ModalRegisterEnfermera
                    geriatrico={geriatrico}
                    onClose={handleCloseModal}
                    setEnfermeras={setEnfermeras}
                />
            )}
        </div>
    );
};