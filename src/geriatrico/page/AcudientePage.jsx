import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAcudiente, useSession } from '../../hooks';
import { ModalRegisterAcudiente } from '../components/Acudiente/ModalRegisterAcudiente';
import { LoadingComponet, SideBarComponent } from '../../components';
import Swal from 'sweetalert2';

export const AcudientePage = () => {
    const { id } = useParams();
    const { obtenerAcudientesDePaciente, inactivarRelacionAcudiente, reactivarRelacionAcudiente } = useAcudiente();
    const { session, obtenerSesion } = useSession();
    const [acudientes, setAcudientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegisterAcudiente, setShowRegisterAcudiente] = useState(false);


    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await obtenerAcudientesDePaciente(id);
                console.log("✅ Respuesta de la API Paciente:", response.acudientes);

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
    }, [id]);

    const handleInactivarRelacionAcudiente = async (pa_id) => {
        const confirm = await Swal.fire({
            text: "¿Estas seguro de que deseas inactivar la relacion con el acudiente?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            const result = await inactivarRelacionAcudiente(pa_id);
            if (result.success) {
                Swal.fire({
                    icon: "success",
                    text: result.message
                });
            } else {
                Swal.fire("Error", result.message, "error");
            }
        }
    };

    const handlereactivarRelacionAcudiente = async (pa_id) => {
        const confirm = await Swal.fire({
            text: "¿Estas seguro de que deseas reactivar la relacion con el acudiente?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si, reactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            const result = await reactivarRelacionAcudiente(pa_id);
            if (result.success) {
                Swal.fire({
                    icon: "success",
                    text: result.message
                });
            } else {
                Swal.fire("Error", result.message, "error");
            }
        }
    }

    return (
        <div className="animate__animated animate__fadeInDown">
            <div className='main-container'>
                <SideBarComponent />
                <div className='content-area'>
                    {session?.rol_id === 3 && (
                        <div className='gestionar'>
                            <h2 className='gestionar-title'>Acudientes</h2>
                            <button className='gestionar-btn' onClick={() => setShowRegisterAcudiente(true)}>
                                Agregar Acudiente
                            </button>
                        </div>
                    )}
                    {loading ? (
                        <LoadingComponet />
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : acudientes.length > 0 ? (
                        acudientes.map((acudiente) => (
                            <div key={acudiente.per_id_acudiente} className="user-card-container">
                                <div className="user-details">
                                    <div className="status-icon-person">
                                        {acudiente.acudienteActivo ? (
                                            <i className="fa-solid fa-circle-check activo"></i>
                                        ) : (
                                            <i className="fa-solid fa-circle-xmark inactivo"></i>
                                        )}
                                    </div>
                                    <div className='user-role'>{acudiente.nombre_completo}</div>
                                    <div className='user-id'>{acudiente.documento}</div>
                                    <div className='user-id'>{acudiente.parentesco}</div>
                                    <div className='user-id'>{acudiente.telefono}</div>
                                    <div className='user-id'>{acudiente.correo}</div>
                                </div>
                                {session?.rol_id === 3 && (
                                    <div className="buttons-asignar">
                                        <button className={acudiente.acudienteActivo ? 'asignar' : 'inactive'}
                                            onClick={() => {
                                                if (acudiente.acudienteActivo) {
                                                    handleInactivarRelacionAcudiente(acudiente.pa_id);
                                                } else {
                                                    handlereactivarRelacionAcudiente(acudiente.pa_id);
                                                }
                                            }
                                            }>
                                            <i className={`fa-solid ${acudiente.acudienteActivo ? "fa-user-gear asignar" : "fa-user-slash inactive"}`} />
                                        </button>
                                    </div>
                                )
                                }
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron acudientes</p>
                    )}

                </div>
                {showRegisterAcudiente && (
                    <ModalRegisterAcudiente
                        pacienteId={id}
                        onClose={() => setShowRegisterAcudiente(false)}
                    />
                )}
            </div>
        </div>
    );
};