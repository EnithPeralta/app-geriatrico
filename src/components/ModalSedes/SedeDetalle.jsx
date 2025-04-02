import '../../css/modal.css'
export const SedeDetalle = ({ sedeDetalle, isOpens, onClose }) => {
    if (!isOpens || !sedeDetalle) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <img src={sedeDetalle.se_foto} alt="Logo" className="modal-img" />
                    <span className="modal-name">{sedeDetalle.se_nombre}</span>
                    <div className="modal-field">
                        <label>Telefono:</label>
                        <input
                            type="text"
                            value={sedeDetalle.se_telefono}
                            readOnly
                        />
                    </div>
                    <div className="modal-field">
                        <label>Dirección:</label>
                        <input
                            type="text"
                            value={sedeDetalle.se_direccion}
                            readOnly
                        />
                    </div>
                    <div className="modal-field">
                        <label>Cupos Ocupados:</label>
                        <input
                            type="text"
                            value={sedeDetalle.cupos_ocupados}
                            readOnly
                        />
                    </div>
                    <div className="modal-field">
                        <label>Cupos Disponibles:</label>
                        <input
                            type="text"
                            value={sedeDetalle.cupos_disponibles}
                            readOnly
                        />
                    </div>
                    <button onClick={onClose} className="save-button">Cerrar</button>
                </div>

            </div>
        </div>
    );
};
