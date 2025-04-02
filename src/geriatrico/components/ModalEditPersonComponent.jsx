import React, { useState, useEffect } from "react";
import { usePersona } from "../../hooks";
import Swal from "sweetalert2";

export const ModalEditPersonComponent = ({ editedPersona, onClose, setPersonas }) => {
    const { updatePerson } = usePersona();
    const [personaEditada, setPersonaEditada] = useState({
        id: "",
        usuario: "",
        nombre: "",
        documento: "",
        correo: "",
        telefono: "",
        genero: "",
        foto: "",
        previewFoto: ""
    });

    useEffect(() => {
        if (editedPersona) {
            setPersonaEditada({
                id: editedPersona.id || "",
                usuario: editedPersona.usuario || "",
                nombre: editedPersona.nombre || "",
                documento: editedPersona.documento || "",
                correo: editedPersona.correo || "",
                telefono: editedPersona.telefono || "",
                genero: editedPersona.genero || "",
                foto: editedPersona.foto || "",
                previewFoto: editedPersona.foto || ""
            });
        }
    }, [editedPersona]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPersonaEditada(prev => ({
                    ...prev,
                    foto: file,
                    previewFoto: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setPersonaEditada(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    console.log("Datos enviados:", editedPersona.documento);


    const handleEditSubmit = async (event) => {
        event.preventDefault();

        if (!personaEditada) return;
        console.log("Datos enviados corregidos:", personaEditada);
        const result = await updatePerson(personaEditada.id, personaEditada);

        console.log("Respuesta del servidor:", result);

        if (result.success) {
            setPersonas(prev =>
                prev.map(p => (p.id === result.persona.id ? result.persona : p))
            );
            onClose();
            Swal.fire({
                icon: "success",
                text: "Persona actualizada exitosamente",
            });
        } else {
            console.error(result.message);
            Swal.fire({
                icon: "error",
                text: result.message,
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleEditSubmit}>
                        <h4 className="h4">Editar Perfil</h4>
                        <div className="modal-img">
                            {personaEditada.previewFoto ? (
                                <img
                                    src={personaEditada.previewFoto}
                                    alt="Foto de perfil"
                                    height={100}
                                    width={100}
                                />
                            ) : (
                                <i className="fas fa-user-circle icon-edit-user"></i>
                            )}
                        </div>

                        {/* Subir nueva foto */}
                        <div className="modal-field">
                            <label>Cambiar foto:</label>
                            <input
                                className="modal-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Campos de edición */}
                        <div className="modal-field">
                            <label>Nombre Completo:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="nombre"
                                value={personaEditada.nombre}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="modal-field">
                            <label>Documento:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="documento"
                                value={personaEditada.documento}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="modal-field">
                            <label>Correo:</label>
                            <input
                                className="modal-input"
                                type="email"
                                name="correo"
                                value={personaEditada.correo}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="modal-field">
                            <label>Teléfono:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="telefono"
                                value={personaEditada.telefono}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="modal-field">
                            <label>Género:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="genero"
                                value={personaEditada.genero}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        {/* Botones */}
                        <div className="modal-buttons">
                            <button type="submit" className="create">
                                Guardar
                            </button>
                            <button type="button" className="cancel" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};