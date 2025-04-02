import React, { useState } from 'react';
import { useInventarioSede } from '../../../hooks';
import Swal from 'sweetalert2';

export const ModalInventarioSede = ({ onClose, setMedicamentos }) => {
    const [medicamento, setMedicamento] = useState({
        med_nombre: '',
        med_presentacion: '',
        unidades_por_presentacion: '',
        med_descripcion: ''
    });
    const { registrarMedicamentoSede } = useInventarioSede();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMedicamento((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegistrarMedicamento = async (event) => {
        event.preventDefault();

        try {
            const response = await registrarMedicamentoSede(medicamento);
            Swal.fire({
                icon: 'success',
                text: response.message
            })
            setMedicamentos(prevMedicamentos => [...prevMedicamentos, response.data]);

            onClose(); // Cerrar modal al registrar medicamento
            console.log("Medicamento registrado correctamente.", response);

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
                            <input type="text" name="med_presentacion" value={medicamento.med_presentacion} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Unidades por presentación:</label>
                            <input type="number" name="unidades_por_presentacion" value={medicamento.unidades_por_presentacion} onChange={handleChange} />
                        </div>
                        <div className="modal-field">
                            <label>Descripción:</label>
                            <textarea
                                type="text"
                                name="med_descripcion"
                                value={medicamento.med_descripcion}
                                onChange={handleChange}
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