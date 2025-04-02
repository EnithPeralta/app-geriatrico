import React, { useState } from 'react'; 
import { useInventarioSede } from '../../../hooks';
import Swal from 'sweetalert2';

export const ModalStockMedicamento = ({ med_sede_id, onClose, setMedicamento }) => {
    const [total, setTotal] = useState('');
    const { agregarStockMedicamento } = useInventarioSede();

    const handleAgregarStock = async (e) => {
        e.preventDefault();

        if (!total || isNaN(total) || total <= 0) {
            Swal.fire({
                icon: 'error',
                text: "Ingrese una cantidad válida."
            });
            return;
        }

        const totalInt = parseInt(total);
        const response = await agregarStockMedicamento(med_sede_id, totalInt);

        if (response.success) {
            Swal.fire({
                icon: 'success',
                text: response.message
            });

            // ✅ Actualizamos el stock del medicamento directamente
            setMedicamento(prevState =>
                prevState.map(med =>
                    med.med_sede_id === med_sede_id
                        ? { ...med, med_total_unidades_disponibles: med.med_total_unidades_disponibles + totalInt }
                        : med
                )
            );

            setTotal('');
            onClose();
        } else {
            Swal.fire({
                icon: 'error',
                text: `❌ Error: ${response.message}`
            });
            console.error(`❌ Error al agregar stock: ${response.message}`);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <h2>Agregar Unidades Disponibles</h2>
                    <form onSubmit={handleAgregarStock}>
                        <div className="modal-field">
                            <input
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                min="1"
                            />
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
