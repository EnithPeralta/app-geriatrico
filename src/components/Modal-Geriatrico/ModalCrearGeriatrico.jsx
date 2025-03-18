import { useState } from "react";
import '../../css/modal.css';
export const ModalCrearGeriatrico = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        ge_nombre: "",
        ge_nit: "",
        ge_color_principal: "",
        ge_color_secundario: "",
        ge_color_terciario: "",
        ge_logo: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, ge_logo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const result = await onSave(formData);

        if (result.success) {
            setSuccess(result.message);
            setFormData({
                ge_nombre: "",
                ge_nit: "",
                ge_color_principal: "",
                ge_color_secundario: "",
                ge_color_terciario: "",
                ge_logo: null
            });
            setTimeout(() => onClose(), 1500);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal">
                <div className="modal-content-geriatrico">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-field">
                            <label>Nombre</label>
                            <input type="text" name="ge_nombre" value={formData.ge_nombre} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label>NIT</label>
                            <input type="text" name="ge_nit" value={formData.ge_nit} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label>Logo</label>
                            <input type="file" name="ge_logo" accept="image/*" onChange={handleFileChange} required />
                        </div>
                        <div className="color-boxes">
                            <div className="modal-field">
                                <label>Color Principal</label>
                                <input type="color" className="color-box" style={{ backgroundColor: formData.ge_color_principal }} name="ge_color_principal" value={formData.ge_color_principal} onChange={handleChange} required />
                            </div>
                            <div className="modal-field">
                                <label>Color Secundario</label>
                                <input type="color" className="color-box" style={{ backgroundColor: formData.ge_color_secundario }} name="ge_color_secundario" value={formData.ge_color_secundario} onChange={handleChange} required />
                            </div>
                            <div className="modal-field">
                                <label>Color Terciario</label>
                                <input type="color" className="color-box" style={{ backgroundColor: formData.ge_color_terciario }} name="ge_color_terciario" value={formData.ge_color_terciario} onChange={handleChange} required />
                            </div>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <div className="modal-buttons">
                            <button type="submit" className="create" disabled={loading}>
                                {loading ? "Guardando..." : "Crear"}
                            </button>
                            <button type="button" onClick={onClose} className="cancel">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div >
            </div>
        </div>
    );
};
