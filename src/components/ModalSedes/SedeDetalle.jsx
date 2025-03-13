import '../../css/modal.css'
export const SedeDetalle = ({ sedeDetalle, isOpens, onClose }) => {
    if (!isOpens || !sedeDetalle) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="">
                        <img src={sedeDetalle.se_foto} alt="" height={100} width={100} className="modal-image" />
                        <span className="modal-name">{sedeDetalle.se_nombre}</span>
                        <div className='modal-name-sedetalles'>Telefono: {sedeDetalle.se_telefono}</div>
                        <div className='modal-name-sedetalles'> Direccion: {sedeDetalle.se_direccion}</div>
                        <div className='modal-name-sedetalles'>Cupos: {sedeDetalle.cupos_totales}</div>
                    </div>
                    <button onClick={onClose} className="details-button">Cerrar</button>
                </div>

            </div>
        </div>
    );
};
