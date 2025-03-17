import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAcudiente, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';
import { SelectField } from '../../../components';

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
            setError("Todos los campos son obligatorios.");
            return;
        }
    
        try {
            // 1️⃣ Buscar a la persona por documento
            const result = await buscarVincularPersona({ documento: acudienteDocumento });
    
            if (!result.success) {
                setError(result.message);
                return;
            }
    
            // 2️⃣ Obtener roles actuales de la persona en el geriátrico
            const rolesPersona = await obtenerPersonaRolesMiGeriatricoSede(result.per_id);
            console.log("Roles de la persona:", rolesPersona);
            
            if (!rolesPersona?.persona?.rolesSede) {
                console.error("Error: rolesPersona o rolesSede no están definidos.", rolesPersona);
                return;
            }
    
            const tieneRolAcudiente = rolesPersona.persona.rolesSede.some(rol => rol.rol_nombre === "Acudiente");
            console.log("Tiene rol acudiente?", tieneRolAcudiente);
    
            // 3️⃣ Si NO tiene el rol, se lo asignamos
            if (!tieneRolAcudiente) {
                setShowSelectRoles(true);
    
                if (!datosAcudiente.rol_id) {
                    return Swal.fire({ icon: "warning", text: "Seleccione un rol antes de continuar." });
                }
    
                const asignacionExitosa = await handleAssignSedes(
                    result.per_id,
                    datosAcudiente.rol_id,
                    datosAcudiente.sp_fecha_inicio,
                    datosAcudiente.sp_fecha_fin
                );
    
                if (!asignacionExitosa) {
                    return Swal.fire({ icon: "error", text: "No se pudo asignar el rol. Registro cancelado." });
                }
            }
    
            // 4️⃣ Registrar el acudiente después de la validación del rol
            const response = await registrarAcudiente({
                pac_id: pacienteSeleccionado.pac_id,
                per_id: result.per_id,
                pa_parentesco: parentesco,
            });
    
            if (response.success) {
                setMensaje(response.message);
                setPacienteSeleccionado(prev => ({
                    ...prev,
                    acudiente: response.acudiente,
                }));
                setAcudienteDocumento("");
                setParentesco("");
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error("Error en handleRegisterAcudiente:", error);
            setError("Ocurrió un error inesperado al registrar el acudiente.");
        }
    };
    

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-content'>
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
                </div>
            </div>
        </div>
    );
};
