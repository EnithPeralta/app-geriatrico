import { useState } from 'react';
import Swal from 'sweetalert2';
import { useInventarioSede } from '../../../hooks';

export const ModalSalidaStock = ({ onClose, med_sede_id, setMedicamentos, medicamento }) => {
    const { salidaStockMedicamentoInvSede } = useInventarioSede();

    const [cantidad, setCantidad] = useState('');
    const [med_destino, setMedDestino] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cantidad || cantidad <= 0 || !med_destino) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, completa todos los campos correctamente.'
            });
            return;
        }

        const response = await salidaStockMedicamentoInvSede(med_sede_id, Number(cantidad), med_destino);

        if (response.success) {
            Swal.fire({
                icon: 'success',
                text: response.message
            });

            // Actualiza el stock en la lista
            setMedicamentos(prev =>
                prev.map(med =>
                    med.med_sede_id === med_sede_id
                        ? { ...med, med_total_unidades_disponibles: response.data.med_total_unidades_disponibles }
                        : med
                )
            );

            onClose();
        } else {
            Swal.fire({
                icon: 'error',
                text: response.message
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <h2>Registrar Salida de Stock</h2>

                        <div className="modal-field">
                            <label>Cantidad a retirar:</label>
                            <input
                                type="number"
                                name="cantidad"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                min="1"
                                max={medicamento?.med_total_unidades_disponibles || 999}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Destino:</label>
                            <select name="med_destino" id=""
                                value={med_destino} onChange={(e) => setMedDestino(e.target.value)}>
                                <option value="">Seleccione una opción</option>
                                <option value="Baja">Baja</option>
                                <option value="Devolución">Devolución</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="save-button">Registrar</button>
                            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
