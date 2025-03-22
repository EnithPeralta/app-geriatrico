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
                                    <span> Nombre:</span>
                                    <label>
                                        {sede.se_nombre}
                                    </label>

                                    <span>Dirección:</span>
                                    <label>{sede.se_direccion}</label>

                                    <span>Telefono:</span>
                                    <label>{sede.se_telefono}</label>

                                    <span>Cupos Totales:</span>
                                    <label>{sede.cupos_totales}</label>

                                    <span>Cupos Ocupados:</span>
                                    <label>{sede.cupos_ocupados}</label>

                                    <span>Estado</span>
                                    <label>{sede.se_activo ? 'Activo' : 'Inactivo'}</label>
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
