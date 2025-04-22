import React, { useEffect, useState } from 'react';
import {
    FaCalendarAlt, FaEdit, FaHistory, FaMedkit, FaTrash, FaStop
} from 'react-icons/fa';
import {
    HistoryFormulacion,
    ModalActualizarFormulacion,
    ModalFormulacion
} from '../components/Formulacion';
import { useParams } from 'react-router-dom';
import { useFormulacionMedicamentos, usePaciente, useSession } from '../../hooks';
import Swal from 'sweetalert2';

export const FormulacionMedicamentosPage = () => {
    const { id } = useParams();
    const { obtenerSesion } = useSession();
    const { obtenerDetallePacienteSede } = usePaciente();
    const {
        formulacionMedicamentoVigente,
        deleteFormulacionPendiente,
        suspenderFormulacionEnCurso,
        extenderFechaFinFormulacion
    } = useFormulacionMedicamentos();

    const [paciente, setPaciente] = useState(null);
    const [formulaciones, setFormulaciones] = useState({ en_curso: [], pendientes: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForm, setSelectedForm] = useState(null);
    const [activeTab, setActiveTab] = useState('pendientes');

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [isModalHistory, setIsModalHistory] = useState(false);

    // Obtener sesión y datos del paciente
    useEffect(() => {
        obtenerSesion();
        const fetchPaciente = async () => {
            const { success, paciente } = await obtenerDetallePacienteSede(id);
            if (success) setPaciente(paciente);
        };
        fetchPaciente();
    }, [id]);

    // Obtener formulaciones del paciente
    useEffect(() => {
        const fetchFormulaciones = async () => {
            const response = await formulacionMedicamentoVigente(paciente?.pac_id);
            if (response.success) {
                setFormulaciones({
                    en_curso: Array.isArray(response.en_curso) ? response.en_curso : [],
                    pendientes: Array.isArray(response.pendientes) ? response.pendientes : []
                });
            }
        };
        if (paciente?.pac_id) fetchFormulaciones();
    }, [paciente]);

    // Actualiza una formulación pendiente
    const handleActualizarFormulacion = (actualizada) => {
        setFormulaciones(prev => ({
            ...prev,
            pendientes: prev.pendientes.map(f =>
                f.admin_id === actualizada.admin_id ? { ...f, ...actualizada } : f
            ),
        }));
    };

    // Eliminar formulación pendiente
    const handleDeleteFormulacion = async (admin_id) => {
        const confirm = await Swal.fire({
            icon: 'question',
            title: 'Eliminar formulación',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        });

        if (!confirm.isConfirmed) return;

        const response = await deleteFormulacionPendiente(admin_id);
        if (response.success) {
            Swal.fire({ icon: 'success', text: response.message });
            setFormulaciones(prev => ({
                ...prev,
                pendientes: prev.pendientes.filter(f => f.admin_id !== admin_id)
            }));
        } else {
            Swal.fire({ icon: 'error', text: response.message });
        }
    };

    // Suspender formulación en curso
    const handleSuspenderFormulacion = (formulacion) => {
        Swal.fire({
            title: '¿Deseas suspender esta formulación?',
            input: 'text',
            inputLabel: 'Motivo de suspensión',
            showCancelButton: true,
            confirmButtonText: 'Suspender',
            cancelButtonText: 'Cancelar',
            preConfirm: async (motivo) => {
                if (!motivo) return Swal.showValidationMessage("Debes ingresar un motivo.");
                const response = await suspenderFormulacionEnCurso(formulacion.admin_id, motivo);
                if (!response.success) return Swal.showValidationMessage(response.message);

                setFormulaciones(prev => ({
                    ...prev,
                    en_curso: prev.en_curso.filter(f => f.admin_id !== formulacion.admin_id)
                }));

                Swal.fire({ icon: 'success', text: response.message });
            }
        });
    };

    // Extender fecha de finalización
    const handleExtenderFecha = async (formulacion) => {
        const { value: date } = await Swal.fire({
            title: "Selecciona la nueva fecha de fin",
            input: "date",
            showCancelButton: true,
            confirmButtonText: "Extender",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => !value ? "Debes seleccionar una fecha" : null
        });

        if (date) {
            const result = await extenderFechaFinFormulacion(formulacion.admin_id, date);
            if (result.success) {
                Swal.fire({ icon: 'success', text: result.message });
                setFormulaciones(prev => ({
                    ...prev,
                    en_curso: prev.en_curso.map(f =>
                        f.admin_id === formulacion.admin_id ? { ...f, admin_fecha_fin: date } : f
                    )
                }));
            } else {
                Swal.fire({ icon: 'error', text: result.message });
            }
        }
    };

    // Renderizar tabla por tab
    const renderRows = (lista) => {
        if (!Array.isArray(lista)) return null;

        return lista.filter(f =>
            f.medicamentos_formulados?.med_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((formulacion, index) => (
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
                {activeTab === 'en_curso' && (
                    <td>{formulacion.dosis_efectivamente_administradas?.detalle_numero_dosis ?? 'N/A'}</td>
                )}
                <td>
                    {formulacion.admin_estado === "En Curso" && (
                        <div className='buttons-asignar'>
                            <button className='suspender' onClick={() => handleSuspenderClick(formulacion)}><FaStop /></button>
                            <button className='expandir' onClick={() => handleExpandirClick(formulacion)}><FaCalendarAlt /></button>
                        </div>
                    )}
                    {formulacion.admin_estado === "Pendiente" && (
                        <div className='buttons-asignar'>
                            <button className='turnos' onClick={() => { setIsModalUpdate(true); setSelectedForm(formulacion); }}><FaEdit /></button>
                            <button className='inactive' onClick={() => handleDeleteFormulacion(formulacion.admin_id)}><FaTrash /></button>
                        </div>
                    )}
                </td>
            </tr>
        ));
    };


    return (
        <>
            <div className="animate__animated animate__fadeInUp">
                <div className="main-container">
                    <div className="content">
                        <div className="report-header">
                            <h2 className="h4">Formulación de medicamentos</h2>
                            <button className="save-button" onClick={() => setIsModalOpen(true)}>
                                <FaMedkit /> Agregar
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Buscar medicamento..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="tabs-container">
                            <div className="geriatrico-tabs">
                                <button
                                    className={`geriatrico-tab ${activeTab === 'pendientes' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('pendientes')}
                                >
                                    Pendientes
                                </button>
                                <button
                                    className={`geriatrico-tab ${activeTab === 'en_curso' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('en_curso')}
                                >
                                    En Curso
                                </button>
                            </div>
                        </div>

                        <div className="turnos-container-sede">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Medicamento</th>
                                        <th>Presentación</th>
                                        <th>Fecha Inicio</th>
                                        <th>Fecha Fin</th>
                                        <th>Hora</th>
                                        <th>Dosis</th>
                                        <th>Unidad</th>
                                        <th>Vía Administración</th>
                                        <th>Estado</th>
                                        <th>Total Dosis</th>
                                        {activeTab === 'en_curso' && <th>Dosis Administradas</th>}
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderRows(formulaciones[activeTab])}
                                </tbody>
                            </table>
                        </div>

                        <div className='button-container'>
                            <button className='save-button' title='Ver historial' onClick={() => setIsModalHistory(true)}>
                                <FaHistory />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ModalFormulacion
                    pac_id={paciente?.pac_id}
                    onClose={() => setIsModalOpen(false)}
                    setFormulaciones={setFormulaciones}
                />
            )}

            {isModalHistory && (
                <HistoryFormulacion
                    pac_id={paciente?.pac_id}
                    onClose={() => setIsModalHistory(false)}
                />
            )}

            {isModalUpdate && (
                <ModalActualizarFormulacion
                    admin_id={selectedForm?.admin_id}
                    onClose={() => setIsModalUpdate(false)}
                    formulacionSeleccionada={selectedForm}
                    setFormulaciones={handleActualizarFormulacion}
                />
            )}
        </>
    );
};
