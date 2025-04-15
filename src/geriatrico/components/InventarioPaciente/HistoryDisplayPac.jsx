import React, { useEffect, useState } from 'react'
import { useMovimientosStockPaciente } from '../../../hooks'

export const HistoryDisplayPac = ({ med_pac_id, onClose }) => {
    const { historialMovimientosMedicamentoPac } = useMovimientosStockPaciente();
    const [historial, setHistorial] = useState({ entradas: [], salidas: [] });
    const [activeFecha, setActiveFecha] = useState("");
    const [tipo, setTipo] = useState("");
    const [activeHistorial, setActiveHistorial] = useState("");


    useEffect(() => {
        const fetchHistoryPac = async () => {
            try {
                const response = await historialMovimientosMedicamentoPac(med_pac_id);
                if (response.success) {
                    setHistorial({
                        entradas: response.entrada || [],
                        salidas: response.salida || [],
                    });
                    console.log("✔️ Historial cargado:", response);
                } else {
                    console.error("⚠️ Error al obtener historial:", response.message);
                }
            } catch (err) {
                console.error("❌ Error inesperado:", err);
            }
        }
        fetchHistoryPac();
    }, [])

    // ✅ Extrae directamente la fecha en formato YYYY-MM-DD
    const soloFecha = (fechaStr) => fechaStr.split("T")[0];

    // ✅ Convierte YYYY-MM-DD → DD/MM/YYYY sin usar new Date()
    const formatearFechaLegible = (fechaISO) => {
        const [año, mes, dia] = fechaISO.split("-");
        return `${dia}/${mes}/${año}`;
    };

    // 📅 Extraer fechas únicas y legibles sin crear Date objects
    const fechasUnicas = [
        ...new Set([
            ...historial.entradas.map(e => soloFecha(e.fecha)),
            ...historial.salidas.map(s => soloFecha(s.fecha))
        ])
    ].map(fechaOriginal => ({
        original: fechaOriginal,
        legible: formatearFechaLegible(fechaOriginal)
    }));



    const handleFechaChange = (event, fecha) => {
        setActiveFecha(fecha);
        setActiveHistorial(fecha); // ✅ Marca el botón activo
        setTipo(""); // Reinicia el tipo al cambiar de fecha
    };

    const renderHistorial = () => {
        const renderTable = (data, tipo) => (
            <table className="table">
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>{tipo === "entrada" ? "Origen" : "Destino"}</th>
                        <th>Realizado por</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.cantidad}</td>
                            <td>{tipo === "entrada" ? item.origen : item.destino}</td>
                            <td>{item.realizado_por || "Sin información"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );

        if (tipo === "entrada") {
            const entradasFiltradas = historial.entradas.filter(
                e => soloFecha(e.fecha) === activeFecha
            );
            return entradasFiltradas.length > 0
                ? renderTable(entradasFiltradas, "entrada")
                : <p>No hay entradas para esta fecha.</p>;
        }

        if (tipo === "salida") {
            const salidasFiltradas = historial.salidas.filter(
                s => soloFecha(s.fecha) === activeFecha
            );
            return salidasFiltradas.length > 0
                ? renderTable(salidasFiltradas, "salida")
                : <p>No hay salidas para esta fecha.</p>;
        }

        return <p>Selecciona si deseas ver entradas o salidas.</p>;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className='h4'>Historial de Movimientos</h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                <div className="tabs-container">
                    {/* Fechas */}
                    <div className="geriatrico-tabs">
                        {fechasUnicas.map((fechaObj, index) => (
                            <button
                                key={index}
                                className={`geriatrico-tab ${activeHistorial === fechaObj.original ? "active" : ""}`}
                                onClick={(event) => handleFechaChange(event, fechaObj.original)}
                            >
                                {fechaObj.legible}
                            </button>
                        ))}
                    </div>

                    {/* Entradas/Salidas */}
                    {activeFecha && (
                        <div className="sede-tabs">
                            <button
                                className={`sede-tab ${tipo === "entrada" ? "active" : ""}`}
                                onClick={() => setTipo("entrada")}
                            >
                                Entradas
                            </button>
                            <button
                                className={`sede-tab ${tipo === "salida" ? "active" : ""}`}
                                onClick={() => setTipo("salida")}
                            >
                                Salidas
                            </button>
                        </div>
                    )}

                    {/* Tabla */}
                    <div className="table-container">
                        {activeFecha && renderHistorial()}
                    </div>
                </div>
            </div>
        </div>
    );
};
