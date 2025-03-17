export const RolesDisplayComponet = ({ roles }) => {
    if (roles.rolesGeriatrico.length === 0 && roles.rolesSede.length === 0) {
        return null; // No hay roles que mostrar
    }

    return (
        <>
            {roles.rolesGeriatrico.length > 0 && (
                <div className="user-card-container">
                    {roles.rolesGeriatrico.map((rol, index) => (
                        <div key={index} className="user-details">
                            <div className="status-icon-active-rol">
                                {rol.rol_activo ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <span className="user-name">{rol.rol_nombre}</span>
                            <span className="user-id">{rol.fechaInicio} - {rol.fechaFin ? rol.fechaFin : "Indefinido"}</span>
                        </div>
                    ))}
                </div>
            )}

            {roles.rolesSede.length > 0 && (
                <div className="sede-card-asignar">
                    {roles.rolesSede.map((rol, index) => (
                        <div key={index} className="">
                            <div className="status-icon-active-rol">
                                {rol.rol_activo ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{rol.rol_nombre}</span>
                                <span className="user-id">{rol.sede.se_nombre}</span>
                                <span className="user-id">{rol.fechaInicio} - {rol.fechaFin ? rol.fechaFin : "Indefinido"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};