import React, { useEffect, useState } from 'react';
import { useAcudiente, usePaciente, useSeguimiento, useSession } from '../../hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingComponet, SideBarComponent } from '../../components';
import { PInformation } from '../layout';
import { FaCalendarDay, FaCameraRetro, FaClock, FaEdit, FaFileMedicalAlt, FaHandHoldingMedical, FaHeartbeat, FaLungs, FaNotesMedical, FaStethoscope, FaSyringe, FaThermometerHalf, FaUser, FaWeight } from 'react-icons/fa';
import { ModalActualizarSeguimiento } from '../components/Seguimiento/ModalActualizarSeguimiento';

export const HistorySeguimientoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session } = useSession();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerAcudientesDePaciente } = useAcudiente();
    const { obtenerHistorialSeguimientos } = useSeguimiento();

    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);
    const [historialSeguimiento, setHistorialSeguimiento] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await obtenerDetallePacienteSede(id);
                if (response.success) {
                    setPaciente(response.paciente);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener los datos del paciente.");
            }
        };
        fetchPaciente();
    }, [id]);

    useEffect(() => {
        if (!paciente?.pac_id) return;
        const fetchSeguimiento = async () => {
            try {
                const result = await obtenerHistorialSeguimientos(paciente.pac_id);
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
    }, [paciente]);


    const filteredHistorial = historialSeguimiento.filter(({ seg_fecha }) => {
        const fechaCompleta = new Date(seg_fecha).toISOString().split("T")[0];
        return fechaCompleta.includes(searchTerm);
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
                        filteredHistorial.map(({ seg_id, seg_fecha, seg_foto, seg_glicemia, seg_peso, seg_talla, seg_temp, otro }) => (
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
                                                <span className="metric-label">Glucemia</span>
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
                                        <h3 className='summary-title'><FaClock /> Informes del Día</h3>
                                        <div className="timeline-container">
                                        </div>
                                    </div>
                                    {/* Tarjeta de Informe Médico */}
                                    <div className="historial-card report-card">
                                        <h3 className='summary-title'><FaFileMedicalAlt /> Diagnostico</h3>
                                        <div className="report-section">
                                            <h4><FaStethoscope /> Observaciones</h4>
                                            {/* <p>{dailyData.informe.observaciones}</p> */}
                                        </div>
                                        <div className="report-section">
                                            <h4><FaNotesMedical /> Recomendaciones</h4>
                                            {/* <p>{dailyData.informe.recomendaciones}</p> */}
                                        </div>
                                        <div className="report-section">
                                            <h4><FaSyringe /> Medicación Prescrita</h4>
                                            {/* <ul>
                                                                                        {dailyData.informe.medicamentos.map((med, index) => (
                                                                                            <li key={index}><FontAwesomeIcon /> {med}</li>
                                                                                        ))}
                                                                                    </ul> */}
                                        </div>
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
                {showModal && <ModalActualizarSeguimiento id={selectedId} setShowModal={setShowModal} />}
            </div>
        </div>
    );
};