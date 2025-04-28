import React from 'react'
import { SelectSede } from '../SelectSede/SelectSede'

export const ModalAdminSede = ({ selectedRoles, selectedSedes, setSelectedSedes, handleAssignAdminSede, handleAssignSedes, assigning, fechaInicio, setFechaInicio, fechaFin, setFechaFin, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    {selectedRoles.includes(3) && (
                        <SelectSede
                            name="se_id"
                            value={selectedSedes}
                            onChange={(e) => setSelectedSedes(Number(e.target.value))}
                        />
                    )}
                    <div className="modal-field">
                        <label>Fecha de Inicio:</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            className="date-input"
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Fecha de Fin (opcional):</label>
                        <input
                            type="date"
                            className="date-input"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button
                            className='save-button'
                            type="submit"
                            onClick={() => selectedRoles.includes(3) ? handleAssignAdminSede() : handleAssignSedes()}
                            disabled={assigning}
                        >
                            {assigning ? "Asignando..." : "Asignar"}
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}
