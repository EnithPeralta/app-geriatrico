import React from 'react'

export const ModalDetalle = ({ selectedMedicamento, setSelectedMedicamento }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{selectedMedicamento.med_nombre}</h2>
                        <button
                            className="close-btn"
                            onClick={() => setSelectedMedicamento(false)}
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                    </div>
                    <div className='modal-field'>
                        <label>Presentación:</label>
                        <input
                            type="text"
                            value={selectedMedicamento.med_presentacion}
                            readOnly
                        />
                    </div>
                    <div className='modal-field'>
                        <label>Unidades por presentación:</label>
                        <input
                            type="number"
                            value={selectedMedicamento.unidades_por_presentacion}
                            readOnly
                        />
                    </div>
                    <div className='modal-field'>
                        <label>Descripción:</label>
                        <textarea
                            value={selectedMedicamento.med_descripcion}
                            readOnly
                            rows="5"
                            cols="50"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
