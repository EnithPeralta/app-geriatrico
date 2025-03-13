import { useState, useEffect } from "react";
import '../../css/modal.css'
import { useSelector } from "react-redux";
import { useSede } from "../../hooks";
import Swal from "sweetalert2";

export const SedeModal = ({ isOpen, onClose, onSave, sede }) => {
    const [formData, setFormData] = useState({
        se_nombre: "",
        se_telefono: "",
        se_direccion: "",
        cupos_totales: "",
        se_foto: null,
        rol_id: null, // Agregamos rol_id
        ge_id: null,  // Agregamos ge_id
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { createSede, actualizarSede } = useSede();

    // Obtenemos los datos desde Redux
    const rolSeleccionado = useSelector((state) => state.roles?.rolSeleccionado ?? null);

    useEffect(() => {
        const storedRolId = localStorage.getItem("rol_id");
        const storedGeId = localStorage.getItem("ge_id");

        setFormData((prev) => ({
            ...prev,
            rol_id: rolSeleccionado?.rol_id || (storedRolId ? Number(storedRolId) : null),
            ge_id: rolSeleccionado?.ge_id || (storedGeId ? Number(storedGeId) : null),
        }));

        if (sede) {
            setFormData((prev) => ({
                ...prev,
                se_nombre: sede.se_nombre || "",
                se_telefono: sede.se_telefono || "",
                se_direccion: sede.se_direccion || "",
                cupos_totales: sede.cupos_totales || "",
                se_foto: null,
            }));
            setPreviewImage(sede.se_foto || null);
        } else {
            setPreviewImage(null);
        }
    }, [sede, rolSeleccionado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    se_foto: reader.result, // Guardamos la imagen en base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let result;
        if (sede) {
            result = await actualizarSede(sede.se_id, formData);
        } else {
            result = await createSede(formData);
        }

        if (result.success) {
            onSave(result.sede);
            Swal.fire({
                icon: 'success',
                text: result.message
            })
            onClose();
        } else {
            Swal.fire({
                icon: 'error',
                text: result.message
            });
        }

        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit}>
                        <div className="preview-image">
                            {previewImage && <img src={previewImage} alt="Vista previa" height={100} width={100} className="profile-img" />}
                        </div>
                        <div className="modal-field">
                            <label>Foto</label>
                            <input className="input" type="file" accept="image/*" onChange={handleFileChange} required={!sede} />
                        </div>
                        <div className="modal-field">
                            <label>Nombre</label>
                            <input className="input" type="text" name="se_nombre" placeholder="Nombre de la sede" value={formData.se_nombre} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label>Teléfono</label>
                            <input className="input" type="text" name="se_telefono" placeholder="Teléfono" value={formData.se_telefono} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label>Dirección</label>
                            <input className="input" type="text" name="se_direccion" placeholder="Dirección" value={formData.se_direccion} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label>Cupos Totales</label>
                            <input className="input" type="number" name="cupos_totales" placeholder="Cupos Totales" value={formData.cupos_totales} onChange={handleChange} required />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="create" disabled={loading}>
                                {loading ? "Guardando..." : sede ? "Actualizar" : "Guardar"}
                            </button>
                            <button type="button" onClick={onClose} className="cancel" disabled={loading}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
