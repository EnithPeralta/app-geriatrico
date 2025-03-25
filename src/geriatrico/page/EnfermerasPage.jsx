import { useEffect, useState } from "react";
import { useEnfermera, useGeriatrico, useGeriatricoPersona, useSedesRol } from "../../hooks";
import "../../css/paciente.css";
import { LoadingComponet, SideBarComponent } from "../../components";
import { ModalRegisterEnfermera } from "../components/Enfermeras/ModalRegisterEnfermera";
import Swal from "sweetalert2";
import { PersonListEnfermera } from "../components/Enfermeras/PersonListEnfermera";
import { useNavigate } from "react-router-dom";


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

    const handleCardClick = async (enfermera) => {
        console.log("Persona seleccionada:", enfermera);

        const isActive = activeCard === enfermera.per_id ? null : enfermera.per_id;
        console.log("ActiveCard antes:", activeCard, "ActiveCard despues:", isActive);
        setActiveCard(isActive);

        if (isActive) {
            try {
                const response = await obtenerRolesEnfermerasSede(enfermera.per_id);
                console.log("Respuesta de la API:", response);

                if (response.success) {
                    console.log("Roles obtenidos correctamente.", response);
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
            text: "Esta acción inactivará el rol de Enfermera(O).",
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

    const enfermerasFiltradas = enfermeras.filter((enfermera) =>
        (enfermera?.per_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (enfermera?.per_documento || "").includes(search)
    );

    const handleCrearTurno = (enfermera) => {
        console.log("Enfermera seleccionado:", enfermera.enf_id);
        navigate(`/geriatrico/crearTurno/${ enfermera.enf_id}`);

    };

    return (
        <div className="main-container" style={{ backgroundColor: geriatrico?.color_principal }}>
            <SideBarComponent />
            <div className="content-area">
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
                <ModalRegisterEnfermera geriatrico={geriatrico} onClose={() => setShowRegisterEnfermera(false)} />
            )}
        </div>
    );
};