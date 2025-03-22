import React, { useEffect, useState } from 'react';
import { useSeguimiento } from '../../hooks';
import { useParams } from 'react-router-dom';
import '../../css/history.css';
import { SideBarComponent } from '../../components';
import { FaCalendarDay, FaCameraRetro, FaClock, FaFileMedicalAlt, FaHandHolding, FaHandHoldingMedical, FaHeadSideCough, FaHeart, FaHeartbeat, FaLungs, FaNotesMedical, FaStethoscope, FaSyringe, FaThermometerHalf, FaWeight } from 'react-icons/fa';

export const HistorialPacientePage = () => {
    const { id } = useParams();
    const { obtenerHistorialSeguimientos } = useSeguimiento();
    const [historialSeguimiento, setHistorialSeguimiento] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const response = await obtenerHistorialSeguimientos(id);
                if (response.success) {
                    console.log("Historial obtenido:", response.data);
                    setHistorialSeguimiento(response.data);
                } else {
                    console.error("Error en la respuesta:", response.message);
                }
            } catch (error) {
                console.error("Error al obtener historial:", error);
            }
        };

        fetchHistorial();
    }, [id]); // Agregado id como dependencia

    const filteredHistorial = historialSeguimiento.filter(({ seg_fecha }) => {
        const fechaCompleta = new Date(seg_fecha).toISOString().split("T")[0];
        return fechaCompleta.includes(searchTerm);
    });

    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <SideBarComponent />
                <div className="content historial-content">
                    <div>
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
                                <div key={seg_id} className="daily-container">
                                    <h4 className="daily-title"><FaCalendarDay /> {seg_fecha}</h4>
                                    <div className="daily-card">
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

                                        {/* Tarjeta de línea de tiempo diaria */}
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
                                </div>
                            ))
                        ) : (
                            <p>No hay registros que coincidan con la búsqueda.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
