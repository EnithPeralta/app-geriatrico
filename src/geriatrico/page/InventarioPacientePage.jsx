import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInventarioPaciente, usePaciente, useSession } from '../../hooks';
import { HistoryDisplayPac, ModalInventarioPaciente, ModalSalidaStockPac, ModalStockMedicamentoPac } from '../components/InventarioPaciente';
import { FaMedkit, FaMinus, FaBriefcaseMedical, FaHistory } from 'react-icons/fa';

export const InventarioPacientePage = () => {
    const { obtenerSesion, session } = useSession();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerMedicamentosInvPaciente } = useInventarioPaciente();
    const [medicamentos, setMedicamentos] = useState([]);
    const [paciente, setPaciente] = useState(null);
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [isModalHistory, setIsModalHistory] = useState(false);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [inventarioPaciente, setInventarioPaciente] = useState([]);

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

    const handleMedicamentoAgregado = (nuevoMedicamento) => {
        setInventarioPaciente(prev => [...prev, nuevoMedicamento]);
    };



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
                                        <th>Agregar Stock</th>
                                        <th>Salida Stock</th>
                                        {session.rol_id === 3 && (
                                            <th>Historial</th>)
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicamentosFiltrados.map((med, index) => (
                                        <tr key={index}>
                                            <td>{med.med_nombre}</td>
                                            <td>{med.med_presentacion?.charAt(0).toUpperCase() + med.med_presentacion?.slice(1).toLowerCase()}</td>
                                            <td>{med.unidades_por_presentacion}</td>
                                            <td>{med.med_descripcion}</td>
                                            <td>{med.med_total_unidades_disponibles}</td>
                                            <td>
                                                <button
                                                    className="asignar"
                                                    title="Agregar stock"
                                                    onClick={() => {
                                                        setMedicamentoSeleccionado(med);
                                                        setIsModal(false);
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
                                                        setIsModal(true);
                                                    }}
                                                >
                                                    <FaMinus />
                                                </button>
                                            </td>
                                            {session.rol_id === 3 && (<td>
                                                <button
                                                    className='turnos'
                                                    title='Historial'
                                                    onClick={() => {
                                                        setMedicamentoSeleccionado(med);
                                                        setIsModalHistory(true);
                                                    }}
                                                >
                                                    <FaHistory />
                                                </button>
                                            </td>
                                            )}

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay medicamentos disponibles.</p>
                        )}
                    </div>
                    <div className='button-container'>
                        <button className="save-button" onClick={() => setIsModalOpen(true)}>
                            <FaBriefcaseMedical /> Vincular
                        </button>
                    </div>
                </div>
            </div>
            {medicamentoSeleccionado && !isModalHistory && (
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
                <ModalSalidaStockPac
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
                    onMedicamentoAgregado={handleMedicamentoAgregado}
                />
            )}

            {isModalHistory && medicamentoSeleccionado && (
                <HistoryDisplayPac
                    med_pac_id={medicamentoSeleccionado.med_pac_id}
                    onClose={() => {
                        setIsModalHistory(false);
                        setMedicamentoSeleccionado(null);
                    }}
                />
            )}

        </div>
    );
};