import React, { useEffect, useState } from 'react';
import { useAcudiente, useDiagnostico, usePaciente, useRecomendaciones, useSeguimiento, useSession } from '../../hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingComponet, SideBarComponent } from '../../components';
import { PInformation } from '../layout';
import { FaBriefcaseMedical, FaCalendarDay, FaCameraRetro, FaClock, FaEdit, FaFileMedicalAlt, FaHandHoldingMedical, FaHeartbeat, FaLungs, FaNotesMedical, FaStethoscope, FaSyringe, FaThermometerHalf, FaUser, FaUserMd, FaUserNurse, FaWeight } from 'react-icons/fa';
import { ModalActualizarSeguimiento } from '../components/Seguimiento/ModalActualizarSeguimiento';

export const HistorySeguimientoPage = () => {
    const { id } = useParams();
    const pac_id = parseInt(id);
    const navigate = useNavigate();
    const { session } = useSession();
    const { obtenerAcudientesDePaciente } = useAcudiente();
    const { obtenerHistorialSeguimientos } = useSeguimiento();
    const { obtenerDiagnostico } = useDiagnostico();
    const { obtenerRecomendaciones } = useRecomendaciones();

    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);
    const [historialSeguimiento, setHistorialSeguimiento] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [diagnostico, setDiagnostico] = useState(null);
    const [recomendacion, setRecomendacion] = useState(null);




    useEffect(() => {
        const fetchSeguimiento = async () => {
            try {
                const result = await obtenerHistorialSeguimientos(id);
                console.log(result);
                if (result.success) {
                    setHistorialSeguimiento(result.data);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError("Error al obtener el historial de seguimientos.");
            }
        };
        fetchSeguimiento();
    }, [id]);

    useEffect(() => {
        const fetchRecomendacion = async () => {
            try {
                const response = await obtenerRecomendaciones(pac_id);
                console.log("Recomendaciones obtenidas:", response);
                if (response.success) {
                    // Si `data` es un objeto, lo convertimos en un array para evitar problemas con map()
                    setRecomendacion(Array.isArray(response.data) ? response.data : [response.data]);
                } else {
                    console.error(response.message);
                }
            } catch (err) {
                console.error("Error al obtener las recomendaciones.");
            }
        };
        fetchRecomendacion();
    }, [id]);

    useEffect(() => {
        const fetchDiagnostico = async () => {
            try {
                const response = await obtenerDiagnostico(pac_id);
                console.log("Diagnóstico obtenido:", response);
                if (response.success) {
                    // Si `data` es un objeto, lo convertimos en un array para evitar problemas con map()
                    setDiagnostico(Array.isArray(response.data) ? response.data : [response.data]);
                } else {
                    console.error(response.message);
                }
            } catch (err) {
                console.error("Error al obtener el diagnóstico.");
            }
        };
        fetchDiagnostico();
    }, [id]);



    const historialAplanado = historialSeguimiento.flatMap(item => item.seguimientos);

    // Filtramos por la fecha ingresada en el searchTerm
    const filteredHistorial = historialAplanado.filter(({ seg_fecha }) => {
        if (!seg_fecha) return false; // Evita errores si es undefined
        return seg_fecha.includes(searchTerm);
    });

    const handleAcudiente = async () => {
        if (!paciente?.pac_id) return;
        try {
            await obtenerAcudientesDePaciente(paciente.pac_id);
            navigate(`/geriatrico/acudiente/${paciente.pac_id}`);
        } catch {
            setError("Error al obtener el detalle del paciente.");
        }
    };

    return (
        <div className='animate__animated animate__fadeIn animate__faster'>
            <div className='main-container'>
                <SideBarComponent />
                <div className='content'>
                    {session?.rol_id === 6 && <PInformation persona={paciente} onEdit={handleAcudiente} />}
                    <div className='gestionar'>
                        <h2 className='gestionar-title'>Historial de Seguimientos</h2>
                        <input
                            type='text'
                            placeholder='Buscar por fecha (YYYY-MM-DD)'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='search-input'
                        />
                    </div>
                    {filteredHistorial.length > 0 ? (
                        filteredHistorial.map(({ seg_id, seg_fecha, seg_foto, seg_glicemia, seg_peso, seg_talla, seg_temp, otro, enfermera }) => (
                            <div key={seg_id} className='daily-container'>
                                <h4 className="daily-title"><FaCalendarDay /> {seg_fecha}</h4>
                                <div className='daily-card'>
                                    <div className="historial-card summary-card">
                                        <h3 className="summary-title"><FaCameraRetro /> Foto de Seguimiento</h3>
                                        {seg_foto ? (
                                            <img src={seg_foto} alt="Foto de seguimiento" className="foto-seguimiento" />
                                        ) : (
                                            <div className="profile-icon">
                                                <i className="fas fa-user-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="historial-card summary-card">
                                        <h3 className="summary-title"><FaHeartbeat /> Resumen del Día</h3>
                                        <div className="metrics-grid summary-grid">
                                            <div className="metric-item">
                                                <FaWeight className="metric-icon" />
                                                <span className="metric-value">{seg_peso}</span>
                                                <span className="metric-label">Peso</span>
                                            </div>
                                            <div className="metric-item">
                                                <FaHandHoldingMedical className="metric-icon" />
                                                <span className="metric-value">{seg_glicemia}</span>
                                                <span className="metric-label">Glicemia</span>
                                            </div>
                                            <div className="metric-item">
                                                <FaLungs className="metric-icon" />
                                                <span className="metric-value">{seg_talla}</span>
                                                <span className="metric-label">Talla</span>
                                            </div>
                                            <div className="metric-item">
                                                <FaFileMedicalAlt className="metric-icon" />
                                                <span className="metric-value">{otro}</span>
                                                <span className="metric-label">Otros</span>
                                            </div>
                                            <div className="metric-item">
                                                <FaThermometerHalf className="metric-icon" />
                                                <span className="metric-value">{seg_temp}</span>
                                                <span className="metric-label">Temperatura</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="historial-card timeline-card">
                                        <h3 className='summary-title'><FaUserMd />Recomendaciones</h3>
                                        <div className="timeline-container">

                                            {recomendacion && recomendacion.length > 0 ? (
                                                recomendacion.map(({ rec_id, rec_otras, rec_fecha }) => (
                                                    <div key={rec_id} className="timeline-item">
                                                        <div className="timeline-marker">
                                                        </div>
                                                        <div className="timeline-content">
                                                            <div className="timeline-header">
                                                                <span className="timeline-hour">{rec_fecha}</span>
                                                            </div>
                                                            <p className="timeline-detail">{rec_otras}</p>

                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No hay recomendaciones registradas.</p>
                                            )
                                            }
                                        </div>
                                    </div>
                                    {/* Tarjeta de Informe Médico */}
                                    <div className="historial-card report-card">
                                        <h3 className='summary-title'><FaFileMedicalAlt /> Diagnóstico</h3>
                                        {diagnostico && diagnostico.length > 0 ? (
                                            diagnostico.map(({ diag_id, diag_descripcion, diag_fecha
                                            }) => (
                                                <div key={diag_id} >
                                                    <div className="report-section">
                                                        <h4><FaCalendarDay /> Fecha</h4>
                                                        <p>{diag_fecha
                                                        }</p>
                                                    </div>
                                                    <div className="report-section">
                                                        <h4><FaBriefcaseMedical /> Descripcion</h4>
                                                        <p>{diag_descripcion}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay diagnóstico registrado.</p>
                                        )}
                                    </div>
                                </div>
                                <div className='button-container'>
                                    <button className='save-button' onClick={() => { setSelectedId(seg_id); setShowModal(true); }}>
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <LoadingComponet />
                    )}
                </div>
                {showModal &&
                    <ModalActualizarSeguimiento
                        id={selectedId}
                        setHistorialSeguimiento={setHistorialSeguimiento}
                        setShowModal={setShowModal}
                    />}
            </div>
        </div>
    );
};