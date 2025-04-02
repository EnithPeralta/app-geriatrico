import React, { useState } from 'react';
import { useInventarioPaciente } from '../../../hooks';
import Swal from 'sweetalert2';

export const ModalInventarioPaciente = ({ pac_id, onClose }) => {
    const [medicamento, setMedicamento] = useState({
        pac_id,
        med_nombre: '',
        med_presentacion: '',
        unidades_por_presentacion: '',
        med_descripcion: ''
    });

    const { registrarMedicamentoPaciente } = useInventarioPaciente();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMedicamento((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegistrarMedicamento = async (event) => {
        event.preventDefault();
        try {
            const response = await registrarMedicamentoPaciente(medicamento);
            Swal.fire({
                icon: 'success',
                text: response.message
            });
            console.log("Medicamento registrado correctamente.", response);
            onClose(); // Cerrar modal después de registrar
        } catch (error) {
            console.error("Error al registrar medicamento:", error);
            Swal.fire({
                icon: 'error',
                text: error.message
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content-geriatrico">
                    <form onSubmit={handleRegistrarMedicamento}>
                        <div className="modal-field">
                            <label>Nombre:</label>
                            <input type="text" name="med_nombre" value={medicamento.med_nombre} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Presentación:</label>
                            <input type="text" name="med_presentacion" value={medicamento.med_presentacion} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Unidades por Presentación:</label>
                            <input type="number" name="unidades_por_presentacion" value={medicamento.unidades_por_presentacion} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Descripción:</label>
                            <input type="text" name="med_descripcion" value={medicamento.med_descripcion} onChange={handleChange} />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="create">Guardar</button>
                            <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
