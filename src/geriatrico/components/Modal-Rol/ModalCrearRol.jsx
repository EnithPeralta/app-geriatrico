import { useState } from 'react';

export const ModalCrearRol = ({ isOpen, onClose, onSave }) => {
    const [rolNombre, setRolNombre] = useState('');
    const [rolDescripcion, setRolDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await onSave({ rol_nombre: rolNombre, rol_descripcion: rolDescripcion });

        if (result.success) {
            setRolNombre('');
            setRolDescripcion('');
            onClose();
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <h2 className="rol-name">Crear Nuevo Rol</h2>
                        <div className="modal-field">
                            <input
                                placeholder="Nombre del Rol"
                                className="rol-input"
                                type="text"
                                value={rolNombre}
                                onChange={(e) => setRolNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div className="modal-field">
                            <textarea
                                className="rol-input"
                                value={rolDescripcion}
                                onChange={(e) => setRolDescripcion(e.target.value)}
                                placeholder="Descripción del Rol"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="create" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                            <button className="cancel" type="button" onClick={onClose} disabled={loading}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
