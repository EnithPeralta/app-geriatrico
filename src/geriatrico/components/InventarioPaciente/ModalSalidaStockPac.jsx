import { useState } from 'react';
import Swal from 'sweetalert2';
import { useInventarioPaciente } from '../../../hooks';

export const ModalSalidaStockPac = ({ onClose, med_sede_id, med_pac_id, setMedicamentos }) => {
    const [total, setTotal] = useState('');
    const [medDestino, setMedDestino] = useState('');
    const { salidaStockMedicamentoInvPaciente } = useInventarioPaciente();

    const handleSalidaStockPac = async (e) => {
        e.preventDefault();

        if (!total || isNaN(total) || total <= 0) {
            Swal.fire({ icon: 'error', text: "Ingrese una cantidad válida." });
            return;
        }

        if (!medDestino.trim()) {
            Swal.fire({ icon: 'error', text: "Debe indicar el destino del medicamento." });
            return;
        }

        const totalInt = parseInt(total);
        const response = await salidaStockMedicamentoInvPaciente({
            med_sede_id,
            med_pac_id,
            cantidad: totalInt,
            med_destino: medDestino
        });

        if (response.success) {
            Swal.fire({ icon: 'success', text: response.message });

            setMedicamentos(prevState =>
                prevState.map(med =>
                    med.med_sede_id === med_sede_id
                        ? {
                            ...med,
                            med_total_unidades_disponibles: med.med_total_unidades_disponibles - totalInt
                        }
                        : med
                )
            );

            setTotal('');
            setMedDestino('');
            onClose();
        } else {
            Swal.fire({ icon: 'error', text: `❌ Error: ${response.message}` });
            console.error(`❌ Error al retirar stock: ${response.message}`);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <h2>Retirar Unidades del Inventario</h2>
                    <form onSubmit={handleSalidaStockPac}>
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
                            <label>Destino del medicamento:</label>
                            <select
                                name="destino"
                                value={medDestino}
                                onChange={(e) => setMedDestino(e.target.value)}
                            >
                                <option value="" hidden>Seleccionar</option>
                                <option value="Baja">Baja</option>
                                <option value="Devolución">Devolución</option>
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
