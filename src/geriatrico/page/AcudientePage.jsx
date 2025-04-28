import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAcudiente, useGeriatrico, useSession } from '../../hooks';
import { ModalRegisterAcudiente } from '../components/Acudiente/ModalRegisterAcudiente';
import { LoadingComponet, SideBarComponent } from '../../components';
import Swal from 'sweetalert2';
import socket from '../../utils/Socket';

export const AcudientePage = () => {
    const { id } = useParams();
    const { obtenerAcudientesDePaciente, inactivarRelacionAcudiente, reactivarRelacionAcudiente } = useAcudiente();
    const { homeMiGeriatrico } = useGeriatrico();
    const { session } = useSession();
    const [acudientes, setAcudientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegisterAcudiente, setShowRegisterAcudiente] = useState(false);
    const [geriatrico, setGeriatrico] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await homeMiGeriatrico();

                if (response?.success) {
                    setGeriatrico(response.geriatrico);
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await obtenerAcudientesDePaciente(id);
                if (response.success) {
                    setAcudientes(response.acudientes || []);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError("Error al obtener los acudientes.");
            } finally {
                setLoading(false);
            }
        };
        fetchPaciente();

    }, [id, acudientes]);

    useEffect(() => {
        const handleSocketAcudientes = (acudiente) => {
            console.log('Nuevo acudiente recibido:', acudiente);
            setAcudientes(prev => {
                const existe = prev.some(p => p.per_id === acudiente.per_id);
                if (!existe) {
                    return [acudiente, ...prev];
                }
                return prev;
            });
        };
    
        socket.on('acudienteRegistrado', handleSocketAcudientes);
    
        return () => {
            socket.off('acudienteRegistrado', handleSocketAcudientes);
        };
    }, []);
    




    const handleInactivarRelacionAcudiente = async (pa_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas inactivar la relación con el acudiente?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            const result = await inactivarRelacionAcudiente(pa_id);
            if (result.success) {
                setAcudientes((prev) =>
                    prev.map((acudiente) =>
                        acudiente.pa_id === pa_id
                            ? { ...acudiente, acudienteActivo: false }
                            : acudiente
                    )
                );
            }
            Swal.fire(result.success ? { icon: "success", text: result.message } : { icon: "error", text: result.message });
        }
    };

    const handleReactivarRelacionAcudiente = async (pa_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas reactivar la relación con el acudiente?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, reactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            const result = await reactivarRelacionAcudiente(pa_id);
            if (result.success) {
                // Actualiza el estado localmente
                setAcudientes((prev) =>
                    prev.map((acudiente) =>
                        acudiente.pa_id === pa_id
                            ? { ...acudiente, acudienteActivo: true }
                            : acudiente
                    )
                );
            }
            Swal.fire(result.success
                ? { icon: "success", text: result.message }
                : { icon: "error", text: result.message });
        }
    };

    const acudientesFiltrados = acudientes.filter((acudiente) =>
        acudiente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acudiente.documento.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate__animated animate__fadeInDown">
            <div className='main-container'>
                <SideBarComponent />
                <div className='content-area' style={{ backgroundColor: geriatrico?.color_principal || '#ffffff' }}>
                    <div className='gestionar'>
                        <h2 className='gestionar-title'>Acudientes</h2>
                        {session?.rol_id === 3 && (
                            <button className='gestionar-btn' onClick={() => setShowRegisterAcudiente(true)}>
                                Agregar Acudiente
                            </button>
                        )}
                        <input
                            type="text"
                            placeholder="Buscar por nombre o documento"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='gestionar-input'
                        />
                    </div>
                    {loading ? (
                        <LoadingComponet />
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <div className='turnos-container-sede'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Estado</th>
                                        <th>Nombre</th>
                                        <th>Documento</th>
                                        <th>Parentesco</th>
                                        <th>Teléfono</th>
                                        <th>Correo</th>
                                        {session?.rol_id === 3 && <th>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {acudientesFiltrados.length > 0 ? (
                                        acudientesFiltrados.map((acudiente) => (
                                            <tr key={acudiente.per_id_acudiente}>
                                                <td>
                                                    {acudiente.acudienteActivo ? "Activo" : "Inactivo"}
                                                </td>
                                                <td>{acudiente.nombre_completo}</td>
                                                <td>{acudiente.documento}</td>
                                                <td>{acudiente.parentesco}</td>
                                                <td>{acudiente.telefono}</td>
                                                <td>{acudiente.correo}</td>
                                                {session?.rol_id === 3 && (
                                                    <td>
                                                        <button className={acudiente.acudienteActivo ? 'asignar' : 'inactive'}
                                                            onClick={() => {
                                                                acudiente.acudienteActivo
                                                                    ? handleInactivarRelacionAcudiente(acudiente.pa_id)
                                                                    : handleReactivarRelacionAcudiente(acudiente.pa_id);
                                                            }}>
                                                            <i className={`fa-solid ${acudiente.acudienteActivo ? "fa-user-gear asignar" : "fa-user-slash inactive"}`} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No se encontraron acudientes</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {showRegisterAcudiente && (
                    <ModalRegisterAcudiente
                        pacienteId={id}
                        onClose={() => setShowRegisterAcudiente(false)}
                        setAcudiente={(nuevoAcudiente) => setAcudientes(prev => [...prev, nuevoAcudiente])}
                    />
                )}
            </div>
        </div>
    );
};
