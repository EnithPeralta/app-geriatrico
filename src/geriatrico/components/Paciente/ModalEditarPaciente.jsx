import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { usePaciente } from "../../../hooks";

export const ModalEditarPaciente = ({ paciente, cerrarModal }) => {
    const { actualizarDetallePaciente, obtenerDetallePacienteSede } = usePaciente();

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
        const datosFormateados = {
            ...datosPaciente,
            pac_edad: Number(datosPaciente.pac_edad),
        };

        try {
            const result = await actualizarDetallePaciente(datosFormateados.per_id, datosFormateados);

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    text: result.message,
                });

                setDatosPaciente((prev) => ({
                    ...prev,
                    ...result.paciente,
                    pac_edad: Number(result.paciente.pac_edad),
                }));

            }

            cerrarModal();
        } catch (error) {
            console.error("🚨 Error inesperado al editar paciente:", error);
            Swal.fire({
                icon: "error",
                text: "Ocurrió un error inesperado. Inténtalo de nuevo.",
            });
        }
    };





    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <h2>Editar Paciente</h2>
                    <form onSubmit={handleEditarPaciente}>
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
                            <label>Régimen EPS:</label>
                            <select
                                name="pac_regimen_eps"
                                value={datosPaciente.pac_regimen_eps || ""}
                                onChange={handleChange}
                            >
                                <option value="" hidden>Seleccione...</option>
                                <option value="Contributivo">Contributivo</option>
                                <option value="Subsidiado">Subsidiado</option>
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>RH Grupo Sanguíneo:</label>
                            <select
                                name="pac_rh_grupo_sanguineo"
                                value={datosPaciente.pac_rh_grupo_sanguineo || ""}
                                onChange={handleChange}
                            >
                                <option value="" hidden>Seleccione...</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>Talla Camisa (cm):</label>
                            <select
                                name="pac_talla_camisa"
                                value={datosPaciente.pac_talla_camisa || ""}
                                onChange={handleChange}
                            >
                                <option value="" hidden>Seleccione...</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
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
                            <button type="submit" className="save-button">
                                Guardar
                            </button>
                            <button type="button" className="cancel-button" onClick={cerrarModal}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
