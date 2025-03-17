import React, { useEffect, useState } from 'react';
import { useAcudiente, useGeriatrico } from '../../hooks';
import { SideBarComponent } from '../../components';
import { useNavigate } from 'react-router-dom';

export const AcudientePacientePage = () => {
    const { homeMiGeriatrico } = useGeriatrico();
    const { pacientesAcudienteActivo } = useAcudiente();
    const navigate = useNavigate();

    const [geriatrico, setGeriatrico] = useState(null);
    const [pacienteAcudiente, setPacienteAcudiente] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sedeResult, pacientesAcudiente] = await Promise.all([
                    homeMiGeriatrico(),
                    pacientesAcudienteActivo()
                ]);

                console.log("React", pacientesAcudiente);

                if (sedeResult?.success) {
                    setGeriatrico(sedeResult.geriatrico);
                }

                if (pacientesAcudiente?.success && Array.isArray(pacientesAcudiente.pacientes)) {
                    setPacienteAcudiente(pacientesAcudiente.pacientes);
                } else {
                    setError(pacientesAcudiente?.message || "No se encontraron pacientes.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleHistory = (pacienteId) => {
        navigate(`/geriatrico/historial/${pacienteId}`);
    };

    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <SideBarComponent />
                <div className="content-area" style={{ backgroundColor: geriatrico?.color_principal || '#ffffff' }}>
                    <h2 className="gestionar-title">Mis Pacientes</h2>

                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input-field"
                            placeholder="Buscar por nombre o documento..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {loading && <p>Cargando pacientes...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!loading && !error && pacienteAcudiente.length > 0 ? (
                        <div className="user-card-container">
                            {pacienteAcudiente
                                .filter((paciente) =>
                                    paciente.pac_nombre?.toLowerCase().includes(search.toLowerCase()) ||
                                    paciente.documento?.includes(search)
                                )
                                .map((paciente) => (
                                    <div key={paciente.pac_id} onClick={() => handleHistory(paciente.per_id_paciente)} >
                                        <div className="user-details" >
                                            <div className="user-role">{paciente.nombre}</div>
                                            <div className="user-id">{paciente.documento}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        !loading && !error && <p>No se encontraron pacientes.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
