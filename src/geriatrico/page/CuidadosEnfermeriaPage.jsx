import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCuidadosEnfermeria, usePaciente, useSession } from '../../hooks';
import Swal from 'sweetalert2';
import '../../css/cuidados.css';

export const CuidadosEnfermeriaPage = () => {
    const { id } = useParams();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerSesion, session } = useSession();
    const { registrarCuidadosEnfermeria, obtenerCuidadosEnfermeria, actualizarCuidadosEnfermeria } = useCuidadosEnfermeria();
    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);
    const [datosCuidadosRegistrados, setDatosCuidadosRegistrados] = useState(false);


    const [datosCuidados, setDatosCuidados] = useState({
        pac_id: Number(id),
        cue_fecha_inicio: "",
        cue_fecha_fin: "",
        cue_bano: "",
        cue_pa_m: "N", // Inicializa en ""
        cue_pa_t: "N", // Inicializa en ""
        cue_pa_n: "N", // Inicializa en ""
        cue_fc_m: "N", // Inicializa en ""
        cue_fc_t: "N", // Inicializa en ""
        cue_fc_n: "N", // Inicializa en ""
        cue_fr_m: "N", // Inicializa en ""
        cue_fr_t: "N", // Inicializa en ""
        cue_fr_n: "N", // Inicializa en ""
        cue_t_m: "N", // Inicializa en ""
        cue_t_t: "N", // Inicializa en ""
        cue_t_n: "N", // Inicializa en ""
        cue_control_glicemia: "N", // Inicializa en ""
        cue_control_peso: "no aplica", // Inicializa en ""
        cue_control_talla: "no aplica", // Inicializa en ""
        cue_control_posicion_m: "N", // Inicializa en ""
        cue_control_posicion_t: "N", // Inicializa en ""
        cue_control_posicion_n: "N", // Inicializa en ""
        cue_curaciones: "N", // Inicializa en ""
        cue_sitio_cura: "",
        cue_liq_administrados: "N", // Inicializa en ""
        cue_liq_administrados_detalle: "",
        cue_liq_eliminados: "N", // Inicializa en ""
        cue_liq_eliminados_detalle: "",
        cue_med_m: "N", // Inicializa en ""
        cue_med_t: "N", // Inicializa en ""
        cue_med_n: "N", // Inicializa en ""
        otros_cuidados: "",
    });
    // Cargar datos del paciente y verificar si hay cuidados registrados
    useEffect(() => {
        obtenerSesion();
        const fetchPaciente = async () => {
            try {
                const response = await obtenerDetallePacienteSede(id);
                console.log("📡 Respuesta de la API:", response);
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

    useEffect(() => {
        const fechtDatosCuidados = async () => {
            if (!paciente || !paciente.pac_id) {
                console.warn("⚠️ El paciente aún no está disponible.");
                return; // Evita continuar si paciente es null o undefined
            }

            console.log("Paciente ID obtenido:", paciente.pac_id);
            try {
                const pacId = Number(paciente.pac_id);
                if (isNaN(pacId) || pacId <= 0) {
                    console.warn("⚠️ ID del paciente no válido:", pacId);
                    return;
                }

                const result = await obtenerCuidadosEnfermeria(pacId);
                console.log("📡 Datos de cuidados obtenidos:", result);

                if (result.success) {
                    setDatosCuidadosRegistrados(true);
                    setDatosCuidados(result.data);
                }
            } catch (error) {
                console.error("❌ Error al obtener los cuidados de enfermería:", error);
            }
        };

        if (paciente) fechtDatosCuidados();
    }, [paciente]); // Se ejecutará solo cuando paciente cambie



    // Manejar cambios en los checkboxes
    const handleChangeBano = (event) => {
        const { name, checked } = event.target;
        setDatosCuidados((prev) => ({
            ...prev,
            [name]: checked ? "CAMA" : "DUCHA",
        }));
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setDatosCuidados((prev) => ({
            ...prev,
            [name]: checked ? "S" : "N"
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDatosCuidados((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Registrar cuidados de enfermería
    const handleRegistrarCuidadoEnfermeria = async () => {
        try {
            console.log("Paciente ID obtenido:", paciente.pac_id);

            const pacId = Number(paciente.pac_id); // Convertimos el ID a número
            console.log("📡 Datos a enviar:", pacId, datosCuidados);
            if (!pacId) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Faltan datos obligatorios para registrar el cuidado de enfermería.'
                });
                return;
            }


            let result;
            if (datosCuidadosRegistrados) {
                console.log("🔄 Actualizando cuidados existentes...");
                result = await actualizarCuidadosEnfermeria(pacId, datosCuidados);
            } else {
                console.log("➕ Registrando nuevos cuidados...");
                result = await registrarCuidadosEnfermeria(pacId, datosCuidados);
            }

            if (result.success) {
                Swal.fire({ icon: 'success', text: result.message });
            } else {
                Swal.fire({ icon: 'error', text: result.message });
            }
        } catch (error) {
            console.error("❌ Error al registrar el cuidado de enfermería:", error);
            Swal.fire({ icon: 'error', text: 'Ocurrió un error inesperado. Inténtelo nuevamente.' });
        }
    };

    return (
        <div className='main-container'>
            <div className='content'>
                <div className="animate__animated animate__fadeInUp">
                    <div className='report-header'>
                        <h2 className="h4">Cuidados de Enfermería</h2>
                    </div>
                    <div className="">
                        {/* Checkbox Fecha */}
                        <div className="cuidado-item">
                            <span>Fecha inicial</span>
                            <div className="options">
                                <label className="container-checkbox-text">
                                    <input
                                        type="date"
                                        className='checkbox-text'
                                        name="cue_fecha_inicio"
                                        value={datosCuidados.cue_fecha_inicio}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Checkbox Fecha Fin*/}
                        <div className="cuidado-item">
                            <span>Fecha final</span>
                            <div className="options">
                                <label className="container-checkbox-text">
                                    <input
                                        type="date"
                                        className='checkbox-text'
                                        name="cue_fecha_fin"
                                        value={datosCuidados.cue_fecha_fin}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Baño de paciente</span>
                            <div className="options">
                                {/* Checkbox Cama */}
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_bano"
                                        checked={datosCuidados.cue_bano === "CAMA"}
                                        onChange={handleChangeBano}
                                    />
                                    <div className="checkmark"></div>
                                </label>
                                <span className="checkbox-text">Ducha</span>

                                {/* Checkbox Ducha */}
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_bano"
                                        checked={datosCuidados.cue_bano === "DUCHA"}
                                        onChange={handleChangeBano}
                                    />
                                    <div className="checkmark"></div>
                                </label>
                                <span className="checkbox-text">Cama</span>
                            </div>
                        </div>

                        {/* Control de Arterial */}
                        <div className="cuidado-item">
                            <span>Presion Arterial</span>
                            <div className="options">
                                {[
                                    { name: 'cue_pa_m', label: 'Mañana' },
                                    { name: 'cue_pa_t', label: 'Tarde' },
                                    { name: 'cue_pa_n', label: 'Noche' }
                                ].map(({ name, label }, index) => (
                                    <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Frecuencia Cardiaca</span>
                            <div className="options">
                                {[
                                    { name: 'cue_fc_m', label: 'Mañana' },
                                    { name: 'cue_fc_t', label: 'Tarde' },
                                    { name: 'cue_fc_n', label: 'Noche' }
                                ].map(({ name, label }, index) => (
                                    <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Frecuencia Respiratoria</span>
                            <div className="options">
                                {[
                                    { name: 'cue_fr_m', label: 'Mañana' },
                                    { name: 'cue_fr_t', label: 'Tarde' },
                                    { name: 'cue_fr_n', label: 'Noche' }
                                ].map(({ name, label }, index) => (
                                    <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Temperatura</span>
                            <div className="options">
                                {[
                                    { name: 'cue_t_m', label: 'Mañana' },
                                    { name: 'cue_t_t', label: 'Tarde' },
                                    { name: 'cue_t_n', label: 'Noche' }
                                ].map(({ name, label }, index) => (
                                    <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Control de glicemia */}
                        <div className="cuidado-item">
                            <span>Control de glicemia</span>
                            <div className="options">
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_control_glicemia"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados?.cue_control_glicemia === "S"}
                                    />
                                    <div className="checkmark"></div>
                                </label>Si
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_control_glicemia"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados?.cue_control_glicemia === "N"}
                                    />
                                    <div className="checkmark"></div>
                                </label>No
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Control de peso</span>
                            <div className="options">
                                {["mañana", "tarde", "noche", "no aplica"].map((value, index) => (
                                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <label className="container-checkbox">
                                            <input
                                                type="radio"
                                                name="cue_control_peso"
                                                value={value}
                                                checked={datosCuidados.cue_control_peso === value}
                                                onChange={handleChange}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="cuidado-item">
                            <span>Control de talla</span>
                            <div className="options">
                                {["mañana", "tarde", "noche", "no aplica"].map((value, index) => (
                                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <label className="container-checkbox">
                                            <input
                                                type="radio"
                                                name="cue_control_talla"
                                                value={value}
                                                checked={datosCuidados.cue_control_talla === value}
                                                onChange={handleChange}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Control de posición */}
                        <div className="cuidado-item">
                            <span>Control de posición</span>
                            <div className="options">
                                {[
                                    { name: 'cue_control_posicion_m', label: 'Mañana' },
                                    { name: 'cue_control_posicion_t', label: 'Tarde' },
                                    { name: 'cue_control_posicion_n', label: 'Noche' }
                                ].map(({ name, label }, index) => (
                                    <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Curaciones */}
                        <div className="cuidado-item">
                            <span>Curaciones</span>
                            <div className="options">
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_curaciones"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados?.cue_curaciones === "S"}
                                    />
                                    <div className="checkmark"></div>
                                </label>Si
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_curaciones"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados?.cue_curaciones === "N"}
                                    />
                                    <div className="checkmark"></div>
                                </label>No
                            </div>
                        </div>

                        {/* Sitio de Curaciones */}
                        <div className="cuidado-item">
                            <span>Sitio de Curaciones</span>
                            <div className="options">
                                <label className="container-checkbox-text">
                                    <input
                                        type="text"
                                        name="cue_sitio_cura"
                                        onChange={handleChange}
                                        value={datosCuidados.cue_sitio_cura}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Liquidos Administrados */}
                        <div className="cuidado-item">
                            <span>Liquidos Administrados</span>
                            <div className="options">
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_liq_administrados"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados.cue_liq_administrados === 'S'}
                                    />
                                    <div className="checkmark"></div>
                                </label>Si
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_liq_administrados"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados.cue_liq_administrados === 'N'}
                                    />
                                    <div className="checkmark"></div>
                                </label>No
                            </div>
                        </div>

                        {/* Liquidos Administrados Detalle */}
                        <div className="cuidado-item">
                            <span>Liquidos Administrados Detalle</span>
                            <div className="options">
                                <label className="container-checkbox-text">
                                    <input
                                        type="text"
                                        name="cue_liq_administrados_detalle"
                                        onChange={handleChange}
                                        value={datosCuidados.cue_liq_administrados_detalle}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Liquidos Eliminados */}
                        <div className='cuidado-item'>
                            <span>Liquidos Eliminados</span>
                            <div className="options">
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_liq_eliminados"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados.cue_liq_eliminados === 'S'}
                                    />
                                    <div className="checkmark"></div>
                                </label>Si
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        name="cue_liq_eliminados"
                                        onChange={handleCheckboxChange}
                                        checked={datosCuidados.cue_liq_eliminados === 'N'}
                                    />
                                    <div className="checkmark"></div>
                                </label>No
                            </div>
                        </div>

                        {/* Liquidos Eliminados Detalle */}
                        <div className='cuidado-item'>
                            <span>Liquidos Eliminados Detalle</span>
                            <div className="options">
                                <label className="container-checkbox-text">
                                    <input
                                        type="text"
                                        name="cue_liq_eliminados_detalle"
                                        onChange={handleChange}
                                        value={datosCuidados.cue_liq_eliminados_detalle}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Administrar medicamentos */}
                        <div className="cuidado-item">
                            <span>Administrar medicamentos</span>
                            <div className="options">
                                {[
                                    { name: 'cue_med_m', label: 'Mañana' },
                                    { name: 'cue_med_t', label: 'Tarde' },
                                    { name: 'cue_med_n', label: 'Noche' }
                                ].map(({ name, label }, index) => (
                                    <div key={index} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label className="container-checkbox" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {session.rol_id === 3 && session.rol_id !== 5 && (
                    <button
                        onClick={handleRegistrarCuidadoEnfermeria}
                        className="save-button"
                    >
                        {datosCuidadosRegistrados ? "Actualizar" : "Registrar"}
                    </button>
                )}

            </div>
        </div>
    );
};
