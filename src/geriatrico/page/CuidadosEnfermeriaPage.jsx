import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCuidadosEnfermeria, usePaciente, useSession } from '../../hooks';
import Swal from 'sweetalert2';
import '../../css/cuidados.css';


export const datosCuidadosIniciales = {
    pac_id: 0,
    cue_fecha_inicio: "",
    cue_fecha_fin: "",
    cue_bano: "",
    cue_pa_m: "N",
    cue_pa_t: "N",
    cue_pa_n: "N",
    cue_fc_m: "N",
    cue_fc_t: "N",
    cue_fc_n: "N",
    cue_fr_m: "N",
    cue_fr_t: "N",
    cue_fr_n: "N",
    cue_t_m: "N",
    cue_t_t: "N",
    cue_t_n: "N",
    cue_control_glicemia: "N",
    cue_control_peso: "no aplica",
    cue_control_talla: "no aplica",
    cue_control_posicion_m: "N",
    cue_control_posicion_t: "N",
    cue_control_posicion_n: "N",
    cue_curaciones: "N",
    cue_sitio_cura: "",
    cue_liq_administrados: "N",
    cue_liq_administrados_detalle: "",
    cue_liq_eliminados: "N",
    cue_liq_eliminados_detalle: "",
    cue_med_m: "N",
    cue_med_t: "N",
    cue_med_n: "N",
    otros_cuidados: "",
};


export const CuidadosEnfermeriaPage = () => {
    const { id } = useParams();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerSesion, session } = useSession();
    const { registrarCuidadosEnfermeria, obtenerCuidadosEnfermeria, actualizarCuidadosEnfermeria } = useCuidadosEnfermeria();
    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);
    const [datosCuidadosRegistrados, setDatosCuidadosRegistrados] = useState(false);
    const [datosCuidados, setDatosCuidados] = useState(datosCuidadosIniciales);

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

    useEffect(() => {
        const fechtDatosCuidados = async () => {
            if (!paciente || !paciente.pac_id) return;

            try {
                const pacId = Number(paciente.pac_id);
                const result = await obtenerCuidadosEnfermeria(pacId);

                if (result.success) {
                    const datosCombinados = {
                        ...datosCuidadosIniciales,
                        ...result.data,
                        pac_id: paciente.pac_id,
                    };

                    setDatosCuidados(datosCombinados);
                    setDatosCuidadosRegistrados(true);
                }
            } catch (error) {
                console.error("❌ Error:", error);
            }
        };

        fechtDatosCuidados();
    }, [paciente]);


    useEffect(() => {
    }, [datosCuidados]);



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

            const pacId = Number(paciente.pac_id);
            if (!pacId) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Faltan datos obligatorios para registrar el cuidado de enfermería.'
                });
                return;
            }


            let result;
            if (datosCuidadosRegistrados) {
                result = await actualizarCuidadosEnfermeria(pacId, datosCuidados);
            } else {
                result = await registrarCuidadosEnfermeria(pacId, datosCuidados);
            }

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
            console.error("❌ Error al registrar el cuidado de enfermería:", error);
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error inesperado. Inténtelo nuevamente.'
            });
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
                                {["DUCHA", "CAMA"].map((tipo) => (
                                    <div
                                        key={tipo}
                                        className="checkbox-group"
                                        style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}
                                    >
                                        <input
                                            type="checkbox"
                                            name="cue_bano"
                                            value={tipo}
                                            checked={datosCuidados.cue_bano === tipo}
                                            onChange={handleChangeBano}
                                            id={`cue_bano_${tipo}`}
                                        />
                                        <label htmlFor={`cue_bano_${tipo}`} style={{ marginLeft: "4px" }}>
                                            {tipo === "DUCHA" ? "Ducha" : "Cama"}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Control de Arterial */}
                        <div className="cuidado-item">
                            <span>Presión Arterial</span>
                            <div className="options">
                                {["m", "t", "n"].map((momento) => {
                                    const name = `cue_pa_${momento}`;
                                    return (
                                        <div key={name} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                                id={name}
                                            />
                                            <label htmlFor={name} style={{ marginLeft: "8px" }}>
                                                {` ${momento === "m" ? "Mañana" : momento === "t" ? "Tarde" : "Noche"}`}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="cuidado-item">
                            <span>Frecuencia Cardiaca</span>
                            <div className="options">
                                {["m", "t", "n"].map((momento) => {
                                    const name = `cue_fc_${momento}`;
                                    return (
                                        <div key={name} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                                id={name}
                                            />
                                            <label htmlFor={name} style={{ marginLeft: "8px" }}>
                                                {` ${momento === "m" ? "Mañana" : momento === "t" ? "Tarde" : "Noche"}`}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Frecuencia Respiratoria</span>
                            <div className="options">
                                {["m", "t", "n"].map((momento) => {
                                    const name = `cue_fr_${momento}`;
                                    return (
                                        <div key={name} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                                id={name}
                                            />
                                            <label htmlFor={name} style={{ marginLeft: "8px" }}>
                                                {` ${momento === "m" ? "Mañana" : momento === "t" ? "Tarde" : "Noche"}`}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="cuidado-item">
                            <span>Temperatura</span>
                            <div className="options">
                                {["m", "t", "n"].map((momento) => {
                                    const name = `cue_t_${momento}`;
                                    return (
                                        <div key={name} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                                id={name}
                                            />
                                            <label htmlFor={name} style={{ marginLeft: "8px" }}>
                                                {` ${momento === "m" ? "Mañana" : momento === "t" ? "Tarde" : "Noche"}`}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="cuidado-item">
                            <span>Control de glicemia</span>
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
                                            name="cue_control_glicemia"
                                            value={opcion.value}
                                            checked={datosCuidados?.cue_control_glicemia === opcion.value}
                                            onChange={handleCheckboxChange}
                                            id={`glicemia_${opcion.value}`}
                                        />
                                        <label htmlFor={`glicemia_${opcion.value}`} style={{ marginLeft: "4px" }}>
                                            {opcion.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>



                        <div className="cuidado-item">
                            <span>Control de posición</span>
                            <div className="options">
                                {["m", "t", "n"].map((momento) => {
                                    const name = `cue_control_posicion_${momento}`;
                                    return (
                                        <div key={name} className="checkbox-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="checkbox"
                                                name={name}
                                                onChange={handleCheckboxChange}
                                                checked={datosCuidados[name] === "S"}
                                                id={name}  // Asegura que cada checkbox tenga un id único
                                            />
                                            <label htmlFor={name} style={{ marginLeft: "8px" }}>
                                                {` ${momento === "m" ? "Mañana" : momento === "t" ? "Tarde" : "Noche"}`}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="cuidado-item">
                            <span>Control de Talla</span>
                            <div className="options">
                                {["mañana", "tarde", "noche", "no aplica"].map((momento) => (
                                    <div
                                        key={momento}
                                        className="checkbox-group"
                                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                    >
                                        <input
                                            className="checkbox-group"
                                            type="checkbox"
                                            name="cue_control_talla"
                                            value={momento}
                                            onChange={handleChange}
                                            checked={datosCuidados.cue_control_talla === momento}
                                            id={`peso_${momento}`}
                                        />
                                        <label htmlFor={`peso_${momento}`}>
                                            {momento.charAt(0).toUpperCase() + momento.slice(1)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Control de Peso</span>
                            <div className="options">
                                {["mañana", "tarde", "noche", "no aplica"].map((momento) => (
                                    <div
                                        key={momento}
                                        className="checkbox-group"
                                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                    >
                                        <input
                                            type="checkbox"
                                            name="cue_control_peso"
                                            value={momento}
                                            onChange={handleChange}
                                            checked={datosCuidados.cue_control_peso === momento}
                                            id={`peso_${momento}`}
                                        />
                                        <label htmlFor={`peso_${momento}`}>
                                            {momento.charAt(0).toUpperCase() + momento.slice(1)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cuidado-item">
                            <span>Curaciones</span>
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
                                            name="cue_curaciones"
                                            value={opcion.value}
                                            checked={datosCuidados?.cue_curaciones === opcion.value}
                                            onChange={handleCheckboxChange}
                                            id={`curaciones_${opcion.value}`}
                                        />
                                        <label htmlFor={`curaciones_${opcion.value}`} style={{ marginLeft: "4px" }}>
                                            {opcion.label}
                                        </label>
                                    </div>
                                ))}
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
                            <span>Líquidos Administrados</span>
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
                                            name="cue_liq_administrados"
                                            value={opcion.value}
                                            checked={datosCuidados?.cue_liq_administrados === opcion.value}
                                            onChange={handleCheckboxChange}
                                            id={`liq_admin_${opcion.value}`}
                                        />
                                        <label htmlFor={`liq_admin_${opcion.value}`} style={{ marginLeft: "4px" }}>
                                            {opcion.label}
                                        </label>
                                    </div>
                                ))}
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

                        <div className="cuidado-item">
                            <span>Líquidos Eliminados</span>
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
                                            name="cue_liq_eliminados"
                                            value={opcion.value}
                                            checked={datosCuidados?.cue_liq_eliminados === opcion.value}
                                            onChange={handleCheckboxChange}
                                            id={`liq_eliminados_${opcion.value}`}
                                        />
                                        <label htmlFor={`liq_eliminados_${opcion.value}`} style={{ marginLeft: "4px" }}>
                                            {opcion.label}
                                        </label>
                                    </div>
                                ))}
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

                        <div className="cuidado-item">
                            <span>Administrar medicamentos</span>
                            <div className="options">
                                {[
                                    { name: 'cue_med_m', label: 'Mañana' },
                                    { name: 'cue_med_t', label: 'Tarde' },
                                    { name: 'cue_med_n', label: 'Noche' }
                                ].map(({ name, label }) => (
                                    <div
                                        key={name}
                                        className="checkbox-group"
                                        style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}
                                    >
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={datosCuidados?.[name] === "S"}
                                            onChange={handleCheckboxChange}
                                            id={`med_${name}`}
                                        />
                                        <label htmlFor={`med_${name}`} style={{ marginLeft: "4px" }}>
                                            {label}
                                        </label>
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
