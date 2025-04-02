import React, { useEffect, useRef, useState } from 'react';
import { usePaciente, useSeguimiento } from '../../hooks';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../css/segimiento.css';
import Webcam from 'react-webcam';
import { formatFecha } from '../../utils';
import { FaCamera } from 'react-icons/fa';

export const SeguimientoPage = () => {
    const { obtenerDetallePacienteSede } = usePaciente();
    const { registrarSeguimientoPaciente } = useSeguimiento();
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [camaraActiva, setCamaraActiva] = useState(false);
    const webcamRef = useRef(null);
    const [fotoTomada, setFotoTomada] = useState(false);

    const [datosSeguimiento, setDatosSeguimiento] = useState({
        pac_id: Number(id),
        seg_fecha: "",
        seg_pa: "",
        seg_talla: "",
        seg_fr: "",
        seg_peso: "",
        seg_temp: "",
        seg_fc: "",
        seg_glicemia: "",
        seg_foto: "",
        otro: ""
    });

    useEffect(() => {
        const fetchPaciente = async () => {
            console.log("ID del paciente:", id); // Verifica el id

            try {
                const response = await obtenerDetallePacienteSede(id);
                console.log(response);
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

    const handleChange = (e) => {
        setDatosSeguimiento({
            ...datosSeguimiento,
            [e.target.name]: e.target.value
        });
    };

    const capturePhoto = async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            console.error("❌ No se pudo capturar la imagen.");
            return;
        }

        setPreview(imageSrc);
        setFotoTomada(true);

        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();

            // Redimensionar la imagen antes de enviarla
            const resizedBlob = await resizeImage(blob, 800, 600, 0.7); // 800x600px, calidad 70%

            const reader = new FileReader();
            reader.onloadend = () => {
                setDatosSeguimiento(prev => ({
                    ...prev,
                    seg_foto: reader.result
                }));
            };
            reader.readAsDataURL(resizedBlob);
        } catch (error) {
            console.error("❌ Error al convertir la imagen en archivo:", error);
        }
    };

    // Función para redimensionar imagen
    const resizeImage = (blob, maxWidth, maxHeight, quality) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;

                // Ajustar tamaño proporcionalmente
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(blob => resolve(blob), "image/jpeg", quality);
            };
            img.onerror = error => reject(error);
        });
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFotoTomada(false);
                setDatosSeguimiento(prev => ({
                    ...prev,
                    seg_foto: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    const resetSelection = () => {
        setPreview(null);
        setFotoTomada(false);
        setDatosSeguimiento(prev => ({ ...prev, seg_foto: null }));
    };

    const handleRegistrarSeguimientoPaciente = async (event) => {
        event.preventDefault();


        try {
            // Convertir pac_id a número si el backend lo requiere
            const datosAEnviar = {
                ...datosSeguimiento,
                pac_id: paciente?.pac_id,
                seg_fecha: formatFecha()
            };

            // Eliminar `seg_foto` si no hay imagen
            if (!datosAEnviar.seg_foto) delete datosAEnviar.seg_foto;

            console.log("📡 Datos a enviar:", datosAEnviar);

            const result = await registrarSeguimientoPaciente(datosAEnviar);

            console.log("📡 Respuesta del servidor:", result);

            if (result.success) {
                Swal.fire({ icon: "success", text: result.message });
                setDatosSeguimiento({});
            } else {
                Swal.fire({ icon: "error", text: result.message });
            }
        } catch (error) {
            console.error("Error al registrar el seguimiento del paciente:", error);
            Swal.fire({ icon: "error", text: "Hubo un error al registrar el seguimiento." });
        }
    };


    const handleHistory = () => {
        navigate(`/geriatrico/historial/${paciente?.pac_id}`);
    };


    return (
        <div className='animate__animated animate__fadeInUp'>
            <div className='main-container'>
                <div className='content'>
                    <div className='report-header'>
                        <h2 className="h4">Seguimiento de pacientes</h2>
                    </div>
                    <div className='button-container'>
                        <button className='save-button' onClick={handleHistory}>Historial</button>
                    </div>
                    <form onSubmit={handleRegistrarSeguimientoPaciente}>
                        <div className="seguimiento-item">
                            {!camaraActiva ? (
                                <button type="button" className='save-button' onClick={() => setCamaraActiva(true)}>
                                    <FaCamera />
                                </button>
                            ) : !fotoTomada ? (
                                <>
                                    <Webcam ref={webcamRef} audio={false} screenshotFormat="image/png" width={350} height={350} />
                                    <button type="button" className='save-button' onClick={capturePhoto}>Tomar Foto</button>
                                </>
                            ) : (
                                <div>
                                    <img src={preview} alt="Foto tomada" width={350} height={350} />
                                    <button type="button" onClick={resetSelection} className='cancel-button'>Volver a tomar</button>
                                </div>
                            )}
                        </div>

                        <div className="seguimiento-item">
                            <label>Foto:</label>
                            <input type="file" name="seg_foto" onChange={handleFileChange} />
                        </div>

                        {preview && (
                            <div>
                                <img src={preview} alt="Vista previa" width={200} style={{ marginTop: "10px" }} />
                                <button type="button" onClick={resetSelection} className='cancel-button'>Eliminar</button>
                            </div>
                        )}

                        <div className="seguimiento-item">
                            <label>Presión Arterial:</label>
                            <input type="text" name="seg_pa" value={datosSeguimiento.seg_pa} onChange={handleChange} />
                        </div>

                        <div className="seguimiento-item">
                            <label>Frecuencia Cardiaca:</label>
                            <input type="text" name="seg_fc" value={datosSeguimiento.seg_fc} onChange={handleChange} />
                        </div>
                        <div className="seguimiento-item">
                            <label>Frecuencia Respiratoria:</label>
                            <input type="text" name="seg_fr" value={datosSeguimiento.seg_fr} onChange={handleChange} />
                        </div>

                        <div className="seguimiento-item">
                            <label>Temperatura:</label>
                            <input type="text" name="seg_temp" value={datosSeguimiento.seg_temp} onChange={handleChange} />
                        </div>

                        <div className="seguimiento-item">
                            <label>Peso:</label>
                            <input type="text" name="seg_peso" value={datosSeguimiento.seg_peso} onChange={handleChange} />
                        </div>

                        <div className="seguimiento-item">
                            <label>Talla:</label>
                            <input type="text" name="seg_talla" value={datosSeguimiento.seg_talla} onChange={handleChange} />
                        </div>

                        <div className="seguimiento-item">
                            <label>Glicemia:</label>
                            <input type="text" name="seg_glicemia" value={datosSeguimiento.seg_glicemia} onChange={handleChange} />
                        </div>

                        <div className="seguimiento-item">
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