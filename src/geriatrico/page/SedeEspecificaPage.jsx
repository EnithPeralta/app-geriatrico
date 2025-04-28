import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSede } from "../../hooks";
import { LoadingComponet, SideBarComponent } from "../../components";
import '../../css/sede.css';
import { FaCapsules, FaMedkit, FaUser, FaUserCog, FaUserNurse, FaUsers } from "react-icons/fa";
import { SideBarLayout } from "../layout";

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

                const cachedSede = localStorage.getItem("sedeData");
                if (cachedSede) {
                    const { sede, geriatrico } = JSON.parse(cachedSede);
                    setSede(sede);
                    setGeriatrico(geriatrico);
                    setLoading(false);
                    return;
                }

                const result = await obtenerSedesHome();
                if (result.success && result.sede && result.geriatrico) {
                    setSede(result.sede);
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
        <SideBarLayout>
            <div className="content-area" style={{ backgroundColor: geriatrico.colores.principal }}>
                <div className="gestionar">
                    <span className="sede-name">{sede.se_nombre}</span>
                    <img src={sede.se_foto} alt="" className="" style={{ width: "200px", height: "100px", padding: "10px" }} />

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
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/colaboradores")}>
                        <div className="icon-container">
                            <FaUsers /> {/* Icono de colaboradores */}
                        </div>
                        <div className="sede-title">Colaborador</div>
                        <p className="role-description">Administra roles y tareas internas.</p>
                    </div>
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/gestionarPersonas")}>
                        <div className="icon-container">
                            <FaUserCog /> {/* Icono de colaboradores */}
                        </div>
                        <div className="sede-title">Gestionar Personas</div>
                        <p className="role-description">Accede a datos de las personas.</p>
                    </div>
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/medicamentos")}>
                        <div className="icon-container">
                            <FaMedkit /> {/* Icono de medicamentos */}
                        </div>
                        <div className="sede-title">Medicamento</div>
                        <p className="role-description">Administracion de medicamentos.</p>
                    </div>
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/inventarioSede")}>
                        <div className="icon-container">
                            <FaCapsules /> {/* Icono de medicamentos */}
                        </div>
                        <div className="sede-title">Inventario</div>
                        <p className="role-description">Administracion del inventario.</p>
                    </div>


                </div>
            </div>
        </SideBarLayout>
    );
};