import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { usePaciente } from "../../../hooks";
import { useParams } from "react-router-dom";

export const ModalEditarPaciente = ({ paciente, cerrarModal }) => {
    const { actualizarDetallePaciente, obtenerDetallePacienteSede } = usePaciente();
    const { id } = useParams();

    const [datosPaciente, setDatosPaciente] = useState({
        pac_id: "",
        per_id: "",
        pac_edad: "",
        pac_peso: "",
        pac_talla: "",
        pac_regimen_eps: "",
        pac_nombre_eps: "",
        pac_rh_grupo_sanguineo: "",
        pac_talla_camisa: "",
        pac_talla_pantalon: "",
    });

    // Cargar datos cuando paciente está disponible
    useEffect(() => {
        if (paciente?.per_id) {
            obtenerDetallePacienteSede(paciente.per_id).then((response) => {
                if (response.success && response.paciente) {
                    setDatosPaciente((prev) => ({
                        ...prev,
                        pac_id: response.paciente.pac_id || prev.pac_id,
                        per_id: paciente.per_id,
                        pac_edad: response.paciente.edad || "",
                        pac_peso: response.paciente.peso || "",
                        pac_talla: response.paciente.talla || "",
                        pac_regimen_eps: response.paciente.regimen_eps || "",
                        pac_nombre_eps: response.paciente.nombre_eps || "",
                        pac_rh_grupo_sanguineo: response.paciente.rh_grupo_sanguineo || "",
                        pac_talla_camisa: response.paciente.talla_camisa || "",
                        pac_talla_pantalon: response.paciente.talla_pantalon || "",
                    }));
                }
            });
        }
    }, [paciente?.per_id]);

    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        setDatosPaciente({
            ...datosPaciente,
            [e.target.name]: e.target.value,
        });
    };

    // Manejo de la edición del paciente
    const handleEditarPaciente = async (e) => {
        e.preventDefault();

        try {
            const result = await actualizarDetallePaciente(datosPaciente.per_id, datosPaciente);

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    text: "Los cambios han sido guardados correctamente.",
                });
                console.log("✅ Datos del paciente actualizados:", result.paciente);
            } else {
                Swal.fire({
                    icon: "error",
                    text: result.message || "Hubo un error al actualizar el paciente.",
                });
            }
        } catch (error) {
            console.error("🚨 Error inesperado al editar paciente:", error);
            Swal.fire({
                icon: "error",
                text: "Ocurrió un error inesperado. Inténtalo de nuevo.",
            });
        }
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setDatosPaciente(prev => ({
    //                 ...prev,
    //                 foto: file,  // Guardar el archivo
    //                 previewFoto: reader.result  // Vista previa de la imagen
    //             }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };


    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <h2>Editar Paciente</h2>
                    <form onSubmit={handleEditarPaciente}>
                    {/* <div className="modal-img">
                            {datosPaciente.previewFoto ? (
                                <img
                                    src={datosPaciente.previewFoto}
                                    alt="Foto de perfil"
                                    height={100}
                                    width={100}
                                />
                            ) : datosPaciente.foto ? (
                                <img
                                    src={typeof datosPaciente.foto === "string" ? datosPaciente.foto : URL.createObjectURL(datosPaciente.foto)}
                                    alt="Foto de perfil"
                                    height={100}
                                    width={100}
                                />
                            ) : (
                                <i className="fas fa-user-circle icon-edit-user"></i>
                            )}
                        </div>
                        <div className="modal-field">
                            <label>Cambiar foto:</label>
                            <input
                                className="modal-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div> */}
                        <div className="modal-field">
                            <label>Nombre EPS:</label>
                            <input
                                type="text"
                                name="pac_nombre_eps"
                                value={datosPaciente.pac_nombre_eps || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Edad:</label>
                            <input
                                type="number"
                                name="pac_edad"
                                value={datosPaciente.pac_edad || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Peso (kg):</label>
                            <input
                                type="number"
                                name="pac_peso"
                                value={datosPaciente.pac_peso || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Talla (cm):</label>
                            <input
                                type="number"
                                name="pac_talla"
                                value={datosPaciente.pac_talla || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Regimen EPS:</label>
                            <input
                                type="text"
                                name="pac_regimen_eps"
                                value={datosPaciente.pac_regimen_eps || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>RH Grupo Sanguineo:</label>
                            <input
                                type="text"
                                name="pac_rh_grupo_sanguineo"
                                value={datosPaciente.pac_rh_grupo_sanguineo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Talla Camisa (cm):</label>
                            <input
                                type="text"
                                name="pac_talla_camisa"
                                value={datosPaciente.pac_talla_camisa || ""}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="modal-field">
                            <label>Talla Pantalon (cm):</label>
                            <input
                                type="number"
                                name="pac_talla_pantalon"
                                value={datosPaciente.pac_talla_pantalon || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="btn btn-success">
                                Guardar
                            </button>
                            <button type="button" className="btn btn-danger" onClick={cerrarModal}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
