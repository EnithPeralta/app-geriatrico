import { useEffect, useState } from "react";
import { useEnfermera, useGeriatrico } from "../../hooks";
import "../../css/paciente.css";
import { LoadingComponet, SideBarComponent } from "../../components";
import { ModalRegisterEnfermera } from "../components/Enfermeras/ModalRegisterEnfermera";

export const EnfermerasPage = () => {
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerRolesEnfermerasSede } = useEnfermera();
    const [enfermeras, setEnfermeras] = useState([]);
    const [geriatrico, setGeriatrico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showRegisterEnfermera, setShowRegisterEnfermera] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sedeResult, enfermerasResult] = await Promise.all([
                    homeMiGeriatrico(),
                    obtenerRolesEnfermerasSede()
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

    const enfermerasFiltradas = enfermeras.filter((enfermera) =>
        (enfermera?.per_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (enfermera?.per_documento || "").includes(search)
    );

    return (
        <div className="main-container" style={{ backgroundColor: geriatrico?.color_principal }}>
            <SideBarComponent />
            <div className="content-area">
                <div className='gestionar'>
                    <h2 className='gestionar-title'>Enfermeras</h2>
                    <button className='gestionar-btn' onClick={() => setShowRegisterEnfermera(true)}>
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
                ) : enfermerasFiltradas.length > 0 ? (
                    enfermerasFiltradas.map((enfermera) => (
                        <div key={enfermera.per_id} className="user-card-container">
                            <div className="status-icon-person">
                                {enfermera.activoSede ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <div className="user-details">
                                <div className="user-role">{enfermera.per_nombre}</div>
                                <div className="user-id">{enfermera.per_documento}</div>
                                <div className="user-name">{enfermera.enf_codigo}</div>

                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay enfermeras registradas.</p>
                )}
            </div>
            {showRegisterEnfermera && (
                <ModalRegisterEnfermera
                    geriatrico={geriatrico}
                    onClose={() => setShowRegisterEnfermera(false)}
                />
            )}
        </div>
    );
};
