import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useInventarioPaciente } from '../../../hooks';

export const ModalStockMedicamentoPac = ({ med_sede_id, med_pac_id, onClose, setMedicamento }) => {
    const [total, setTotal] = useState('');
    const [medOrigen, setMedOrigen] = useState('');
    const { entradaStockMedicamentoInvPaciente } = useInventarioPaciente();

    const handleAgregarStockPac = async (e) => {
        e.preventDefault();

        if (!total || isNaN(total) || total <= 0) {
            Swal.fire({ icon: 'error', text: "Ingrese una cantidad válida." });
            return;
        }

        if (!medOrigen.trim()) {
            Swal.fire({ icon: 'error', text: "Debe indicar el origen del medicamento." });
            return;
        }

        const totalInt = parseInt(total);
        const response = await entradaStockMedicamentoInvPaciente({
            med_sede_id,
            med_pac_id,
            cantidad: totalInt,
            med_origen: medOrigen
        });
        console.log(response);
        

        if (response.success) {
            Swal.fire({ icon: 'success', text: response.message });

            setMedicamento(prevState =>
                prevState.map(med =>
                    med.med_sede_id === med_sede_id
                        ? { ...med, med_total_unidades_disponibles: med.med_total_unidades_disponibles + totalInt }
                        : med
                )
            );

            setTotal('');
            setMedOrigen('');
            onClose();
        } else {
            Swal.fire({ icon: 'error', text: `❌ Error: ${response.message}` });
            console.error(`❌ Error al agregar stock: ${response.message}`);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <h2 className='h4'>Agregar unidades</h2>
                    <form onSubmit={handleAgregarStockPac}>
                        <div className="modal-field">
                            <label>Cantidad:</label>
                            <input
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                min="1"
                            />
                        </div>
                        <div className="modal-field">
                            <label>Origen de medicamento:</label>
                            <select name="presentacion" value={medOrigen} onChange={(e) => setMedOrigen(e.target.value)}
                            >
                                <option value="" hidden>Seleccionar</option>
                                <option value="EPS">EPS</option>
                                <option value="Compra Directa">Compra Directa</option>
                                <option value="Donación">Donación</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="save-button">Guardar</button>
                            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
