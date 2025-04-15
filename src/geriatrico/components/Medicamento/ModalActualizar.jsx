import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useMedicamento } from '../../../hooks';

export const ModalActualizar = ({ medicamento, onClose }) => {
    const [formData, setFormData] = useState({
        med_nombre: medicamento.med_nombre || '',
        med_presentacion: medicamento.med_presentacion || '',
        unidades_por_presentacion: medicamento.unidades_por_presentacion || '',
        med_descripcion: medicamento.med_descripcion || '',
        med_tipo_contenido: medicamento.med_tipo_contenido || ''
    });

    const { actualizarMedicamento } = useMedicamento();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleActualizarMedicamento = async (event) => {
        event.preventDefault();

        try {
            const response = await actualizarMedicamento(medicamento.med_id, formData);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    text: response.message
                });

                onClose();
            } else {
                Swal.fire({
                    icon: 'error',
                    text: response.message
                });
            }
        } catch (error) {
            console.error("Error al actualizar medicamento:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleActualizarMedicamento}>
                        <h2>Editar Medicamento</h2>
                        <div className="modal-field">
                            <label>Nombre:</label>
                            <input type="text" name="med_nombre" value={formData.med_nombre} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Presentación:</label>
                            <select name="med_presentacion" value={formData.med_presentacion} onChange={handleChange}>
                                <option value="" hidden>Seleccione una presentación</option>
                                <option value="sachet">Sachet</option>
                                <option value="unidad">Unidad</option>
                                <option value="tableta">Tableta</option>
                                <option value="Blíster">Blíster</option>
                                <option value="caja">Caja</option>
                                <option value="frasco">Frasco</option>
                                <option value="crema">Crema</option>
                                <option value="spray">Spray</option>
                                <option value="ampolla">Ampolla</option>
                                <option value="inyección">Inyección</option>
                                <option value="parche">Parche</option>
                                <option value="supositorio">Supositorio</option>
                                <option value="gotas">Gotas</option>
                            </select>
                        </div>
                        <div className="modal-field">
                            <label>Unidades por presentación:</label>
                            <input type="number" name="unidades_por_presentacion" value={formData.unidades_por_presentacion} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Tipo de contenido:</label>
                            <select name="med_tipo_contenido" value={formData.med_tipo_contenido} onChange={handleChange}>
                                <option value="" hidden>Seleccione...</option>
                                <option value="mililitros">Mililitros</option>
                                <option value="gramos">Gramos</option>
                                <option value="unidades">Unidades</option>
                                <option value="miligramos">Miligramos</option>
                                <option value="tabletas">Tabletas</option>
                                <option value="cápsulas">Cápsulas</option>
                                <option value="disparos">Disparos</option>
                                <option value="parches">Parches</option>
                                <option value="gotas">Gotas</option>
                                <option value="supositorios">Supositorios</option>
                                <option value="otros">Otros</option>
                            </select>
                        </div>
                        <div className="modal-field">
                            <label>Descripción:</label>
                            <textarea name="med_descripcion" rows='5' value={formData.med_descripcion} onChange={handleChange} />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="save-button">
                                Actualizar
                            </button>
                            <button type="button" className="cancel-button" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
