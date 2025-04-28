import { useState } from "react";

export const RolesDisplayColaborador = ({ roles }) => {
    const [searchDate, setSearchDate] = useState(""); // Estado para la búsqueda por fecha
    const [isOpen, setIsOpen] = useState(true); // Estado para controlar la visibilidad del modal

    if (!roles || (!roles.rolesGeriatrico?.length && !roles.rolesSede?.length) || !isOpen) {
        return null; // No hay roles que mostrar o el modal está cerrado
    }


    // Filtrar roles por fecha de inicio si se ha ingresado una fecha en el buscador
    const filteredRoles = searchDate
        ? roles.rolesSede.filter((rol) => rol.fechaInicio === searchDate)
        : roles.rolesSede;

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            {roles.rolesSede?.length > 0 && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">

                            {/* Buscador por fecha */}
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="search-input-field"
                                placeholder="Buscar por fecha"
                            />
                            {/* Botón para cerrar el modal */}
                            <button className="close-btn" onClick={handleCloseModal}>
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        {/* Tabla de roles */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Estado</th>
                                    <th>Rol</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoles.length > 0 ? (
                                    filteredRoles.map((rol, index) => (
                                        <tr key={index}>
                                            <td>
                                                {rol.activoSede ? (
                                                    <i className="fa-solid fa-circle-check activo"></i>
                                                ) : (
                                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                                )}
                                            </td>
                                            <td>{rol.rol}</td>
                                            <td>{rol.fechaInicio}</td>
                                            <td>{rol.fechaFin || "Indefinido"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No hay roles para la fecha seleccionada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};
