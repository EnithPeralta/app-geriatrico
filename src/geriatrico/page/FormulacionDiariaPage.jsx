import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormulacionMedicamentos, usePaciente, useSession } from '../../hooks';
import { FaHistory, FaMortarPestle } from 'react-icons/fa';
import { ModalRegisterFormula } from '../components/Formulacion/Diaria/ModalRegisterFormula';
import { ModalHistorialFormula } from '../components/Formulacion/Diaria/ModalHistorialFormula';
import socket from '../../utils/Socket';

export const FormulacionDiariaPage = () => {
    const { id } = useParams();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerFormulacionesDelDia } = useFormulacionMedicamentos();
    const { obtenerSesion, session } = useSession();

    const [paciente, setPaciente] = useState(null);
    const [formulaciones, setFormulaciones] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForm, setSelectedForm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalHistory, setIsModalHistory] = useState(false);

    useEffect(() => {
        obtenerSesion();
        const fetchPaciente = async () => {
            const response = await obtenerDetallePacienteSede(id);
            if (response.success) setPaciente(response.paciente);
        };
        fetchPaciente();
    }, [id]);

    useEffect(() => {
        const fetchFormulaciones = async () => {
            if (!paciente?.pac_id) return;
            const response = await obtenerFormulacionesDelDia(paciente.pac_id);
            if (response.success) {
                setFormulaciones(response.data || []);
            }
        };

        if (paciente) {
            fetchFormulaciones();
        }

        const handleAgregarFormulacion = () => {
            fetchFormulaciones();
        };
        socket.on('dosis-administrada', handleAgregarFormulacion);
        
        return () => {
            socket.off('dosis-administrada', handleAgregarFormulacion);
        };
    }, [paciente, obtenerFormulacionesDelDia]);

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
                    <td>
                        <div className='button-container'>

                            {session.rol_id !== 3 && (
                                <button
                                    className="turnos"
                                    title='Agregar dosis'
                                    onClick={() => {
                                        setSelectedForm(formulacion);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <FaMortarPestle />
                                </button>
                            )
                            }

                            <button
                                className="edit-button-asignar"
                                title='Historial'
                                onClick={() => {
                                    setSelectedForm(formulacion);
                                    setIsModalHistory(true);
                                }}
                            >
                                <FaHistory />
                            </button>
                        </div>
                    </td>
                </tr>
            ));
    };

    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <div className="content">
                    <div className="report-header">
                        <h2 className="h4">Formula diaria</h2>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar medicamento..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="turnos-container-sede">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Medicamento</th>
                                    <th>Presentacion</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin</th>
                                    <th>Hora</th>
                                    <th>Dosis</th>
                                    <th>Tipo de contenido</th>
                                    <th>Via Administracion</th>
                                    <th>Estado</th>
                                    <th>Total Dosis</th>
                                    <th>Dosis Administradas</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isModalOpen && (
                    <ModalRegisterFormula
                        onClose={() => setIsModalOpen(false)}
                        admin_id={selectedForm?.admin_id}
                        setFormulaciones={setFormulaciones}

                    />
                )}
                {isModalHistory && (
                    <ModalHistorialFormula
                        onClose={() => setIsModalHistory(false)}
                        admin_id={selectedForm?.admin_id}
                    />
                )}
            </div>
        </div>
    );
};
