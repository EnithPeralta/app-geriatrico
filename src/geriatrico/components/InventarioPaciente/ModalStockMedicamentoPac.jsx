import React, { useState } from 'react';
import { useInventarioPaciente } from '../../../hooks';
import Swal from 'sweetalert2';

export const ModalStockMedicamentoPac = ({ med_pac_id, onClose, setMedicamento }) => {
    const [cantidad, setCantidad] = useState('');
    const { agregarStockMedicamentoPac } = useInventarioPaciente();

    console.log('med_pac_id', med_pac_id);
    const handleAgregarStock = async (e) => {
        e.preventDefault();

        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            Swal.fire({
                icon: 'error',
                text: "Ingrese una cantidad válida."
            });
            return;
        }

        const cantidadInt = parseInt(cantidad, 10);
        const response = await agregarStockMedicamentoPac({
            med_pac_id,
            med_cantidad: cantidadInt
        });

        if (response.success) {
            Swal.fire({
                icon: 'success',
                text: response.message
            });

            // ✅ Actualizamos el stock del medicamento directamente
            setMedicamento(prevState =>
                prevState.map(med =>
                    med.med_pac_id === med_pac_id
                        ? { ...med, med_cantidad: med.med_cantidad + cantidadInt }
                        : med
                )
            );

            setCantidad('');
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
                <div className="modal-content-geriatrico">
                    <h2>Agregar Cantidad de Medicamento</h2>
                    <form onSubmit={handleAgregarStock}>
                        <div className="modal-field">
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                placeholder="Cantidad a agregar"
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
