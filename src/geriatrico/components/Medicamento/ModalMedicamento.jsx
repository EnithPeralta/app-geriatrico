import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useMedicamento } from '../../../hooks';

export const ModalMedicamento = ({ onClose }) => {
    const [medicamento, setMedicamento] = useState({
        med_nombre: '',
        med_presentacion: '',
        unidades_por_presentacion: '',
        med_descripcion: '',
        med_tipo_contenido: ''
    });
    const { registrarMedicamento } = useMedicamento();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMedicamento((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegistrarMedicamento = async (event) => {
        event.preventDefault();

        try {
            const response = await registrarMedicamento(medicamento);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    text: response.message
                })
                onClose();
                console.log("Medicamento registrado correctamente.", response);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: response.message
                });
            }

        } catch (error) {
            console.error("Error al registrar medicamento:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleRegistrarMedicamento}>
                        <h2>Registrar Medicamento</h2>
                        <div className="modal-field">
                            <label>Nombre:</label>
                            <input type="text" name="med_nombre" value={medicamento.med_nombre} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Presentación:</label>
                            <select name="med_presentacion" value={medicamento.med_presentacion} onChange={handleChange} >
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
                            <input type="number" name="unidades_por_presentacion" value={medicamento.unidades_por_presentacion} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Tipo de contenido:</label>
                            <select name="med_tipo_contenido" value={medicamento.med_tipo_contenido} onChange={handleChange}>
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
                            <textarea
                                type="text"
                                name="med_descripcion"
                                value={medicamento.med_descripcion}
                                onChange={handleChange}
                                rows="5"
                            />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="create">
                                Guardar
                            </button>
                            <button type="button" className="cancel" onClick={onClose} >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};