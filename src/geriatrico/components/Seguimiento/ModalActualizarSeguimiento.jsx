import React, { useEffect, useState } from 'react';
import { useSeguimiento } from '../../../hooks';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const ModalActualizarSeguimiento = ({ setShowModal }) => {
    const { id } = useParams();
    const { obtenerSeguimientosPorId, actualizarSeguimientoPaciente } = useSeguimiento();
    const [seguimiento, setSeguimiento] = useState(null);

    const [editedSegimiento, setEditedSegimiento] = useState({
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
            try {
                const response = await obtenerSeguimientosPorId(id);
                console.log("�� Respuesta de la API - Seguimiento:", response);

                if (response.success) {
                    setSeguimiento(response.data.seguimiento);
                    setEditedSegimiento(response.data.seguimiento || {
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
        setEditedSegimiento((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedSegimiento((prev) => ({
                    ...prev,
                    seg_foto: reader.result, // Guardamos la imagen en base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!seguimiento) {
            console.error("❌ No se puede actualizar un seguimiento inexistente.");
            return;
        }

        const result = await actualizarSeguimientoPaciente(id, editedSegimiento);

        if (result.success) {
            console.log("✅ Seguimiento actualizado con éxito.");
            Swal.fire({
                icon: 'success',
                text: result.message
            });
            setShowModal(false); // Cerrar el modal tras la actualización
        } else {
            console.error("❌ Error al actualizar el seguimiento:", result.message);
            Swal.fire({
                icon: 'error',
                text: result.message
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="profile-img">
                            {editedSegimiento && editedSegimiento.seg_foto ? (
                                <img src={editedSegimiento.seg_foto} alt="Foto de perfil" height="100px" width="100px" />
                            ) : (
                                <i className="fas fa-user-circle"></i>
                            )}
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Cambiar foto:</label>
                            <input className="modal-input" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Pa:</label>
                            <input type="text" name="seg_pa" value={editedSegimiento.seg_pa} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Talla:</label>
                            <input type="number" name="seg_talla" value={editedSegimiento.seg_talla} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">FR:</label>
                            <input type="number" name="seg_fr" value={editedSegimiento.seg_fr} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Peso:</label>
                            <input type="number" name="seg_peso" value={editedSegimiento.seg_peso} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Temp:</label>
                            <input type="number" name="seg_temp" value={editedSegimiento.seg_temp} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">FC:</label>
                            <input type="number" name="seg_fc" value={editedSegimiento.seg_fc} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Glicemia:</label>
                            <input type="number" name="seg_glicemia" value={editedSegimiento.seg_glicemia} onChange={handleChange} required />
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
