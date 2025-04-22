import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSedesRol } from "../../hooks";
import { SelectRolEnfermera } from "../SelectRolEnfermera";

export const ModalEnfermera = ({
    datosInicial,
    onRegistrar,
    onClose,
    selectedRoles,
    setSelectedRoles,
}) => {
    const { asignarRolesSede } = useSedesRol();

    const [datosPersona, setDatosPersona] = useState({
        per_id: datosInicial?.per_id || "",
        per_nombre_completo: "",
        per_documento: "",
        per_correo: "",
        per_telefono: "",
        per_genero: "",
        per_usuario: "",
        per_password: "",
    });

    const [datosEnfermera, setDatosEnfermera] = useState({
        enf_codigo: "",
        rol_id: selectedRoles || null,
        sp_fecha_inicio: "",
        sp_fecha_fin: "",
    });

    useEffect(() => {
        if (datosInicial) {
            setDatosPersona((prev) => ({ ...prev, ...datosInicial }));
            setDatosEnfermera((prev) => ({
                ...prev,
                enf_codigo: datosInicial.enf_codigo || "",
                rol_id: selectedRoles || null,
                sp_fecha_inicio: datosInicial.sp_fecha_inicio || "",
                sp_fecha_fin: datosInicial.sp_fecha_fin || "",
            }));
        }
    }, [datosInicial, selectedRoles]);

    const handleChangeEnfermera = (e) => {
        setDatosEnfermera((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatosEnfermera((prev) => ({ ...prev, rol_id: rolId }));
    };

    const handleSubmit = async () => {
        const per_id = datosPersona.per_id;

        try {
            const asignacionExitosa = await asignarRolesSede({
                per_id,
                rol_id: selectedRoles,
                sp_fecha_inicio: datosEnfermera.sp_fecha_inicio,
                sp_fecha_fin: datosEnfermera.sp_fecha_fin,
            });

            if (!asignacionExitosa) {
                console.error("Error al asignar el rol", asignacionExitosa);
                return Swal.fire({
                    icon: "error",
                    text: "No se pudo asignar el rol.",
                });
            }

            onRegistrar({
                ...datosEnfermera,
                per_id,
                rol_id: selectedRoles || null,
            });
            
            onClose();
        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({
                icon: "error",
                text: "Ocurrió un error inesperado.",
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal">
                <div className="modal-content">
                    <h3 className="h4">Registrar Enfermera</h3>

                    <div className="modal-field">
                        <label>Código</label>
                        <input
                            type="text"
                            name="enf_codigo"
                            value={datosEnfermera.enf_codigo}
                            onChange={handleChangeEnfermera}
                            required
                        />
                    </div>

                    <SelectRolEnfermera
                        label="Rol"
                        name="rol_id"
                        value={selectedRoles ?? ""}
                        onChange={handleRoleChange}
                    />

                    <div className="modal-field">
                        <label>Fecha inicio</label>
                        <input
                            type="date"
                            name="sp_fecha_inicio"
                            value={datosEnfermera.sp_fecha_inicio}
                            onChange={handleChangeEnfermera}
                            required
                        />
                    </div>
                    <div className="modal-field">
                        <label>Fecha fin</label>
                        <input
                            type="date"
                            name="sp_fecha_fin"
                            value={datosEnfermera.sp_fecha_fin}
                            onChange={handleChangeEnfermera}
                            required
                        />
                    </div>

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="save-button"
                            onClick={handleSubmit}
                        >
                            Registrar
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
