import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSede } from "../../hooks";
import { LoadingComponet, SideBarComponent } from "../../components";
import '../../css/sede.css';
import { FaUser, FaUserNurse, FaUsers } from "react-icons/fa";

export const SedeEspecificaPage = () => {
    const { obtenerSedesHome } = useSede();
    const [sede, setSede] = useState(null);
    const [geriatrico, setGeriatrico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSede = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await obtenerSedesHome();
                console.log("📡 Respuesta de la API:", result);

                if (result.success && result.sede && result.geriatrico) {
                    console.log()
                    setSede(result.sede);  // Aseguramos que `sede` es un objeto válido
                    setGeriatrico(result.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchSede();
    }, []);

    if (loading) {
        return <LoadingComponet />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!sede) {
        return <p>No se encontraron datos de la sede.</p>;
    }

    return (
        <div className="flex" style={{ backgroundColor: geriatrico.colores.principal }}>
            <SideBarComponent />
            <div className="main-content">
                <div className="gestionar">
                    <span className="sede-name">{sede.se_nombre}</span>
                    <img src={sede.se_foto} alt="" className="" style={{ width: "90px", height: "90px", padding: "10px" }} />

                </div>
                <div className="grid">
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/pacientes")}>
                        <div className="icon-container">
                            <FaUser /> {/* Icono de usuario */}
                        </div>
                        <div className="sede-title">Paciente</div>
                        <p className="role-description">Gestiona información de los pacientes.</p>
                    </div>
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/enfermeras")}>
                        <div className="icon-container">
                            <FaUserNurse /> {/* Icono de enfermera */}
                        </div>
                        <div className="sede-title">Enfermera(O)</div>
                        <p className="role-description">Accede a datos de atención médica.</p>
                    </div>
                    <div className="grid-item-sede">
                        <div className="icon-container">
                            <FaUsers /> {/* Icono de colaboradores */}
                        </div>
                        <div className="sede-title">Colaborador</div>
                        <p className="role-description">Administra roles y tareas internas.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
