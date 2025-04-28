import { useEffect, useState } from "react";
import { useGeriatrico, usePaciente } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { LoadingComponet, SideBarComponent } from "../../components";
import { ModalRegistrarPaciente } from "../components/Paciente/ModalRegistrarPaciente";
import socket from "../../utils/Socket";


export const PacientesPage = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [geriatrico, setGeriatrico] = useState(null);
    const { obtenerDetallePacienteSede, obtenerPacientesSede } = usePaciente();
    const { homeMiGeriatrico } = useGeriatrico();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [showRegisterPaciente, setShowRegisterPaciente] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sedeResult, pacientesResult] = await Promise.all([
                    homeMiGeriatrico(),
                    obtenerPacientesSede()
                ]);

                if (sedeResult.success) {
                    setGeriatrico(sedeResult.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }

                if (pacientesResult.success) {
                    setPacientes(pacientesResult.data);
                } else {
                    setError(pacientesResult.message);
                }
            } catch (error) {
                setError(error.message || "Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handlePacienteRegistrado = ({ paciente }) => {
            setPacientes(prev => {
                const existe = prev.some(p => p.per_id === paciente.per_id);
                if (!existe) {
                    return [paciente, ...prev];
                }
                return prev.map(p =>
                    p.per_id === paciente.per_id ? { ...p, ...paciente } : p
                );
            });
        };

        socket.on("pacienteRegistrado", handlePacienteRegistrado);

        return () => {
            socket.off("pacienteRegistrado", handlePacienteRegistrado);
        };
    }, []);




    const handleVerDetalle = async (per_id) => {
        try {
            const response = await obtenerDetallePacienteSede(per_id);
            console.log("📡 Respuesta de la API:", response);
            navigate(`/geriatrico/pacienteEspecifico/${per_id}`);
        } catch (error) {
            setError("Error al obtener el detalle del paciente.");
        }
    };

    const pacientesFiltrados = pacientes.filter((paciente) =>
        (paciente?.per_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (paciente?.per_documento || "").includes(search)
    );

    return (
        <div className="main-container" >
            <SideBarComponent />
            <div className="content-area" style={{ backgroundColor: geriatrico?.color_principal }}>
                <div className="gestionar">

                    <h2 className="gestionar-title">Pacientes</h2>
                    <button className="gestionar-btn" onClick={() => setShowRegisterPaciente(true)}>
                        Agregar Paciente
                    </button>
                </div>
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
                    <p className="error-message">{error}</p>
                ) : pacientesFiltrados.length > 0 ? (
                    pacientesFiltrados.map((paciente) => (
                        <div key={paciente.per_id} className="user-card-container">
                            <div className="status-icon-person">
                                {paciente.activoSede ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <div className="user-details" onClick={() => handleVerDetalle(paciente.per_id)}>
                                <div className="user-role">{paciente.per_nombre}</div>
                                <div className="user-name">{paciente.per_documento}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="error-message">No se encontraron pacientes.</p>
                )}
            </div>
            {showRegisterPaciente &&
                <ModalRegistrarPaciente
                    onClose={() => setShowRegisterPaciente(false)}
                    setPaciente={setPacientes}
                    datosIniciales={{}}
                />}
        </div>
    );
};
