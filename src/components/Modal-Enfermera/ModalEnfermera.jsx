import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuthStore, useSedesRol, } from "../../hooks";
import { SelectRolEnfermera } from "../SelectRolEnfermera";

export const ModalEnfermera = ({ datosInicial, onRegistrar, onClose, selectedRoles, setSelectedRoles }) => {
    const { asignarRolesSede } = useSedesRol();
    const { startRegister } = useAuthStore();

    const [datosPersona, setDatosPersona] = useState({
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
        rol_id: selectedRoles?.[0] || null,
        sp_fecha_inicio: "",
        sp_fecha_fin: ""
    });

    useEffect(() => {
        if (datosInicial) {
            setDatosPersona((prev) => ({ ...prev, ...datosInicial }));
            setDatosEnfermera((prev) => ({ ...prev, ...datosInicial }));
        }
    }, [datosInicial, selectedRoles]);

    const handleChangePersona = (e) => {
        setDatosPersona((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeEnfermera = (e) => {
        setDatosEnfermera((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatosEnfermera((prev => ({ ...prev, rol_id: rolId })));
    };

    const handleSubmit = async () => {
        if (!datosPersona.per_nombre_completo || !datosPersona.per_documento || !datosPersona.per_correo) {
            return Swal.fire({ icon: 'warning', text: "⚠️ Complete todos los datos personales." });
        }

        try {
            // Registrar persona
            const responsePersona = await startRegister(datosPersona);
            console.log("Register", responsePersona)
            if (!responsePersona.success) {
                return Swal.fire({ icon: 'success', text: responsePersona.message });
            }

            const per_id = responsePersona.data.per_id;

            // Asignar rol
            const asignacionExitosa = await asignarRolesSede({
                per_id,
                rol_id: selectedRoles?.[0],
                sp_fecha_inicio: datosEnfermera.sp_fecha_inicio,
                sp_fecha_fin: datosEnfermera.sp_fecha_fin
            });

            console.log("asignacionExitosa", asignacionExitosa)

            if (!asignacionExitosa) {
                console.error("Error al asignar el rol", asignacionExitosa);
                return Swal.fire({ icon: 'error', text: 'No se pudo asignar el rol.' });
            }

            // Registrar enfermera
            onRegistrar({ ...datosEnfermera, per_id, rol_id: selectedRoles?.[0] || null });
        } catch (error) {
            Swal.fire({ icon: 'error', text: "Ocurrió un error inesperado." });
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal">
                <div className="modal-content">
                    {/* <h3>Registrar Persona</h3>
                    <div className="modal-field">
                        <label>Nombre Completo</label>
                        <input type="text" name="per_nombre_completo" value={datosPersona.per_nombre_completo} onChange={handleChangePersona} required />
                    </div>
                    <div className="modal-field">
                        <label>Documento</label>
                        <input type="text" name="per_documento" value={datosPersona.per_documento} onChange={handleChangePersona} required />
                    </div>
                    <div className="modal-field">
                        <label>Correo</label>
                        <input type="email" name="per_correo" value={datosPersona.per_correo} onChange={handleChangePersona} required />
                    </div>
                    <div className="modal-field">
                        <label>Teléfono</label>
                        <input type="text" name="per_telefono" value={datosPersona.per_telefono} onChange={handleChangePersona} required />
                    </div>
                    <div className="modal-field">
                        <label>Género</label>
                        <select name="per_genero" value={datosPersona.per_genero} onChange={handleChangePersona} required>
                            <option value="">Seleccione</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>
                    <div className="modal-field">
                        <label>Usuario</label>
                        <input type="text" name="per_usuario" value={datosPersona.per_usuario} onChange={handleChangePersona} required />
                    </div>
                    <div className="modal-field">
                        <label>Contraseña</label>
                        <input type="password" name="per_password" value={datosPersona.per_password} onChange={handleChangePersona} required />
                    </div> */}
                    <h3>Registrar Enfermera</h3>
                    <div className="modal-field">
                        <label>Código</label>
                        <input type="text" name="enf_codigo" value={datosEnfermera.enf_codigo} onChange={handleChangeEnfermera} required />
                    </div>
                    <SelectRolEnfermera
                        label="Rol"
                        name="rol_id"
                        value={selectedRoles || ""}
                        onChange={handleRoleChange}
                    />
                    <div className="modal-field">
                        <label>Fecha inicio</label>
                        <input type="date" name="sp_fecha_inicio" value={datosEnfermera.sp_fecha_inicio} onChange={handleChangeEnfermera} required />
                    </div>
                    <div className="modal-field">
                        <label>Fecha fin</label>
                        <input type="date" name="sp_fecha_fin" value={datosEnfermera.sp_fecha_fin} onChange={handleChangeEnfermera} required />
                    </div>
                    <button type="button" className="save-button" onClick={handleSubmit}>
                        Registrar Enfermera
                    </button>
                    <button type="button" className="cancel" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
