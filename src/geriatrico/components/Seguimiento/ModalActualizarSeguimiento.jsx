import React, { useEffect, useState } from 'react';
import { useSeguimiento } from '../../../hooks';
import Swal from 'sweetalert2';
import { FaUser } from 'react-icons/fa';

export const ModalActualizarSeguimiento = ({ id, setShowModal, setHistorialSeguimiento }) => {
    const { obtenerSeguimientosPorId, actualizarSeguimientoPaciente } = useSeguimiento();
    const [seguimiento, setSeguimiento] = useState(null);

    const [editedSeguimiento, setEditedSeguimiento] = useState({
        seg_pa: "",
        seg_talla: "",
        seg_fr: "",
        seg_peso: "",
        seg_temp: "",
        seg_fc: "",
        seg_foto: "",
        otro: "",
        seg_glicemia: ""
    });

    useEffect(() => {
        const fetchSeguimiento = async () => {
            console.log("📌 ID recibido en el modal:", id); // Verifica qué ID se está recibiendo
            try {
                const response = await obtenerSeguimientosPorId(id);
                console.log("�� Respuesta de la API - Seguimiento:", response);

                if (response.success) {
                    setSeguimiento(response.data.seguimiento);
                    setEditedSeguimiento(response.data.seguimiento || {
                        seg_pa: "",
                        seg_talla: "",
                        seg_fr: "",
                        seg_peso: "",
                        seg_temp: "",
                        seg_fc: "",
                        seg_foto: "",
                        otro: "",
                        seg_glicemia: ""
                    });
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error("❌ Error al obtener seguimiento:", error);
            }
        };

        fetchSeguimiento();
    }, [id]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSeguimiento((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Crear una URL temporal para la previsualización
            const imageUrl = URL.createObjectURL(file);

            setEditedSeguimiento((prev) => ({
                ...prev,
                seg_foto: file,  // Guardar la imagen como archivo
                seg_foto_preview: imageUrl, // Guardar la URL para mostrar en la interfaz
            }));
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!seguimiento) {
            console.error("❌ No se puede actualizar un seguimiento inexistente.");
            return;
        }

        const result = await actualizarSeguimientoPaciente(id, editedSeguimiento);
        console.log("�� Datos del seguimiento editados:", editedSeguimiento);

        if (result.success) {
            console.log("✅ Seguimiento actualizado con éxito." + result.message);
            Swal.fire({
                icon: 'success',
                text: result.message
            });
            setHistorialSeguimiento(prevHistorial =>
                prevHistorial.map(seg =>
                    seg.seg_id === id ? { ...seg, ...editedSeguimiento } : seg
                )
            );
            setShowModal(false);

        } else {
            console.error("❌ Error al actualizar el seguimiento:", result.message);
            Swal.fire({
                icon: 'error',
                text: result.message
            });
            setShowModal(false); // Cerrar el modal tras la actualización
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content-geriatrico">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-img">
                            {editedSeguimiento && editedSeguimiento.seg_foto_preview ? (
                                <img src={editedSeguimiento.seg_foto_preview} alt="Foto de perfil" height="100px" width="100px" />
                            ) : (
                                <FaUser size={40} />
                            )}
                        </div>

                        <div className="modal-field">
                            <label className="modal-label">Cambiar foto:</label>
                            <input className="modal-input" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Pa:</label>
                            <input type="text" name="seg_pa" value={editedSeguimiento.seg_pa} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Talla:</label>
                            <input type="number" name="seg_talla" value={editedSeguimiento.seg_talla} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">FR:</label>
                            <input type="number" name="seg_fr" value={editedSeguimiento.seg_fr} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Peso:</label>
                            <input type="number" name="seg_peso" value={editedSeguimiento.seg_peso} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Temp:</label>
                            <input type="number" name="seg_temp" value={editedSeguimiento.seg_temp} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">FC:</label>
                            <input type="number" name="seg_fc" value={editedSeguimiento.seg_fc} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Glicemia:</label>
                            <input type="number" name="seg_glicemia" value={editedSeguimiento.seg_glicemia} onChange={handleChange} required />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="create">Guardar</button>
                            <button type="button" className="cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
