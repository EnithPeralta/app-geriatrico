import { useState, useEffect } from "react";
import "../../../css/roles.css";

export const ModalEditarRol = ({ isOpen, onClose, rol, onUpdate }) => {
    const [rolNombre, setRolNombre] = useState("");
    const [rolDescripcion, setRolDescripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar los datos del rol cuando se abra el modal
    useEffect(() => {
        if (rol) {
            setRolNombre(rol.rol_nombre || "");
            setRolDescripcion(rol.rol_descripcion || "");
        }
    }, [rol]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const response = await onUpdate({
            rol_id: rol?.rol_id,
            rol_nombre: rolNombre,
            rol_descripcion: rolDescripcion,
        });

        setLoading(false);

        if (response.success) {
            onClose(); // Cierra el modal si la actualización es exitosa
        } else {
            setError(response.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal">

                <div className="modal-content-geriatrico" onClick={(e) => e.stopPropagation()}>
                    <h2 className="rol-name">Editar Rol</h2>

                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={handleSubmit} className="rol-form-edit">
                        <input
                            placeholder="Nombre del Rol"
                            className="rol-input"
                            type="text"
                            value={rolNombre}
                            onChange={(e) => setRolNombre(e.target.value)}
                            required
                        />
                        <textarea
                            className="rol-input"
                            value={rolDescripcion}
                            onChange={(e) => setRolDescripcion(e.target.value)}
                            placeholder="Descripción del Rol"
                            rows={3}
                            required
                        />
                        <div className="rol-buttons">
                            <button className="create" type="submit" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </button>
                            <button className="cancel" type="button" onClick={onClose} disabled={loading}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
