import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { usePaciente, useRecomendaciones, useSession } from '../../hooks';
import Swal from 'sweetalert2';


export const RecomendacionesPage = () => {
    const { id } = useParams();
    const { obtenerSesion, session } = useSession();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { registrarRecomendacion, obtenerRecomendaciones, actualizarRecomendacion } = useRecomendaciones();
    const [recomendacion, setRecomendacion] = useState({
        pac_id: Number(id),
        rec_fecha: '',
        rec_cubrir_piel_m: 'N',
        rec_cubrir_piel_t: 'N',
        rec_cubrir_piel_n: 'N',
        rec_asistir_alimentacion_m: 'N',
        rec_asistir_alimentacion_t: 'N',
        rec_asistir_alimentacion_n: 'N',
        rec_prevenir_caidas: 'N',
        rec_actividad_ocupacional: 'N',
        rec_actividad_fisica: 'N',
        rec_otras: ''
    });
    const [error, setError] = useState(null);
    const [paciente, setPaciente] = useState({});
    const [recomendacionRegistrada, setRecomendacionRegistrada] = useState(false);

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

    useEffect(() => {
        const fetchRecomendacion = async () => {
            if (!paciente.pac_id) {
                console.warn("⚠️ El paciente aún no está disponible.");
                return; // Evita continuar si paciente es null o undefined
            }
            try {
                const pacId = Number(paciente.pac_id);
                const response = await obtenerRecomendaciones(pacId);
                if (response.success) {
                    console.log("Datos recibidos:", response.datos);
                    setRecomendacionRegistrada(true);
                    setRecomendacion(prev => ({
                        ...prev,
                        ...response.data
                    }));

                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener las recomendaciones.");
            }
        };
        if (paciente.pac_id) fetchRecomendacion();
    }, [paciente]);



    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setRecomendacion((prev) => ({
            ...prev,
            [name]: checked ? "S" : "N"
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecomendacion((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegistrarRecomendacion = async (e) => {
        e.preventDefault();
        console.log("Paciente ID obtenido:", paciente.pac_id);

        const pacId = Number(paciente.pac_id); // Convertimos el ID a número
        console.log("📡 Datos a enviar:", pacId, recomendacion);

        if (!pacId) {
            Swal.fire({
                icon: 'warning',
                text: 'Faltan datos obligatorios para registrar el recomendación.'
            });
            return;
        }

        // Creamos la payload combinando el objeto recomendacion y el pac_id
        const payload = {
            ...recomendacion,
            pac_id: pacId
        };

        try {
            let result;
            if (recomendacionRegistrada) {
                console.log("🔄 Actualizando recomendación...");
                result = await actualizarRecomendacion(payload);
            } else {
                console.log("➕ Registrando nueva recomendación...");
                result = await registrarRecomendacion(payload);
            }
            console.log("📡 Respuesta del servidor:", result);

            if (result.success) {
                Swal.fire({ icon: 'success', text: result.message });
            } else {
                Swal.fire({ icon: 'error', text: result.message });
            }
        } catch (error) {
            console.error('Error al registrar recomendación:', error);
        }
    };


    return (
        <div className="animate__animated animate__fadeInUp">
            <div className="main-container">
                <div className="content">
                    <div className='report-header'>
                        <h2 className='h4'>Recomendaciones</h2>
                    </div>
                    <form onSubmit={handleRegistrarRecomendacion}>
                        <div>
                            <div className="cuidado-item">
                                <span>Fecha</span>
                                <div className="options">
                                    <label className="container-checkbox-text">
                                        <input
                                            type="date"
                                            name="rec_fecha"
                                            className="checkbox-text"
                                            value={recomendacion?.rec_fecha || ''}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="cuidado-item">
                                <span>Cubrir Piel</span>
                                <div className="options">
                                    {[
                                        { name: 'rec_cubrir_piel_m', label: 'Mañana' },
                                        { name: 'rec_cubrir_piel_t', label: 'Tarde' },
                                        { name: 'rec_cubrir_piel_n', label: 'Noche' }
                                    ].map(({ name, label }, index) => (
                                        <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <input
                                                    type="checkbox"
                                                    name={name}
                                                    checked={recomendacion[name] === "S"}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <div className="checkmark"></div>
                                            </label>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="cuidado-item">
                                <span>Asistencia Alimentación</span>
                                <div className="options">
                                    {[
                                        { name: 'rec_asistir_alimentacion_m', label: 'Mañana' },
                                        { name: 'rec_asistir_alimentacion_t', label: 'Tarde' },
                                        { name: 'rec_asistir_alimentacion_n', label: 'Noche' }
                                    ].map(({ name, label }, index) => (
                                        <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <input
                                                    type="checkbox"
                                                    name={name}
                                                    checked={recomendacion[name] === "S"}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <div className="checkmark"></div>
                                            </label>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="cuidado-item">
                                <span>Prevenir Caidas</span>
                                <div className="options">
                                    <label className="container-checkbox">
                                        <input
                                            type="checkbox"
                                            name="rec_prevenir_caidas"
                                            checked={recomendacion.rec_prevenir_caidas === "S"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="checkmark"></div>
                                    </label> Si
                                    <label className="container-checkbox">
                                        <input type="checkbox"
                                            name="rec_prevenir_caidas"
                                            checked={recomendacion.rec_prevenir_caidas === "N"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="checkmark"></div>
                                    </label>No
                                </div>
                            </div>
                            <div className="cuidado-item">
                                <span>Activida Ocupacional</span>
                                <div className="options">
                                    <label className="container-checkbox">
                                        <input
                                            type="checkbox"
                                            name="rec_actividad_ocupacional"
                                            checked={recomendacion.rec_actividad_ocupacional === "S"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="checkmark"></div>
                                    </label> Si
                                    <label className="container-checkbox">
                                        <input
                                            type="checkbox"
                                            name="rec_actividad_ocupacional"
                                            checked={recomendacion.rec_actividad_ocupacional === "N"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="checkmark"></div>
                                    </label>No
                                </div>
                            </div>

                            <div className="cuidado-item">
                                <span>Actividad Fisica</span>
                                <div className="options">
                                    <label className="container-checkbox">
                                        <input
                                            type="checkbox"
                                            name="rec_actividad_fisica"
                                            checked={recomendacion.rec_actividad_fisica === "S"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="checkmark"></div>
                                    </label> Si
                                    <label className="container-checkbox">
                                        <input
                                            type="checkbox"
                                            name="rec_actividad_fisica"
                                            checked={recomendacion.rec_actividad_fisica === "N"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="checkmark"></div>
                                    </label>No
                                </div>
                            </div>

                            <div className='cuidado-item'>
                                <span>Otras</span>
                                <div className="options">
                                    <label className="container-checkbox-text">
                                        <input
                                            type="text"
                                            name="rec_otras"
                                            value={recomendacion.rec_otras}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        {session.rol_id === 3 && session.rol_id !== 5 && (
                            <button
                                type="submit"
                                className="save-button"
                            >
                                {recomendacionRegistrada ? "Actualizar" : "Registrar"}
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div >
    )
}
