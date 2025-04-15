import React, { useEffect, useState } from 'react';
import '../../css/diagnostico.css';
import { useDiagnostico, usePaciente, useSession } from '../../hooks';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const DiagnosticoPage = () => {
    const { id } = useParams();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerSesion, session } = useSession();
    const { obtenerDiagnostico, registrarDiagnostico, actualizarDiagnostico } = useDiagnostico();
    const [diagnostico, setDiagnostico] = useState({
        pac_id: Number(id),
        diag_fecha: '',
        diag_descripcion: ''
    });
    const [error, setError] = useState(null);
    const [diagnosticoRegistrado, setDiagnosticoRegistrado] = useState(false);
    const [paciente, setPaciente] = useState(null);

    // Obtener datos del paciente
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
    }, [id]);

    // Obtener diagnóstico existente
    useEffect(() => {
        const fetchDiagnostico = async () => {
            if (!paciente || !paciente.pac_id) {
                console.warn("⚠️ El paciente aún no está disponible.");
                return;
            }
            try {
                const pacId = Number(paciente.pac_id);
                const response = await obtenerDiagnostico(pacId);
                if (response.success) {
                    setDiagnostico(response.data);
                    setDiagnosticoRegistrado(true);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener los datos del diagnóstico.");
            }
        };
        fetchDiagnostico();
    }, [paciente]);

    // Maneja los cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiagnostico((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const pacId = Number(paciente.pac_id);
        if (!pacId || isNaN(pacId)) {
            Swal.fire({
                icon: 'warning',
                text: 'El ID del paciente es inválido.'
            });
            return;
        }

        if (!pacId) {
            Swal.fire({
                icon: 'warning',
                text: 'Faltan datos obligatorios para registrar el diagnóstico.'
            });
            return;
        }

        // Creamos la payload combinando el objeto diagnostico y el pac_id
        const payload = {
            ...diagnostico,
            pac_id: pacId
        };
        try {
            let response;
            if (diagnosticoRegistrado) {
                response = await actualizarDiagnostico(payload);
            } else {
                response = await registrarDiagnostico(payload);
            }

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    text: response.message
                });
                const updated = await obtenerDiagnostico(pacId);
                if (updated.success) {
                    setDiagnostico(updated.data);
                    setDiagnosticoRegistrado(true);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    text: response.message
                });
            }
        } catch (err) {
            console.error("❌ Error al registrar o actualizar el diagnóstico:", err);
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error inesperado. Intenta nuevamente.'
            });
        }
    };



    return (
        <div className="animate__animated animate__fadeInUp">
            <form onSubmit={handleSubmit}>
                <div className="section">
                    <div className='report-header'>
                        <h2 className='h4'>Diagnóstico</h2>
                    </div>
                    <div className="subsection">
                        <label className="subsection-label">Fecha</label>
                        <input
                            type="date"
                            name="diag_fecha"
                            value={diagnostico.diag_fecha}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="subsection">
                        <label className="subsection-label">Descripción</label>
                        <textarea
                            name="diag_descripcion"
                            placeholder="Ingrese las señales"
                            className="textarea"
                            rows="4"
                            value={diagnostico.diag_descripcion}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {session.rol_id === 3 && session.rol_id !== 5 && (
                    <button
                        type="submit"
                        className="save-button"
                    >
                        {diagnosticoRegistrado ? 'Actualizar' : 'Registrar'}
                    </button>
                )}
                <div>
                </div>
            </form>
        </div>
    );
};
