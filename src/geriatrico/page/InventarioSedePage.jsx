import React, { useEffect, useState } from "react";
import { SideBarComponent } from "../../components";
import "../../css/inventario.css";
import { FaEdit, FaMedkit, FaPrescriptionBottleAlt } from "react-icons/fa";
import { useGeriatrico, useInventarioSede } from "../../hooks";
import { ModalStockMedicamento } from "../components/InventarioSed/ModalStockMedicamento";
import { ModalEditInventario } from "../components/InventarioSed/ModalEditInventario";
import { ModalInventarioSede } from "../components/InventarioSed/ModalInventarioSede";
import socket from "../../utils/Socket";

export const InventarioSedePage = () => {
    const { obtenerMedicamentosSede } = useInventarioSede();
    const { homeMiGeriatrico } = useGeriatrico();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [medicamentos, setMedicamentos] = useState([]);
    const [geriatrico, setGeriatrico] = useState(null);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
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
        const handleStockActualizado = ({ med_sede_id, med_total_unidades_disponibles }) => {
            console.log(`📢 Stock actualizado: ${med_sede_id} → ${med_total_unidades_disponibles} unidades.`);

            setMedicamentos(prevMedicamentos =>
                prevMedicamentos.map(med =>
                    med.med_sede_id === med_sede_id
                        ? { ...med, med_total_unidades_disponibles }
                        : med
                )
            );
        };

        socket.off("stockActualizado", handleStockActualizado);
        socket.on("stockActualizado", handleStockActualizado);

        return () => {
            socket.off("stockActualizado", handleStockActualizado);
        };
    }, []);


    const medicamentosFiltrados = medicamentos.filter(med =>
        med.med_nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <SideBarComponent />
                <div className="content " style={{ backgroundColor: geriatrico?.color_principal }}>
                    <div className="report-header">
                        <h2 className="">Inventario de Medicamentos</h2>
                        <button className="save-button" onClick={() => setIsModalOpen(true)}>
                            <FaPrescriptionBottleAlt /> Agregar
                        </button>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Buscar medicamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="turnos-grid">
                        {medicamentosFiltrados.length > 0 ? (
                            medicamentosFiltrados.map((med) => (
                                <div key={med.med_sede_id} className="turnos-card">
                                    <div className="turnos-header">
                                        <h4>{med.med_nombre}</h4>
                                        <button className="save-button" onClick={() => {
                                            setMedicamentoSeleccionado(med);
                                            setIsModal(false);
                                        }}>
                                            <FaMedkit />
                                        </button>
                                    </div>
                                    <div className="actividad-item">
                                        <p><span>Presentación:</span> {med.med_presentacion}</p>
                                    </div>
                                    <div className="actividad-item">
                                        <p><span>Unidades por presentación:</span> {med.unidades_por_presentacion}</p>
                                    </div>
                                    <div className="actividad-item">
                                        <p><span>Descripción:</span> {med.med_descripcion}</p>
                                    </div>
                                    <div className="actividad-item">
                                        <p><span>Unidades disponibles:</span> {med.med_total_unidades_disponibles}</p>
                                    </div>
                                    <div className="button-container">
                                        <button className="save-button" onClick={() => {
                                            setMedicamentoSeleccionado(med);
                                            setIsModal(true);
                                        }}>

                                            <FaEdit />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay medicamentos disponibles.</p>
                        )}
                    </div>

                </div>
            </div>

            {/* Modal de edición de stock */}
            {
                medicamentoSeleccionado && (
                    <ModalStockMedicamento
                        med_sede_id={medicamentoSeleccionado.med_sede_id}
                        onClose={() => {
                            setMedicamentoSeleccionado(null);
                            setIsModal(false);
                        }}
                        setMedicamento={setMedicamentos}
                    />
                )
            }

            {/* Modal de edición del medicamento */}
            {
                isModal && medicamentoSeleccionado && (
                    <ModalEditInventario
                        med_sede_id={medicamentoSeleccionado.med_sede_id}
                        onClose={() => setMedicamentoSeleccionado(null)}
                        medicamento={medicamentoSeleccionado}
                        setMedicamentos={setMedicamentos}
                        med_total_unidades_disponibles={medicamentoSeleccionado.med_total_unidades_disponibles}
                    />
                )
            }

            {/* Modal para agregar nuevo medicamento */}
            {isModalOpen &&
                <ModalInventarioSede
                    setMedicamentos={setMedicamentos}
                    onClose={() => setIsModalOpen(false)}
                />}
        </div >
    );
};
