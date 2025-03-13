import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin.css";
import { usePersona } from "../../hooks/usePersona";
import { AdminLayout } from "../layout/AdminLayout";

export const AdminSuperPage = () => {
    const { getAuthenticatedPersona } = usePersona();
    const navigate = useNavigate();
    const [persona, setPersona] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Evita cambios en estado si el componente se desmonta

        const fetchPersona = async () => {
            try {
                const result = await getAuthenticatedPersona();
                if (isMounted) {
                    setPersona(result.success ? result.persona : null);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error.message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPersona();

        return () => {
            isMounted = false; // Evita que el estado se actualice en un componente desmontado
        };
    }, []); // 🔹 Se ejecuta solo una vez al montar el componente

    return (
        <AdminLayout persona={persona} loading={loading}>
            {/* Hero Text */}
            <div className="hero-text">
                <h1 className="hero-title">
                    FUNDACION AÑOS MARAVILLOS</h1>
                <p className="hero-description">La Fundación Mis Años Maravillosos Cali,
                    nace para ofrecer a todos los adultos mayores paz,
                    tranquilidad, amor y calidad de vida,
                    sin olvidar las actividades del día a día.</p>
            </div>

            {/* Cards Section */}
            <div className="cards-section">
                <div className="building-card">
                    <div className="building-content">
                        <h2 className="building-title">Dedicamos cada día a brindar cuidado, protección y amor.</h2>
                        <div className="buttons-group">
                            <button className="button button-outline" onClick={() => navigate("/geriatrico/geriatrico")}>
                                <i className="fa-solid fa-plus"></i> Crear Geriátrico
                            </button>
                            <button className="button button-filled" onClick={() => navigate("/geriatrico/roles")}>
                                <i className="fa-solid fa-plus"></i> Crear Roles
                            </button>
                        </div>
                    </div>
                    <img className="building-image" src="/building-sin-fondo.png" alt="Edificio" />
                </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3 className="stat-title">Personas Registradas</h3>
                        </div>
                        <button className="add-button" onClick={() => navigate("/register")}>
                            <i className="fa-solid fa-plus i"></i> Agregar
                        </button>
                    </div>

                    <div className="stat2-card">
                        <div className="stat-info">
                            <h3 className="stat-title">Administrar Roles</h3>
                        </div>
                        <div className="button-group">
                            <button className="add2-button" onClick={() => navigate("/geriatrico/asignar")}>
                                <i className="fa-solid fa-plus i"></i> Agregar
                            </button>
                        </div>
                </div>
            </div>
        </AdminLayout>
    );
};
