import React, { useEffect, useState } from 'react';
import { useFormulacionMedicamentos } from '../../../hooks';
import moment from 'moment';

export const HistoryFormulacion = ({ pac_id, onClose }) => {
    const { formulacionMedicamentoHistorial } = useFormulacionMedicamentos();
    const [history, setHistory] = useState({ suspendidas: [], completadas: [] });
    const [activeFecha, setActiveFecha] = useState("");
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await formulacionMedicamentoHistorial(pac_id);
                if (response.success) {
                    setHistory({
                        suspendidas: response.suspendidas || [],
                        completadas: response.completadas || [],
                    });
                }
            } catch (err) {
                console.error("❌ Error inesperado:", err);
            }
        };
        fetchHistory();
    }, [pac_id]);


    // ✅ Agrupamos las fechas teniendo en cuenta la fecha de suspensión
    const fechasUnicas = [
        ...new Set([
            ...history.completadas.map((c) => c.admin_fecha_inicio),
            ...history.suspendidas.map((s) => s.admin_fecha_suspension ?? s.admin_fecha_inicio),
        ]),
    ]
        .sort((a, b) => new Date(b) - new Date(a))
        .map((fecha) => ({
            original: fecha,
            legible: moment(fecha).format('DD/MM/YYYY'),
        }));

    // ✅ Obtener formulaciones según la fecha y el estado seleccionado
    const obtenerFormulaciones = () => {
        if (!activeFecha || !estadoSeleccionado) return [];

        if (estadoSeleccionado === 'Completado') {
            return history.completadas.filter(item => item.admin_fecha_inicio === activeFecha);
        } else {
            return history.suspendidas.filter(item =>
                (item.admin_fecha_suspension ?? item.admin_fecha_inicio) === activeFecha
            );
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-geriatrico" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h1>Historial de Formulación</h1>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                {/* Tabs de fechas */}
                <div className="tabs-container">
                    <div className="geriatrico-tabs">
                        {fechasUnicas.map((fechaObj, index) => (
                            <button
                                key={index}
                                className={`geriatrico-tab ${activeFecha === fechaObj.original ? "active" : ""}`}
                                onClick={() => {
                                    setActiveFecha(fechaObj.original);
                                    setEstadoSeleccionado(""); // Reiniciar estado al cambiar fecha
                                }}
                            >
                                {fechaObj.legible}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selección de estado */}
                {activeFecha && (
                    <div className="sede-tabs">
                        <button
                            className={`sede-tab ${estadoSeleccionado === "Completado" ? "active" : ""}`}
                            onClick={() => setEstadoSeleccionado("Completado")}
                        >
                            Completado
                        </button>
                        <button
                            className={`sede-tab ${estadoSeleccionado === "Suspendido" ? "active" : ""}`}
                            onClick={() => setEstadoSeleccionado("Suspendido")}
                        >
                            Suspendido
                        </button>
                    </div>
                )}

                {/* Tabla de resultados */}
                {estadoSeleccionado && (
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Presentación</th>
                                    <th>Dosis</th>
                                    <th>Cantidad</th>
                                    <th>Método</th>
                                    <th>Hora</th>
                                    {estadoSeleccionado === "Suspendido" && (
                                        <>
                                            <th>Fecha de suspensión</th>
                                            <th>Motivo</th>
                                            <th>Suspendido por</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {obtenerFormulaciones().map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.medicamentos_formulados?.med_nombre}</td>
                                        <td>{item.medicamentos_formulados?.med_presentacion?.charAt(0).toUpperCase() + item.medicamentos_formulados.med_presentacion?.slice(1).toLowerCase()}</td>
                                        <td>{item.admin_dosis_por_toma}</td>
                                        <td>{item.admin_tipo_cantidad?.charAt(0).toUpperCase() + item.admin_tipo_cantidad?.slice(1).toLowerCase()}</td>
                                        <td>{item.admin_metodo}</td>
                                        <td>{item.admin_hora}</td>
                                        {estadoSeleccionado === "Suspendido" && (
                                            <>
                                                <td>{item.admin_fecha_suspension ? moment(item.admin_fecha_suspension).format("DD/MM/YYYY") : "—"}</td>
                                                <td>{item.admin_motivo_suspension || "—"}</td>
                                                <td>{item.suspendido_por?.per_nombre_completo || "—"}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        {obtenerFormulaciones().length === 0 && (
                            <p>No hay formulaciones para esta fecha y estado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
