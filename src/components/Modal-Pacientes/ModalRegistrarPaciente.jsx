import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { usePaciente, useSedesRol } from "../../hooks";

export const ModalRegistrarPaciente = ({ datosIniciales, onClose, selectedRoles }) => {
    const { obtenerDetallePacienteSede, registrarPaciente } = usePaciente();
    const { asignarRolesSede } = useSedesRol();
    const [esActualizacion, setEsActualizacion] = useState(false);
    const [datosPaciente, setDatosPaciente] = useState({
        per_id: datosIniciales?.per_id || "",
        pac_edad: "",
        pac_peso: "",
        pac_talla: "",
        pac_regimen_eps: "",
        pac_nombre_eps: "",
        pac_rh_grupo_sanguineo: "",
        pac_talla_camisa: "",
        pac_talla_pantalon: "",
        rol_id: selectedRoles?.[0] || null,
        sp_fecha_inicio: "",
        sp_fecha_fin: "",
    });

    useEffect(() => {
        if (datosIniciales?.per_id) {
            obtenerDetallePacienteSede(datosIniciales.per_id).then((response) => {
                if (response.success && response.paciente) {
                    const tieneRol = response.paciente.rol_id === selectedRoles?.[0];
                    const rolInactivo = response.paciente.activoRolSede === false;

                    if (!rolInactivo) {
                        setDatosPaciente((prev) => ({
                            ...prev,
                            pac_edad: response.paciente.edad || "",
                            pac_peso: response.paciente.peso || "",
                            pac_talla: response.paciente.talla || "",
                            pac_regimen_eps: response.paciente.regimen_eps || "",
                            pac_nombre_eps: response.paciente.nombre_eps || "",
                            pac_rh_grupo_sanguineo: response.paciente.rh_grupo_sanguineo || "",
                            pac_talla_camisa: response.paciente.talla_camisa || "",
                            pac_talla_pantalon: response.paciente.talla_pantalon || "",
                            rol_id: selectedRoles?.[0] || prev.rol_id,
                            sp_fecha_inicio: response.paciente.sp_fecha_inicio || "",
                            sp_fecha_fin: response.paciente.sp_fecha_fin || "",
                        }));
                    }

                    setEsActualizacion(tieneRol && !rolInactivo);

                    Swal.fire({
                        icon: "info",
                        text: rolInactivo
                            ? "El rol de paciente estaba inactivo. Se debe registrar nuevamente."
                            : tieneRol
                                ? "Este paciente ya tiene este rol asignado. Se han cargado sus datos anteriores."
                                : "Este paciente tiene datos previos, pero el rol es nuevo.",
                        confirmButtonText: "OK",
                    });
                }
            });
        }
    }, [datosIniciales?.per_id, selectedRoles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosPaciente((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAssignSedes = async (per_id, rol_id, sp_fecha_inicio, sp_fecha_fin) => {
        try {
            if (!per_id || !rol_id || !sp_fecha_inicio || !sp_fecha_fin) {
                console.warn("❌ Datos incompletos para la asignación del rol.");
                await Swal.fire({
                    icon: "warning",
                    text: "Por favor, complete todos los campos antes de asignar el rol."
                });
                return false;
            }

            const response = await asignarRolesSede({
                per_id, rol_id, sp_fecha_inicio, sp_fecha_fin
            });

            if (response?.success) {
                console.log("✅ Rol asignado con éxito:", response.message);
                return true;
            } else {
                console.warn("⚠️ Error en la asignación del rol:", response?.message || "Error desconocido.");
                await Swal.fire({
                    icon: "error",
                    text: response?.message || "Hubo un problema al asignar el rol."
                });
                return false;
            }
        } catch (error) {
            console.error("❌ Error inesperado al asignar el rol:", error);
            await Swal.fire({
                icon: "error",
                text: error?.message || "Ocurrió un error inesperado. Inténtelo nuevamente."
            });
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!datosPaciente.per_id || !datosPaciente.rol_id || !datosPaciente.sp_fecha_inicio || !datosPaciente.sp_fecha_fin) {
            console.log("Datos del paciente a registrar:", datosPaciente);
            return Swal.fire({
                icon: "warning",
                text: "⚠️ Faltan datos obligatorios para registrar al paciente.",
            });
        }
        console.log("Datos del paciente a registrar:", datosPaciente);

        const asignacionExitosa = await handleAssignSedes(
            datosPaciente.per_id,
            datosPaciente.rol_id,
            datosPaciente.sp_fecha_inicio,
            datosPaciente.sp_fecha_fin
        );

        if (!asignacionExitosa) {
            return Swal.fire({ icon: 'error', text: 'No se pudo asignar el rol. Registro cancelado.' });
        }

        const response = await registrarPaciente(datosPaciente);

        console.log("Respuesta del servidor:", response);

        if (response.success) {
            Swal.fire({
                icon: "success",
                text: esActualizacion
                    ? "✅ Paciente actualizado correctamente."
                    : "✅ Paciente registrado correctamente.",
            });
            onClose();
        } else {
            Swal.fire({
                icon: "error",
                text: `❌ Error: ${response.message || "Error desconocido"}`,
            });
        }
    };


    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-field">
                        <label>Edad:</label>
                        <input className="modal-input" type="text" name="pac_edad" value={datosPaciente.pac_edad} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Peso:</label>
                        <input className="modal-input" type="text" name="pac_peso" value={datosPaciente.pac_peso} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Estatura:</label>
                        <input className="modal-input" type="text" name="pac_talla" value={datosPaciente.pac_talla} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Régimen EPS:</label>
                        <select
                            name="pac_regimen_eps"
                            value={datosPaciente.pac_regimen_eps}
                            onChange={handleChange}
                            required
                        >
                            <option value="" hidden>Seleccione...</option>
                            <option value="Contributivo">Contributivo</option>
                            <option value="Subsidiado">Subsidiado</option>
                        </select>
                    </div>
                    <div className="modal-field">
                        <label>EPS:</label>
                        <input className="modal-input" type="text" name="pac_nombre_eps" value={datosPaciente.pac_nombre_eps} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Grupo sanguíneo:</label>
                        <select
                            name="pac_rh_grupo_sanguineo"
                            value={datosPaciente.pac_rh_grupo_sanguineo}
                            onChange={handleChange}
                            required
                        >
                            <option value="" hidden>Seleccione...</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div className="modal-field">
                        <label>Talla de camisa:</label>
                        <select
                            name="pac_talla_camisa"
                            value={datosPaciente.pac_talla_camisa}
                            onChange={handleChange}
                            required >
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
                        <label>Talla de pantalón:</label>
                        <input className="modal-input" type="text" name="pac_talla_pantalon" value={datosPaciente.pac_talla_pantalon} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Fecha de inicio:</label>
                        <input className="modal-input" type="date" name="sp_fecha_inicio" value={datosPaciente.sp_fecha_inicio} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Fecha de fin:</label>
                        <input className="modal-input" type="date" name="sp_fecha_fin" value={datosPaciente.sp_fecha_fin} onChange={handleChange} />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="save-button" onClick={handleSubmit}>
                            {esActualizacion ? "Actualizar Paciente" : "Registrar Paciente"}
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
