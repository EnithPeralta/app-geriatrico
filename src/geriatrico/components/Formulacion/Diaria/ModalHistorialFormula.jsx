// import React, { useEffect, useState } from 'react';
// import { useDetalleAdministracionMedicamento } from '../../../../hooks';

// export const ModalHistorialFormula = ({ onClose, admin_id }) => {
//     const { obtenerDetallesDeAdministracionPorFormula } = useDetalleAdministracionMedicamento();
//     const [historial, setHistorial] = useState(null);
//     const [activeFecha, setActiveFecha] = useState("");

//     useEffect(() => {
//         const fetchHistory = async () => {
//             try {
//                 const response = await obtenerDetallesDeAdministracionPorFormula(admin_id);
//                 console.log("Administraciones obtenidas:", response);
//                 if (response.success) {
//                     setHistorial(response.data);
//                 } else {
//                     console.error("⚠️ Error al obtener administraciones:", response.message);
//                 }
//             } catch (error) {
//                 console.error("❌ Error al obtener administraciones:", error);
//             }
//         };

//         fetchHistory();
//     }, [admin_id]);

//     if (!historial) return null; // o un loading...

//     // Obtener fechas únicas
//     const fechasUnicas = [
//         ...new Set(historial.detalles_administracion.map(item => item.detalle_fecha))
//     ];

//     // Obtener formulaciones por fecha activa
//     const obtenerFormulaciones = () => {
//         if (!activeFecha) return [];
//         return historial.detalles_administracion.filter(item => item.detalle_fecha === activeFecha);
//     };

//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-geriatrico" onClick={(e) => e.stopPropagation()}>
//                 <div className="modal-header">
//                     <h4 className="h4">Historial de Formulación</h4>
//                     <button className="close-btn" onClick={onClose}>
//                         <i className="fa-solid fa-xmark" />
//                     </button>
//                 </div>

//                 <div className="tabs-container">
//                     <div className="geriatrico-tabs">
//                         {fechasUnicas.map((fecha, index) => (
//                             <button
//                                 key={index}
//                                 className={`geriatrico-tab ${activeFecha === fecha ? "active" : ""}`}
//                                 onClick={() => setActiveFecha(fecha)}
//                             >
//                                 {fecha}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {activeFecha && (
//                     <div>
//                         <table className="table">
//                             <thead>
//                                 <tr>
//                                     <th>Medicamento</th>
//                                     <th>Hora</th>
//                                     <th>Numero de dosis</th>
//                                     <th>Dosis por tomar</th>
//                                     <th>Observacion</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {obtenerFormulaciones().map((item, index) => (
//                                     <tr key={index}>
//                                         {/* Asegurarse de que el nombre del medicamento y dosis sean accesibles */}
//                                         <td>{historial.medicamentos_formulados?.med_nombre}</td>
//                                         <td>{item.detalle_hora}</td>
//                                         <td>{item.detalle_numero_dosis}</td>
//                                         <td>{historial.admin_dosis_por_toma}</td>
//                                         <td>{item.detalle_observaciones}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

import React, { useEffect, useState } from 'react';
import { useDetalleAdministracionMedicamento } from '../../../../hooks';

export const ModalHistorialFormula = ({ onClose, admin_id }) => {
    const { obtenerDetallesDeAdministracionPorFormula } = useDetalleAdministracionMedicamento();
    const [historial, setHistorial] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await obtenerDetallesDeAdministracionPorFormula(admin_id);
                console.log("Administraciones obtenidas:", response);
                if (response.success) {
                    setHistorial(response.data);
                } else {
                    console.error("⚠️ Error al obtener administraciones:", response.message);
                }
            } catch (error) {
                console.error("❌ Error al obtener administraciones:", error);
            }
        };

        fetchHistory();
    }, [admin_id]);

    if (!historial) return null; // o un loading...

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-geriatrico" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="h4">Historial de Formulación</h4>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Medicamento</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Numero de dosis</th>
                                <th>Dosis por tomar</th>
                                <th>Observacion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.detalles_administracion.map((item, index) => (
                                <tr key={index}>
                                    <td>{historial.medicamentos_formulados?.med_nombre}</td>
                                    <td>{item.detalle_fecha}</td>
                                    <td>{item.detalle_hora}</td>
                                    <td>{item.detalle_numero_dosis}</td>
                                    <td>{historial.admin_dosis_por_toma}</td>
                                    <td>{item.detalle_observaciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

