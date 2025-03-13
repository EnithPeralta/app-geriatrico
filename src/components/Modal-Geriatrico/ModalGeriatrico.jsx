import '../../css/modal.css'
export const ModalGeriatrico = ({ geriatrico, isOpen, onClose }) => {
    if (!isOpen || !geriatrico) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div>
                        <span className="modal-name">{geriatrico.ge_nombre}</span>
                        <p className="geriatrico-nit-modal">NIT: {geriatrico.ge_nit}</p>
                    </div>
                    <ul className="grid">
                        {geriatrico.sedes.length > 0 ? (
                            geriatrico.sedes.map((sede, index) => (
                                <div key={index} className="grid-item">
                                    <img src={sede.se_foto} alt="Logo" className="" height={100} width={100} />
                                    <div className="modal-name-sede">Nombre: {sede.se_nombre}</div>
                                    <div className="modal-name-sede">Dirección: {sede.se_direccion}</div>
                                    <div className="modal-name-sede">Teléfono: {sede.se_telefono}</div>
                                    <div className="modal-name-sede">Cupos: {sede.cupos_totales}</div>
                                    
                                    <div className="status-icon-modal">
                                        {sede.se_activo ? (
                                            <i className="fa-solid fa-circle-check activo"></i>
                                        ) : (
                                            <i className="fa-solid fa-circle-xmark inactivo"></i>
                                        )}
                                    </div>
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
