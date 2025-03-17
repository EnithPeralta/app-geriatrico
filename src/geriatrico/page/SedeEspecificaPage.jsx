import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSede } from "../../hooks";
import { LoadingComponet, SideBarComponent } from "../../components";
import '../../css/sede.css';

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
        <div className="flex" style={{backgroundColor: geriatrico.colores.principal}}>
            <SideBarComponent />
            <div className="main-content">
                <span className="sede-name">{sede.se_nombre}</span>
                <div className="grid">
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/pacientes")}>
                        <div className="sede-title">Paciente</div>
                    </div>
                    <div className="grid-item-sede" onClick={() => navigate("/geriatrico/enfermeras")}>
                        <div className="sede-title">Enfermera(O)</div>
                    </div>
                    <div className="grid-item-sede">
                        <div className="sede-title">Colaborador</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
