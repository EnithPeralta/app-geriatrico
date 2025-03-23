export const RolesDisplayEnfermera = ({ roles }) => {
    if (!roles || (!roles.rolesGeriatrico?.length && !roles.rolesSede?.length)) {
        return null; // No hay roles que mostrar
    }

    return (
        <>
            {roles.rolesSede?.length > 0 && (
                <div className="user-card-container">
                    {roles.rolesSede.map((rol, index) => (
                        <div key={index} className="user-card">
                            <div className="status-icon-active-rol">
                                {rol.activoSede ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{rol.rol}</span>
                                <span className="user-id">{rol.fechaInicio} - {rol.fechaFin || "Indefinido"}</span>
                                <span className="user-id">{rol.activoSede ? "Activo" : "Inactivo"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};