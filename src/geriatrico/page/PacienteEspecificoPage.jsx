import React, { useEffect, useState } from 'react';
import { SideBarComponent } from '../../components';
import { PInformation } from '../layout';
import { useAcudiente, usePaciente, useSession } from '../../hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalEditarPaciente } from '../components/Paciente/ModalEditarPaciente';

export const PacienteEspecificoPage = () => {
    const { id } = useParams();
    const { obtenerDetallePacienteSede } = usePaciente();
    const [paciente, setPaciente] = useState({});
    const { obtenerAcudientesDePaciente } = useAcudiente();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showEditarPersona, setShowEditarPersona] = useState(false);
    const { session, obtenerSesion } = useSession();

    useEffect(() => {
        obtenerSesion();
        const fetchPaciente = async () => {
            try {
                const response = await obtenerDetallePacienteSede(id);
                if (response.success) {
                    setPaciente(response.paciente);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener los datos del paciente.");
            }
        };
        fetchPaciente();
    }, []);



    const handleAcudiente = async (pac_id) => {
        try {
            await obtenerAcudientesDePaciente(pac_id);
            navigate(`/geriatrico/acudiente/${pac_id}`);
        } catch {
            setError("Error al obtener el detalle del paciente.");
        }
    };

    const handleCuidados = async (per_id) => {
        try {
            await obtenerDetallePacienteSede(per_id);
            navigate(`/geriatrico/cuidadosEnfermeria/${per_id}`);
        } catch (error) {
            setError("Error al obtener el detalle del paciente.");
        }
    };

    const handleSeguimiento = async (per_id) => {
        try {
            await obtenerDetallePacienteSede(per_id);
            navigate(`/geriatrico/seguimientos/${per_id}`);
        } catch (error) {
            setError("Error al obtener el detalle del paciente.");
        }
    };


    return (
        <div>
            <div className="main-container">
                <SideBarComponent />
                <div className="content">
                    <PInformation persona={paciente} onEdit={() => handleAcudiente(paciente?.pac_id)} />
                    <div className="animate__animated animate__fadeInUp">
                        <div className="info-card">
                            <div className='gestionar'>
                                <h2 className='gestionar-title'>Información Personal</h2>
                                {session?.rol_id === 3 && (
                                    <button className='gestionar-btn' onClick={() => setShowEditarPersona(true)}>Editar</button>
                                )}                            </div>
                            <div className='button-container'>
                                {session?.rol_id === 5 && (
                                    <>
                                        <button className='gestionar-btn' onClick={() => handleCuidados(paciente?.per_id)}>Cuidados</button>
                                        <button className='gestionar-btn' onClick={() => handleSeguimiento(paciente?.per_id)}>Seguimiento</button>
                                    </>
                                )}
                            </div>
                            <div className="grid-4-columns">
                                {[
                                    { label: "Nombre Completo", value: paciente?.nombre },
                                    { label: "Documento", value: paciente?.documento },
                                    { label: "Edad", value: paciente?.edad },
                                    { label: "Nombre EPS", value: paciente?.nombre_eps },
                                    { label: "Peso", value: paciente?.peso },
                                    { label: "Régimen EPS", value: paciente?.regimen_eps },
                                    { label: "Grupo Sanguíneo", value: paciente?.rh_grupo_sanguineo },
                                    { label: "Estatura", value: paciente?.talla },
                                    { label: "Talla de Camisa", value: paciente?.talla_camisa },
                                    { label: "Talla de Pantalón", value: paciente?.talla_pantalon }
                                ].map((item, index) => (
                                    <div key={index}>
                                        <label>{item.label}</label>
                                        <input className='input' type="text" value={item.value || ""} readOnly />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showEditarPersona && (
                <ModalEditarPaciente
                    paciente={paciente}
                    cerrarModal={() => setShowEditarPersona(false)}
                />
            )}
        </div>
    );
};
