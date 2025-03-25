import React, { useEffect, useState } from 'react';
import { SideBarComponent } from '../../components';
import { usePaciente, useSeguimiento } from '../../hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { PInformation } from '../layout/PInformation';
import Swal from 'sweetalert2';
import '../../css/segimiento.css';

export const SeguimientoPage = () => {
    const { obtenerAcudientesDePaciente, obtenerDetallePacienteSede } = usePaciente();
    const { registrarSeguimientoPaciente } = useSeguimiento();
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);

    const [datosSeguimiento, setDatosSeguimiento] = useState({
        pac_id: id,
        seg_pa: "",
        seg_talla: "",
        seg_fr: "",
        seg_peso: "",
        seg_temp: "",
        seg_fc: "",
        seg_glicemia: "",
        seg_foto: null,
        otro: ""
    });

    useEffect(() => {
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
    }, [id]);

    const handleAcudiente = async () => {
        if (!paciente?.pac_id) return;
        try {
            await obtenerAcudientesDePaciente(paciente.pac_id);
            navigate(`/geriatrico/acudiente/${paciente.pac_id}`);
        } catch {
            setError("Error al obtener el detalle del paciente.");
        }
    };

    const handleChange = (e) => {
        setDatosSeguimiento({ ...datosSeguimiento, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setDatosSeguimiento(prevState => ({
            ...prevState,
            seg_foto: file
        }));
    };


    const handleRegistrarSeguimientoPaciente = async (event) => {
        event.preventDefault();

        if (!datosSeguimiento || Object.keys(datosSeguimiento).length === 0) {
            Swal.fire({ icon: "error", text: "Los datos del seguimiento están vacíos." });
            return;
        }

        try {
            const pacId = Number(paciente.pac_id);

            // Clonar datosSeguimiento y eliminar seg_foto si es null
            const datosAEnviar = { ...datosSeguimiento };
            if (!datosAEnviar.seg_foto) {
                delete datosAEnviar.seg_foto;
            }

            console.log("📡 Datos a enviar:", { pacId, ...datosAEnviar });

            const result = await registrarSeguimientoPaciente(pacId, datosAEnviar);

            console.log("📡 Respuesta del servidor:", result);

            if (result.success) {
                Swal.fire({ icon: "success", text: result.message });
                setDatosSeguimiento({
                    pac_id: id,
                    seg_pa: "",
                    seg_talla: "",
                    seg_fr: "",
                    seg_peso: "",
                    seg_temp: "",
                    seg_fc: "",
                    seg_glicemia: "",
                    otro: "",
                });
            } else {
                Swal.fire({ icon: "error", text: result.message });
            }
        } catch (error) {
            console.error("Error al registrar el seguimiento del paciente:", error);
            Swal.fire({ icon: "error", text: "Hubo un error al registrar el seguimiento." });
        }
    };

    const handleHistory = async () => {
        navigate(`/geriatrico/historial/${paciente.per_id}`);
    }

    return (
        <div className='animate__animated animate__fadeInUp '>
            <div className='main-container'>
                <div className='content'>
                        <h2 className="">Seguimiento de pacientes</h2>
                        <div className='button-container'>
                            <button className='save-button' onClick={() => { handleHistory(paciente?.pac_id) }} >Historial</button>
                        </div>
                    <form onSubmit={handleRegistrarSeguimientoPaciente} className="">
                        <div className="segimiento-item">
                            <label>Foto:</label>
                            <input type="file" name="seg_foto" onChange={handleFileChange} />
                        </div>

                        <div className="segimiento-item">
                            <label>Presión Arterial:</label>
                            <input type="text" name="seg_pa" value={datosSeguimiento.seg_pa} onChange={handleChange} />
                        </div>

                        <div className="segimiento-item">
                            <label>Frecuencia Cardiaca:</label>
                            <input type="text" name="seg_fc" value={datosSeguimiento.seg_fc} onChange={handleChange} />
                        </div>
                        <div className="segimiento-item">
                            <label>Frecuencia Respiratoria:</label>
                            <input type="text" name="seg_fr" value={datosSeguimiento.seg_fr} onChange={handleChange} />
                        </div>

                        <div className="segimiento-item">
                            <label>Temperatura:</label>
                            <input type="text" name="seg_temp" value={datosSeguimiento.seg_temp} onChange={handleChange} />
                        </div>

                        <div className="segimiento-item">
                            <label>Peso:</label>
                            <input type="text" name="seg_peso" value={datosSeguimiento.seg_peso} onChange={handleChange} />
                        </div>

                        <div className="segimiento-item">
                            <label>Talla:</label>
                            <input type="text" name="seg_talla" value={datosSeguimiento.seg_talla} onChange={handleChange} />
                        </div>

                        <div className="segimiento-item">
                            <label>Glicemia:</label>
                            <input type="text" name="seg_glicemia" value={datosSeguimiento.seg_glicemia} onChange={handleChange} />
                        </div>

                        <div className="segimiento-item">
                            <label>Otro:</label>
                            <input type="text" name="otro" value={datosSeguimiento.otro} onChange={handleChange} />
                        </div>

                        <button type="submit" className='save-button'>Registrar Seguimiento</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
