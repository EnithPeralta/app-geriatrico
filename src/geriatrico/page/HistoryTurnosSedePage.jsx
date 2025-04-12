import React, { useEffect, useState } from 'react';
import { useEnfermera, useGeriatrico, useTurnos } from '../../hooks';
import { useParams } from 'react-router-dom';
import { FaFileMedical } from 'react-icons/fa';

export const HistoryTurnosSedePage = () => {
    const { id } = useParams();
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerEnfermerasSede } = useEnfermera();
    const { verTurnosSedeHistorialEnfermera } = useTurnos();
    const [turnosHistorial, setTurnosHistorial] = useState([]);
    const [turnosOriginales, setTurnosOriginales] = useState([]);
    const [geriatrico, setGeriatrico] = useState(null);
    const [enfermeras, setEnfermeras] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedEnfermera, setSelectedEnfermera] = useState(null);
    const [activeTab, setActiveTab] = useState("");
    const [activeTurno, setActiveTurno] = useState("");





    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sedeResult, enfermerasResult] = await Promise.all([
                    homeMiGeriatrico(),
                    obtenerEnfermerasSede(),
                ]);

                if (sedeResult?.success) setGeriatrico(sedeResult.geriatrico);
                if (enfermerasResult?.success && Array.isArray(enfermerasResult.data)) {
                    setEnfermeras(enfermerasResult.data);
                } else {
                    setError(enfermerasResult.message || "No se encontraron enfermeras.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            }
        };

        fetchData();
    }, []);

    const handleVerTurnos = async (enfermera) => {
        try {
            const result = await verTurnosSedeHistorialEnfermera(enfermera.enf_id);
            console.log(result);
            if (result.success && result.turnos) {
                // Convertir el objeto en un array de turnos
                const turnosArray = Object.entries(result.turnos).flatMap(([fecha, turnos]) => 
                    turnos.map(t => ({ ...t, fecha_inicio: fecha })) // Aseguras que cada turno tenga su fecha asociada
                  );
                  
                setTurnosHistorial(turnosArray);
                setTurnosOriginales(turnosArray);
                setSelectedEnfermera(enfermera);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error al obtener el historial de turnos en la sede:", error);
        }
    };

    const handleFechaChange = (event, fecha_inicio) => {
        event.stopPropagation();

        if (activeTurno === fecha_inicio) {
            // Si se hace clic en la misma fecha activa, restablecer el historial original
            setTurnosHistorial(turnosOriginales);
            setActiveTurno("");
            setActiveTab("");
        } else {
            setActiveTurno(fecha_inicio);
            const historialFiltrado = turnosOriginales.filter(turno => turno.fecha_inicio === fecha_inicio);
            setTurnosHistorial(historialFiltrado);
            setActiveTab(fecha_inicio);
        }
    };

    const fechasUnicas = [...new Set(turnosOriginales.map(turno => turno.fecha_inicio))];




    const enfermerasFiltradas = enfermeras.filter((enfermera) =>
        (enfermera?.per_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (enfermera?.per_documento || "").includes(search)
    );


    return (
        <div className="main-container">
            <div className="content">
                <h2 className='h1'><FaFileMedical /> Historial De Turnos</h2>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input-field"
                        placeholder="Buscar por nombre o documento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="turnos-container-sede">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Enfermera</th>
                                <th>Cédula</th>
                                <th>Código</th>
                                <th>Ver Historial</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enfermerasFiltradas.map((e, index) => (
                                <tr key={index}>
                                    <td>{e.activoSede ? "Activo" : "Inactivo"}</td>
                                    <td>{e.per_nombre}</td>
                                    <td>{e.per_documento}</td>
                                    <td>{e.enf_codigo}</td>
                                    <td>
                                        <button title='Ver Historial' className="btn" onClick={() => handleVerTurnos(e)}>
                                            <FaFileMedical />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="h4">Historial de Turnos - {selectedEnfermera?.per_nombre}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                            {/* <button onClick={() => {
                                setTurnosHistorial(turnosOriginales);
                                setActiveTurno("");
                            }} className="btn-reset">
                                Restablecer
                            </button> */}
                        </div>
                        <div className="tabs-container">
                            <div className="geriatrico-tabs">
                                {fechasUnicas.map((fecha, index) => (
                                    <button
                                        key={index}
                                        className={`geriatrico-tab ${activeTurno === fecha ? "active" : ""}`}
                                        onClick={(event) => handleFechaChange(event, fecha)}>
                                        {fecha}
                                    </button>
                                ))}
                            </div>

                            <div className="geriatrico-tab-content">
                                {activeTab ? (
                                    turnosHistorial.length > 0 ? (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Fecha Inicio</th>
                                                    <th>Hora Inicio</th>
                                                    <th>Fecha Fin</th>
                                                    <th>Hora Fin</th>
                                                    <th>Total Horas</th>
                                                    <th>Tipo Turno</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {turnosHistorial.map((turno, i) => (
                                                    <tr key={i}>
                                                        <td>{turno.fecha_inicio}</td>
                                                        <td>{turno.hora_inicio}</td>
                                                        <td>{turno.fecha_fin}</td>
                                                        <td>{turno.hora_fin}</td>
                                                        <td>{turno.total_horas_turno}</td>
                                                        <td>{turno.tipo_turno}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-center text-muted">No tiene historial de turnos.</p>
                                    )
                                ) : (
                                    <p className="text-center text-muted">Seleccione una fecha para ver los turnos.</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
