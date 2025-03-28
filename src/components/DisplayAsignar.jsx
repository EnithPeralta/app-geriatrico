export const DisplayAsignar = ({ geriatrico }) => {
    if (!geriatrico?.data || geriatrico.data.length === 0) return null; 

    return (
        <div className="user-card-container">
            {geriatrico.data.map((item) => (
                <div key={item.ge_id} className="user-card">
                    <h3 className="user-role">{item.ge_nombre}</h3>
                    <p className="user-id"><strong>NIT:</strong> {item.ge_nit}</p>
                    <p className="user-id"><strong>Fecha de Vinculación:</strong> {new Date(item.gp_fecha_vinculacion).toLocaleDateString()}</p>
                    <p className="user-id"><strong>Estado:</strong> {item.gp_activo ?
                        <i className="fa-solid fa-circle-check activo"></i>
                        : <i className="fa-solid fa-circle-xmark inactivo"></i>}
                    </p>
                </div>
            ))}
        </div>
    );
};
