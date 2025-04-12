import React from 'react';
import { CheckboxField, SelectSede } from '../../../components';

export const AssignCardColaborador = ({
    selectedRoles,
    setSelectedRoles,
    selectedSedes,
    setSelectedSedes,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    assigning,
    handleAssignRole,
    handleAssignSedes,
    onClose // Asegúrate de que onClose se pase como prop
}) => {


    return (
        <div className='modal-overlay'>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <div className="modal-content-geriatrico">
                    <CheckboxField
                        name="rol_id"
                        value={selectedRoles}
                        onChange={(roles) => setSelectedRoles(roles.map(Number))}
                    />
                    {selectedRoles.includes(3) && (
                        <SelectSede
                            name="se_id"
                            value={selectedSedes}
                            onChange={(e) => setSelectedSedes(Number(e.target.value))}
                        />
                    )}
                    <div className="form-group">
                        <label>Fecha de Inicio:</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            className="date-input"
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
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
                        className='create'
                            type="submit"
                            onClick={() => selectedRoles.includes(3) ? handleAssignRole() : handleAssignSedes()}
                            disabled={assigning}
                        >
                            {assigning ? "Asignando..." : "Asignar"}
                        </button>
                        <button type="button" className="cancel" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};