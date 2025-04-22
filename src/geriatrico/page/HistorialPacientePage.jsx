import React, { useEffect, useState } from 'react';
import { useDiagnostico, useSeguimiento, useRecomendaciones, useDetalleAdministracionMedicamento, useFormulacionMedicamentos } from '../../hooks';
import { useParams } from 'react-router-dom';
import '../../css/history.css';
import { SideBarComponent } from '../../components';
import { FaBriefcaseMedical, FaCalendarDay, FaCameraRetro, FaFileMedicalAlt, FaHandHoldingMedical, FaHeartbeat, FaIdCard, FaIdCardAlt, FaLungs, FaNotesMedical, FaRuler, FaRulerVertical, FaStethoscope, FaSyringe, FaThermometerHalf, FaUserMd, FaUserNurse, FaWeight } from 'react-icons/fa';
import { Tabs } from '../../components/Tabs/Tabs';
import { FaMortarPestle, FaHistory } from 'react-icons/fa'; // Asegurando que estas importadas si las usas más tarde

export const HistorialPacientePage = () => {
    const { id } = useParams();
    const pac_id = parseInt(id);
    const { obtenerHistorialSeguimientos } = useSeguimiento();
    const { obtenerDiagnostico } = useDiagnostico();
    const { obtenerRecomendaciones } = useRecomendaciones();
    const { obtenerDetallesDeAdministracionPorFormula } = useDetalleAdministracionMedicamento();
    const { obtenerFormulacionesDelDia } = useFormulacionMedicamentos();
    const [historialSeguimiento, setHistorialSeguimiento] = useState([]);
    const [formulaciones, setFormulaciones] = useState([]);
    const [diagnostico, setDiagnostico] = useState(null);
    const [recomendacion, setRecomendacion] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const response = await obtenerHistorialSeguimientos(pac_id);
                if (response.success) {
                    console.log("Historial obtenido:", response.data);
                    setHistorialSeguimiento(response.data);
                } else {
                    console.error("Error en la respuesta:", response.message);
                }
            } catch (error) {
                console.error("Error al obtener historial:", error.response ? error.response.data : error.message);
            }
        };

        fetchHistorial();
    }, [id]);

    useEffect(() => {
        const fetchFormulaciones = async () => {
            const response = await obtenerFormulacionesDelDia(pac_id);
            console.log("Formulaciones obtenidas:", response);
            if (response.success) {
                setFormulaciones(response.data || []);
            }
        };
        fetchFormulaciones();
    }, [id]);

    useEffect(() => {
        const fetchRecomendacion = async () => {
            try {
                const response = await obtenerRecomendaciones(pac_id);
                if (response.success) {
                    setRecomendacion(Array.isArray(response.data) ? response.data : []);
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
                if (response.success) {
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

    const filteredHistorial = historialAplanado.filter(({ seg_fecha }) => {
        if (!seg_fecha) return false;
        return seg_fecha.includes(searchTerm);
    });

    const visibleHistorial = searchTerm
        ? filteredHistorial
        : historialAplanado.length > 0
            ? [historialAplanado[0]]
            : [];

    const handleTabClick = (index) => {
        if (index === 1) {
            navigate(`/geriatrico/historialPaciente/${pac_id}`);
        }
    };

    const renderRows = () => {

        return (formulaciones || [])
            .filter(f => {
                const nombre = f?.medicamentos_formulados?.med_nombre;
                return nombre && nombre.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .map((formulacion, index) => (
                <tr key={index}>
                    <td>{formulacion.medicamentos_formulados.med_nombre}</td>
                    <td>{formulacion.medicamentos_formulados.med_presentacion?.charAt(0).toUpperCase() + formulacion.medicamentos_formulados.med_presentacion?.slice(1).toLowerCase()}</td>
                    <td>{formulacion.admin_fecha_inicio}</td>
                    <td>{formulacion.admin_fecha_fin}</td>
                    <td>{formulacion.admin_hora}</td>
                    <td>{formulacion.admin_dosis_por_toma}</td>
                    <td>{formulacion.admin_tipo_cantidad?.charAt(0).toUpperCase() + formulacion.admin_tipo_cantidad?.slice(1).toLowerCase()}</td>
                    <td>{formulacion.admin_metodo}</td>
                    <td>{formulacion.admin_estado}</td>
                    <td>{formulacion.admin_total_dosis_periodo}</td>
                    <td>{formulacion.dosis_efectivamente_administradas?.detalle_numero_dosis ?? 'N/A'}</td>

                </tr>
            ));
    };

    const tabs = [
        {
            title: 'Historial',
            content: (
                <div>
                    <div className='gestionar'>
                        <h2 className='gestionar-title'>Historial de Seguimientos de Paciente</h2>
                        <input
                            type='text'
                            placeholder='Buscar por fecha (YYYY-MM-DD)'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='search-input'
                        />
                    </div>
                    {visibleHistorial.length > 0 ? (
                        visibleHistorial.map(({ seg_id, seg_fecha, seg_foto, seg_glicemia, seg_peso, seg_talla, seg_temp, otro, seg_fc, seg_fr, enfermera }) => (
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
                                                <FaRulerVertical className="metric-icon" />
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
                                            <div className="metric-item">
                                                <FaHeartbeat className="metric-icon" />
                                                <span className="metric-value">{seg_fc}</span>
                                                <span className="metric-label">Cardiaca</span>
                                            </div>
                                            <div className="metric-item">
                                                <FaLungs className="metric-icon" />
                                                <span className="metric-value">{seg_fr}</span>
                                                <span className="metric-label">Respiratoria</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="historial-card timeline-card">
                                        <h3 className='summary-title'><FaUserMd />Recomendaciones</h3>
                                        <div className="timeline-container">
                                            {recomendacion.length > 0 ? (
                                                recomendacion.map(({ rec_id, rec_otras, rec_fecha }) => (
                                                    <div key={rec_id} className="timeline-item">
                                                        <div className="timeline-marker"></div>
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
                                            )}
                                        </div>
                                    </div>
                                    <div className="historial-card report-card">
                                        <h3 className='summary-title'><FaFileMedicalAlt /> Diagnóstico</h3>
                                        {diagnostico && diagnostico.length > 0 ? (
                                            diagnostico.map(({ diag_id, diag_descripcion, diag_fecha }) => (
                                                <div key={diag_id}>
                                                    <div className="report-section">
                                                        <h4><FaCalendarDay /> Fecha</h4>
                                                        <p>{diag_fecha}</p>
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
                            </div>
                        ))
                    ) : (
                        <p>No hay registros que coincidan con la búsqueda.</p>
                    )}
                </div>
            ),
        },
        {
            title: 'Formulaciones',
            content: (
                <div>
                    <h2 className="gestionar-title">Formula diaria</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Presentación</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                                <th>Hora</th>
                                <th>Dosis</th>
                                <th>Tipo Cantidad</th>
                                <th>Método</th>
                                <th>Estado</th>
                                <th>Total Dosis</th>
                                <th>Dosis Administrada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows()}
                        </tbody>
                    </table>
                </div>
            ),
        }
    ];

    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <SideBarComponent />
                <div className="content historial-content">
                    <Tabs tabs={tabs} activeTab={0} onClick={handleTabClick} />
                </div>
            </div>
        </div>);
};
