import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { usePaciente, useRecomendaciones, useSession } from '../../hooks';
import Swal from 'sweetalert2';

export const datosRecomendacionesIniciales = {
    pac_id: 0,
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

}
export const RecomendacionesPage = () => {
    const { id } = useParams();
    const { obtenerSesion, session } = useSession();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { registrarRecomendacion, obtenerRecomendaciones, actualizarRecomendacion } = useRecomendaciones();
    const [recomendacion, setRecomendacion] = useState(datosRecomendacionesIniciales);
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
                    const datosCombinados = {
                        ...datosRecomendacionesIniciales,
                        ...response.data,
                        pac_id: paciente.pac_id,
                    };
                    setRecomendacion(datosCombinados);
                    setRecomendacionRegistrada(true);

                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener las recomendaciones.");
            }
        };
        if (paciente.pac_id) fetchRecomendacion();
    }, [paciente]);

    useEffect(() => {
    }, [recomendacion]);


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

        const pacId = Number(paciente.pac_id);

        if (!pacId) {
            Swal.fire({
                icon: 'warning',
                text: 'Faltan datos obligatorios para registrar el recomendación.'
            });
            return;
        }

        const payload = {
            ...recomendacion,
            pac_id: pacId
        };

        try {
            let result;
            if (recomendacionRegistrada) {
                result = await actualizarRecomendacion(payload);
            } else {
                result = await registrarRecomendacion(payload);
            }
            console.log("📡 Respuesta del servidor:", result);

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    text: result.message
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    text: result.message
                });
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
                                    {["m", "t", "n"].map((momento) => {
                                        const name = `rec_cubrir_piel_${momento}`;
                                        return (
                                            <div key={name} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    type="checkbox"
                                                    name={name}
                                                    checked={recomendacion[name] === "S"}
                                                    onChange={handleCheckboxChange}
                                                    id={name}
                                                />
                                                <label htmlFor={name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                    {` ${momento === "m" ? "Mañana" : momento === "t" ? "Tarde" : "Noche"}`}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            <div className="cuidado-item">
                                <span>Asistencia Alimentación</span>
                                <div className="options">
                                    {["m", "t", "n"].map((momento) => {
                                        const name = `rec_asistir_alimentacion_${momento}`;
                                        return (
                                            <div key={name} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    type="checkbox"
                                                    name={name}
                                                    checked={recomendacion[name] === "S"}
                                                    onChange={handleCheckboxChange}
                                                    id={name}
                                                />
                                                <label htmlFor={name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                    {` ${momento === "m" ? "Mañana" : momento === "t" ? "Tarde" : "Noche"}`}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>



                            <div className="cuidado-item">
                                <span>Prevenir Caidas</span>
                                <div className="options">
                                    {[
                                        { label: "Sí", value: "S" },
                                        { label: "No", value: "N" }
                                    ].map((opcion) => (
                                        <div
                                            key={opcion.value}
                                            className="checkbox-group"
                                            style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}
                                        >
                                            <input
                                                type="checkbox"
                                                name="rec_prevenir_caidas"
                                                value={opcion.value}
                                                checked={recomendacion.rec_prevenir_caidas === opcion.value}
                                                onChange={handleCheckboxChange}
                                                id={`caidas_${opcion.value}`}
                                            />
                                            <label htmlFor={`caidas_${opcion.value}`} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                {opcion.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>



                            <div className="cuidado-item">
                                <span>Activida Ocupacional</span>
                                <div className="options">
                                    {[
                                        { label: "Sí", value: "S" },
                                        { label: "No", value: "N" }
                                    ].map((opcion) => (
                                        <div
                                            key={opcion.value}
                                            className="checkbox-group"
                                            style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}
                                        >
                                            <input
                                                type="checkbox"
                                                name="rec_actividad_ocupacional"
                                                value={opcion.value}
                                                checked={recomendacion.rec_actividad_ocupacional === opcion.value}
                                                onChange={handleCheckboxChange}
                                                id={`actividad_${opcion.value}`}
                                            />
                                            <label htmlFor={`actividad_${opcion.value}`} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                {opcion.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>



                            <div className="cuidado-item">
                                <span>Actividad Fisica</span>
                                <div className="options">
                                    {[
                                        { label: "Sí", value: "S" },
                                        { label: "No", value: "N" }
                                    ].map((opcion) => (
                                        <div
                                            key={opcion.value}
                                            className="checkbox-group"
                                            style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}
                                        >
                                            <input
                                                type="checkbox"
                                                name="rec_actividad_fisica"
                                                value={opcion.value}
                                                checked={recomendacion.rec_actividad_fisica === opcion.value}
                                                onChange={handleCheckboxChange}
                                                id={`fisica_${opcion.value}`}
                                            />
                                            <label htmlFor={`fisica_${opcion.value}`} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                {opcion.label}
                                            </label>
                                        </div>
                                    ))}
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
                        {
                            session.rol_id === 3 && session.rol_id !== 5 && (
                                <button
                                    type="submit"
                                    className="save-button"
                                >
                                    {recomendacionRegistrada ? "Actualizar" : "Registrar"}
                                </button>
                            )
                        }
                    </form>
                </div >
            </div >
        </div >
    )
}
