import '../../css/modal.css'
export const ModalGeriatrico = ({ geriatrico, isOpen, onClose }) => {
    if (!isOpen || !geriatrico) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <span className="modal-name">{geriatrico.ge_nombre}</span>
                    <p className="modal-nit">NIT: {geriatrico.ge_nit}</p>
                    <ul className="grid">
                        {geriatrico.sedes.length > 0 ? (
                            geriatrico.sedes.map((sede, index) => (
                                <div key={index} className="grid-item">
                                    <img src={sede.se_foto} alt="Logo" className="" height={100} width={100} />
                                    <label> Nombre:</label>
                                    <span>
                                        {sede.se_nombre}
                                    </span>

                                    <label>Dirección:</label>
                                    <span>{sede.se_direccion}</span>

                                    <label>Telefono:</label>
                                    <span>{sede.se_telefono}</span>

                                    <label>Cupos:</label>
                                    <span>{sede.cupos_totales}</span>

                                    <label>Estado</label>
                                    <span>{sede.se_activo ? 'Activo' : 'Inactivo'}</span>
                                </div>
                            ))
                        ) : (
                            <p>No hay sedes registradas</p>
                        )}
                    </ul>
                    <button onClick={onClose} className="details-button">Cerrar</button>
                </div>

            </div>
        </div>
    );
};
