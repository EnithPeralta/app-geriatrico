import React, { useEffect, useState } from "react";
import { SideBarComponent } from "../../components";
import "../../css/inventario.css";
import { FaBriefcaseMedical, FaHistory, FaMedkit, FaMinus } from "react-icons/fa";
import { useGeriatrico, useInventarioSede, useSession } from "../../hooks";
import socket from "../../utils/Socket";
import { ModalStockMedicamento, HistoryDisplay, ModalInventarioSede, ModalSalidaStock } from "../components/InventarioSed";
export const InventarioSedePage = () => {
    const { obtenerMedicamentosSede } = useInventarioSede();
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerSesion, session } = useSession();

    const [isModalVincular, setIsModalVincular] = useState(false);
    const [isModalSalidaStock, setIsModalSalidaStock] = useState(false);
    const [isModalHistorial, setIsModalHistorial] = useState(false);

    const [medicamentos, setMedicamentos] = useState([]);
    const [geriatrico, setGeriatrico] = useState(null);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        obtenerSesion();
        const fetchData = async () => {
            try {
                const [sedeResult, medicamentoResult] = await Promise.all([
                    homeMiGeriatrico(),
                    obtenerMedicamentosSede()
                ]);

                if (sedeResult.success) {
                    setGeriatrico(sedeResult.geriatrico);
                } else {
                    console.error("No se encontraron datos de la sede.");
                }

                if (medicamentoResult.success) {
                    setMedicamentos(medicamentoResult.data);
                } else {
                    console.error(medicamentoResult.message);
                }
            } catch (error) {
                console.error(error.message || "Error al obtener los datos.");
            }
        };

        fetchData();

        const handleStockActualizado = ({ med_sede_id, nuevoStock }) => {
            setMedicamentos(prev =>
                prev.map(med =>
                    med.med_sede_id === med_sede_id
                        ? { ...med, med_total_unidades_disponibles: nuevoStock }
                        : med
                )
            );
        };

        const handleMedicamentoNuevo = (nuevoMed) => {
            setMedicamentos(prev => [...prev, nuevoMed]);
        };

        socket.off("stockActualizado", handleStockActualizado);
        socket.on("stockActualizado", handleStockActualizado);

        return () => {
            socket.off("stockActualizado", handleStockActualizado);
        };
    }, []);

    const handleMedicamentoAgregado = (nuevoMedicamento) => {
        setMedicamentos(prev => [...prev, nuevoMedicamento]);
    };

    const medicamentosFiltrados = medicamentos.filter(med =>
        med.med_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="main-container">
                <SideBarComponent />
                <div className="content-area" style={{ backgroundColor: geriatrico?.color_principal }}>
                    <div className="report-header">
                        <h2 className="h4">Inventario de Medicamentos</h2>
                        {session.rol_id === 3 && (
                        <button className="save-button" onClick={() => setIsModalVincular(true)}>
                            <FaBriefcaseMedical /> Vincular
                        </button>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Buscar medicamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <div className="turnos-container-sede">
                        {medicamentosFiltrados.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Presentación</th>
                                        <th>Unidades por presentación</th>
                                        <th>Descripción</th>
                                        <th>Unidades disponibles</th>
                                        {session.rol_id === 3 && (
                                            <>
                                                <th>Agregar Stock</th>
                                                <th>Salida Stock</th>
                                                <th>Historial</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicamentosFiltrados.map((med) => (
                                        <tr key={med.med_sede_id}>
                                            <td>{med.med_nombre}</td>
                                            <td>{med.med_presentacion?.charAt(0).toUpperCase() + med.med_presentacion?.slice(1).toLowerCase()}</td>
                                            <td>{med.unidades_por_presentacion}</td>
                                            <td>{med.med_descripcion}</td>
                                            <td>{med.med_total_unidades_disponibles}</td>
                                            {session.rol_id === 3 && (
                                                <>
                                                    <td>
                                                        <button
                                                            className="asignar"
                                                            title="Agregar stock"
                                                            onClick={() => {
                                                                setMedicamentoSeleccionado(med);
                                                                setIsModalSalidaStock(false);
                                                            }}
                                                        >
                                                            <FaMedkit />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="inactive"
                                                            title="Salida de stock"
                                                            onClick={() => {
                                                                setMedicamentoSeleccionado(med);
                                                                setIsModalSalidaStock(true);
                                                            }}
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="turnos"
                                                            title="Historial"
                                                            onClick={() => {
                                                                setMedicamentoSeleccionado(med);
                                                                setIsModalHistorial(true);
                                                            }}
                                                        >
                                                            <FaHistory />
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay medicamentos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modales */}
            {medicamentoSeleccionado && !isModalSalidaStock && !isModalHistorial && (
                <ModalStockMedicamento
                    med_sede_id={medicamentoSeleccionado.med_sede_id}
                    onClose={() => {
                        setMedicamentoSeleccionado(null);
                        setIsModalSalidaStock(false);
                    }}
                    setMedicamento={setMedicamentos}
                />
            )}

            {isModalSalidaStock && medicamentoSeleccionado && (
                <ModalSalidaStock
                    med_sede_id={medicamentoSeleccionado.med_sede_id}
                    onClose={() => {
                        setMedicamentoSeleccionado(null);
                        setIsModalSalidaStock(false);
                    }}
                    medicamento={medicamentoSeleccionado}
                    setMedicamentos={setMedicamentos}
                    med_total_unidades_disponibles={medicamentoSeleccionado.med_total_unidades_disponibles}
                />
            )}

            {isModalVincular && (
                <ModalInventarioSede
                    onClose={() => setIsModalVincular(false)}
                    setMedicamentos={handleMedicamentoAgregado}
                />
            )}

            {isModalHistorial && medicamentoSeleccionado && (
                <HistoryDisplay
                    med_sede_id={medicamentoSeleccionado.med_sede_id}
                    onClose={() => {
                        setIsModalHistorial(false)
                        setMedicamentoSeleccionado(null);
                    }}
                />
            )}
        </>
    );
};
