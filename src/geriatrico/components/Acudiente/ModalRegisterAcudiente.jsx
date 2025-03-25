import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAcudiente, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';
import { ModalRegistrarPersonas, SelectField } from '../../../components';

export const ModalRegisterAcudiente = ({ onClose, pacienteId }) => {
    const { asignarRolesSede } = useSedesRol();
    const { registrarAcudiente } = useAcudiente();
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { buscarVincularPersona } = usePersona();
    // Estados del formulario
    const [acudienteDocumento, setAcudienteDocumento] = useState('');
    const [parentesco, setParentesco] = useState('');
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState({ pac_id: pacienteId });
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [showSelectRoles, setShowSelectRoles] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [showPersona, setShowPersona] = useState(false);

    // Datos del acudiente (simulación de valores predeterminados)
    const [datosAcudiente, setDatosAcudiente] = useState({
        rol_id: null,
        sp_fecha_inicio: '',
        sp_fecha_fin: ''
    });


    const handleChange = (event) => {
        setDatosAcudiente((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };


    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatosAcudiente(prev => ({ ...prev, rol_id: rolId })); // Actualizar rol_id en datosAcudiente
        console.log(rolId);
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

            const response = await asignarRolesSede({ per_id, rol_id, sp_fecha_inicio, sp_fecha_fin });

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


    const handleRegisterAcudiente = async (event) => {
        event.preventDefault();
        setMensaje(null);
        setError(null);

        if (!pacienteSeleccionado || !acudienteDocumento || !parentesco) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        try {
            // 1️⃣ Buscar a la persona por documento
            const result = await buscarVincularPersona({ documento: acudienteDocumento });
            console.log("Persona buscada:", result);

            if (result.message) {
                setShowPersona(true);
                console.log(result.message);
            }

            // 2️⃣ Obtener roles actuales de la persona en el geriátrico
            const rolesPersona = await obtenerPersonaRolesMiGeriatricoSede(result.per_id);
            console.log("Roles de la persona:", rolesPersona);

            if (!rolesPersona?.persona?.rolesSede) {
                console.error("Error: rolesPersona o rolesSede no están definidos.", rolesPersona);
                return;
            }

            // 3️⃣ Verificar si tiene el rol de Acudiente y si está activo
            const rolAcudienteEnSede = rolesPersona.persona.rolesSede.find(
                rol => rol.rol_nombre === "Acudiente" && rol.activoRolSede
            );

            console.log("Rol Acudiente encontrado:", rolAcudienteEnSede);

            const tieneRolAcudiente = !!rolAcudienteEnSede;
            console.log("Tiene rol acudiente?", tieneRolAcudiente);
            const rolInactivo = tieneRolAcudiente && !rolAcudienteEnSede?.activoRolSede;

            console.log("Tiene rol acudiente?", tieneRolAcudiente, "Está inactivo?", rolInactivo);

            // 4️⃣ Si el rol está inactivo, reasignarlo
            if (!tieneRolAcudiente || rolInactivo) {
                setShowSelectRoles(true);
                console.log("Reasignando el rol de Acudiente...", tieneRolAcudiente, rolInactivo);
                const reactivacionExitosa = await handleAssignSedes(
                    result.per_id,
                    rolAcudienteEnSede?.rol_id || datosAcudiente.rol_id,
                    datosAcudiente.sp_fecha_inicio,
                    datosAcudiente.sp_fecha_fin
                );
                onResetForm();
                if (reactivacionExitosa) {
                    return Swal.fire({ icon: "success", text: reactivacionExitosa.message });
                }
                else if (!reactivacionExitosa) {
                    return Swal.fire({ icon: "error", text: "No se pudo reactivar el rol. Registro cancelado." });
                }
            }

            // 5️⃣ Si NO tiene el rol, asignarlo normalmente
            if (!tieneRolAcudiente) {
                setShowSelectRoles(true);

                if (!datosAcudiente.rol_id) {
                    return Swal.fire({ icon: "warning", text: "Seleccione un rol antes de continuar." });
                }

                const asignacionExitosa = await handleAssignSedes(
                    result.per_id,
                    datosAcudiente.rol_id,
                    datosAcudiente.sp_fecha_inicio,
                    datosAcudiente.sp_fecha_fin,
                    pacienteSeleccionado.se_id // ← Pasar el ID de la sede correcta
                );
                onResetForm();

                if (!asignacionExitosa) {
                    return Swal.fire({ icon: "error", text: "No se pudo asignar el rol. Registro cancelado." });
                }
            }

            // 6️⃣ Registrar el acudiente después de la validación del rol
            const response = await registrarAcudiente({
                pac_id: pacienteSeleccionado.pac_id,
                per_id: result.per_id,
                pa_parentesco: parentesco,
            });

            if (response.success) {
                console.log(response.message);
                setPacienteSeleccionado(prev => ({
                    ...prev,
                    acudiente: response.acudiente,
                }));
                setAcudienteDocumento("");
                setParentesco("");
                onResetForm();
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error en handleRegisterAcudiente:", error);
            console.log("Ocurrió un error inesperado al registrar el acudiente.");
        }
    };


    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-content-geriatrico'>
                    <h2>Registrar Acudiente</h2>
                    {mensaje && <p className="success-message">{mensaje}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={handleRegisterAcudiente}>
                        <div className='modal-field'>
                            <label>Documento del acudiente:</label>
                            <input
                                type='text'
                                value={acudienteDocumento}
                                onChange={e => setAcudienteDocumento(e.target.value)}
                            />
                        </div>
                        <div className='modal-field'>
                            <label>Parentesco</label>
                            <select className='modal-field' value={parentesco} onChange={(e) => setParentesco(e.target.value)} required>
                                <option value="" hidden>Seleccione...</option>
                                <option value="Padre/Madre">Padre/Madre</option>
                                <option value="Hijo/a">Hijo/a</option>
                                <option value="Hermano/a">Hermano/a</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        {showSelectRoles && (
                            <>
                                <SelectField
                                    label="Rol"
                                    name="rol_id"
                                    value={selectedRoles || ""}
                                    onChange={handleRoleChange}
                                />
                                <div className="modal-field">
                                    <label>Fecha inicio</label>
                                    <input
                                        type="date"
                                        name="sp_fecha_inicio"
                                        className="modal-input"
                                        value={datosAcudiente.sp_fecha_inicio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="modal-field">
                                    <label>Fecha fin</label>
                                    <input
                                        type="date"
                                        name="sp_fecha_fin"
                                        className="modal-input"
                                        value={datosAcudiente.sp_fecha_fin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="modal-buttons">
                            <button type="submit" className="create">
                                Registrar Acudiente
                            </button>
                            <button type="button" className="cancel" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    {showPersona && pacienteSeleccionado.pac_id === null && (
                        <ModalRegistrarPersonas
                            acudienteDocumento={acudienteDocumento}
                            handleAssignSedes={handleAssignSedes}
                            pacienteId={pacienteId}
                            setPacienteSeleccionado={setPacienteSeleccionado}
                            handleRoleChange={handleRoleChange}
                            parentesco={parentesco}
                            setParentesco={setParentesco}
                            selectedRoles={selectedRoles}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};