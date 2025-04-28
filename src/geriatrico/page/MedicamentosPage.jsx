import React, { useEffect, useState } from 'react';
import { useGeriatrico, useMedicamento } from '../../hooks';
import { SideBarComponent } from '../../components';
import { FaBriefcaseMedical, FaEdit, FaPrescriptionBottleAlt } from 'react-icons/fa';
import { ModalActualizar, ModalMedicamento } from '../components/Medicamento';
import socket from '../../utils/Socket';

export const MedicamentosPage = () => {
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerMedicamentos } = useMedicamento();
    const [geriatrico, setGeriatrico] = useState(null);
    const [medicamentos, setMedicamentos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMedicamentoEdit, setSelectedMedicamentoEdit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sedeResult, medicamentoResult] = await Promise.all([
                    homeMiGeriatrico(),
                    obtenerMedicamentos()
                ]);

                if (sedeResult.success) {
                    setGeriatrico(sedeResult.geriatrico);
                } else {
                    console.error("No se encontraron datos de la sede.");
                }

                if (medicamentoResult.success && Array.isArray(medicamentoResult.data)) {
                    setMedicamentos(medicamentoResult.data);
                } else {
                    console.error("La respuesta de medicamentos no es válida:", medicamentoResult.message);
                    setMedicamentos([]);
                }
            } catch (error) {
                console.error(error.message || "Error al obtener los datos.");
                setMedicamentos([]);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleMedicamentoNuevo = ({ medicamento }) => {
            setMedicamentos(prev => [...prev, medicamento]);
        };

        socket.off("medicamentoRegistrado", handleMedicamentoNuevo);
        socket.on("medicamentoRegistrado", handleMedicamentoNuevo);

        return () => {
            socket.off("medicamentoRegistrado", handleMedicamentoNuevo);
        };
    }, []);

    useEffect(() => {
        const handleMedicamentoActualizadoSocket = ({ medicamento }) => {
            setMedicamentos(prev =>
                prev.map(med =>
                    med.med_id === medicamento.med_id ? medicamento : med
                )
            );
        };

        socket.off("medicamentoActualizado", handleMedicamentoActualizadoSocket);
        socket.on("medicamentoActualizado", handleMedicamentoActualizadoSocket);

        return () => {
            socket.off("medicamentoActualizado", handleMedicamentoActualizadoSocket);
        };
    }, []);


    const medicamentosFiltrados = medicamentos.filter(med =>
        med && med.med_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <SideBarComponent />
                <div className="content" style={{ backgroundColor: geriatrico?.color_principal }}>
                    <div className="report-header">
                        <h2 className="gestionar-title">Medicamentos</h2>
                        <button className="save-button" onClick={() => setIsModalOpen(true)}>
                            <FaBriefcaseMedical /> Agregar
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
                    <div className="inventory">
                        {medicamentosFiltrados.length > 0 ? (
                            medicamentosFiltrados.map((med, index) => (
                                <div
                                    key={index}
                                    className="inventory-card"
                                // onClick={() => {
                                //     setSelectedMedicamento(med);
                                //     setIsModalOpen(false);
                                // }}
                                >
                                    <div className="inventory-item">
                                        <div className='inventory-details'>
                                            <span className="item-name">{med.med_nombre}</span>
                                            <span className="item-description">{med.med_descripcion}</span>
                                            <span className="item-presentation">Presentación: {med.med_presentacion?.charAt(0).toUpperCase() + med.med_presentacion?.slice(1).toLowerCase()}</span>
                                            <span className="item-presentation">Tipo de contenido: {med.med_tipo_contenido?.charAt(0).toUpperCase() + med.med_tipo_contenido?.slice(1).toLowerCase()}</span>
                                            <span className="item-presentation">Unidades por presentación: {med.unidades_por_presentacion}</span>
                                        </div>
                                        <div className="inventory-info">
                                            <div className="button-container">
                                                <button
                                                    className="edit-button"
                                                    title="Editar"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMedicamentoEdit(med);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay medicamentos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de agregar medicamento */}
            {isModalOpen && (
                <ModalMedicamento
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Modal de información del medicamento seleccionado */}
            {/* {selectedMedicamento && (
                <ModalDetalle
                    selectedMedicamento={selectedMedicamento}
                    setSelectedMedicamento={setSelectedMedicamento}
                />
            )} */}

            {/* Modal de edición del medicamento seleccionado */}
            {isEditModalOpen && selectedMedicamentoEdit && (
                <ModalActualizar
                    medicamento={selectedMedicamentoEdit}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
};
