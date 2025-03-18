import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const ModalUpdateProfile = ({ persona, updatePersona, setPersona, showModal, setShowModal }) => {
    const [editedPersona, setEditedPersona] = useState({
        usuario: "",
        correo: "",
        telefono: "",
        foto: "",
    });

    // Sincronizar el estado con `persona`
    useEffect(() => {
        if (persona) {
            setEditedPersona({
                usuario: persona.usuario || "",
                correo: persona.correo || "",
                telefono: persona.telefono || "",
                foto: persona.foto || "",
            });
        }
    }, [persona]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedPersona((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedPersona((prev) => ({
                    ...prev,
                    foto: reader.result, // Guardamos la imagen en base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos a enviar desde el modal:", editedPersona);

        // Convertir las claves a las que espera el backend
        const datosEnviar = {
            per_usuario: editedPersona.usuario,
            per_correo: editedPersona.correo,
            per_telefono: editedPersona.telefono,
            per_foto: editedPersona.foto,
        };

        const result = await updatePersona(datosEnviar); // Se envía con las claves correctas
        console.log("Respuesta del servidor:", result);
        if (result.success) {
            setPersona(result.persona);
            Swal.fire({
                icon: 'success',
                text: result.message
            })
            setShowModal(false);
        } else {
            console.error(result.message);
        }
    };

    return showModal ? (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content-geriatrico">
                    <form onSubmit={handleSubmit}>
                        <div className="profile-img">
                            {editedPersona.foto ? (
                                <img src={editedPersona.foto} alt="Foto de perfil" height="100px" width="100px" />
                            ) : (
                                <i className="fas fa-user-circle"></i>
                            )}
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Cambiar foto:</label>
                            <input className="modal-input" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Usuario:</label>
                            <input className="modal-input" type="text" name="usuario" value={editedPersona.usuario} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Correo:</label>
                            <input className="modal-input" type="email" name="correo" value={editedPersona.correo} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Teléfono:</label>
                            <input className="modal-input" type="text" name="telefono" value={editedPersona.telefono} onChange={handleChange} required />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="create">Guardar</button>
                            <button type="button" className="cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    ) : null;
};
