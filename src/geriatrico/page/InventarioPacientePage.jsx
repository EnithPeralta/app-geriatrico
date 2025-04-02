import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInventarioPaciente, usePaciente, useSession } from '../../hooks';
import { ModalEditInventarioPac, ModalInventarioPaciente, ModalStockMedicamentoPac } from '../components/InventarioPaciente';
import { FaMedkit, FaEdit, FaSearch } from 'react-icons/fa';

export const InventarioPacientePage = () => {
    const { obtenerSesion } = useSession();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerMedicamentosInvPaciente } = useInventarioPaciente();
    const [medicamentos, setMedicamentos] = useState([]);
    const [paciente, setPaciente] = useState(null);
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        obtenerSesion();

        const fetchPaciente = async () => {
            try {
                const response = await obtenerDetallePacienteSede(id);
                console.log("📡 Respuesta de la API (Paciente):", response);
                if (response.success) {
                    setPaciente(response.paciente);
                } else {
                    console.error("Error:", response.message);
                }
            } catch (err) {
                console.error("❌ Error al obtener los datos del paciente.");
            }
        };

        fetchPaciente();
    }, [id]);

    useEffect(() => {
        if (!paciente?.pac_id) return;

        const fetchMedicamentoPaciente = async () => {
            try {
                const response = await obtenerMedicamentosInvPaciente(paciente.pac_id);
                console.log("📡 Respuesta de la API (Medicamentos):", response);
                if (response.success) {
                    setMedicamentos(response.data);
                } else {
                    console.error("Error:", response.message);
                }
            } catch (err) {
                console.error("❌ Error al obtener los datos del inventario.");
            }
        };

        fetchMedicamentoPaciente();
    }, [paciente]);

    const medicamentosFiltrados = medicamentos.filter(med =>
        med.med_nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <div className="content">
                    <div className='report-header'>
                        <h2 className='h4'>Inventario del Paciente</h2>
                    </div>
                    <div >
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
                                        <p><span>Cantidad:</span> {med.med_cantidad}</p>
                                        <button className="save-button" onClick={() => {
                                            setMedicamentoSeleccionado(med);
                                            setIsModal(false);
                                            setIsModalOpen(false);
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
                                        <p><span>Medicamentos disponibles:</span> {med.med_total_unidades_disponibles}</p>
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
                    <div className='button-container'>
                        <button className="save-button" onClick={() => setIsModalOpen(true)}>Agregar Medicamento</button>
                    </div>
                </div>
            </div>

            {medicamentoSeleccionado && (
                <ModalStockMedicamentoPac
                    med_pac_id={medicamentoSeleccionado.med_pac_id}
                    onClose={() => {
                        setMedicamentoSeleccionado(null);
                        setIsModal(false);
                    }}
                    setMedicamento={setMedicamentos}
                />
            )}

            {isModal && medicamentoSeleccionado && (
                <ModalEditInventarioPac
                    med_pac_id={medicamentoSeleccionado.med_pac_id}
                    medicamento={medicamentoSeleccionado}
                    setMedicamentos={setMedicamentos}
                    onClose={() => setMedicamentoSeleccionado(null)}
                />
            )}

            {isModalOpen && paciente && (
                <ModalInventarioPaciente
                    pac_id={Number(paciente.pac_id)}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};