import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAcudiente, useForm, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';
import { ModalRegistrarPersonas, SelectField } from '../../../components';
import { SelectRolAcudiente } from '../../../components/SelectRolAcudiente';

export const ModalRegisterAcudiente = ({ onClose, pacienteId, onRegisterSuccess, setAcudiente }) => {
    const { asignarRolesSede } = useSedesRol();
    const { registrarAcudiente } = useAcudiente();
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { buscarVincularPersona } = usePersona();
    const { onResetForm } = useForm();
    // Estados del formulario
    const [acudienteDocumento, setAcudienteDocumento] = useState('');
    const [parentesco, setParentesco] = useState('');
    const [personaEncontrada, setPersonaEncontrada] = useState(null);

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

    const validarRol = async (per_id) => {
        console.log("🔍 Verificando roles para la persona con ID:", per_id);
        const rolesPersona = await obtenerPersonaRolesMiGeriatricoSede(per_id);
        console.log("👀 Roles obtenidos:", rolesPersona);
        return rolesPersona?.persona?.rolesSede?.some(rol => rol.rol_nombre === "Enfermera(O)") || false;
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
            const yaTieneRol = await validarRol(per_id, rol_id);
            if (yaTieneRol) {
                console.log("⚠️ La persona ya tiene este rol asignado en la sede.");
                await Swal.fire({ icon: "info", text: "La persona ya tiene este rol asignado." });
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
            let result = personaEncontrada;
    
            // 1️⃣ Buscar persona si no está almacenada
            if (!personaEncontrada) {
                const fetchedPersona = await buscarVincularPersona({ documento: acudienteDocumento });
                if (!fetchedPersona) return;
    
                setPersonaEncontrada(fetchedPersona);
                result = fetchedPersona;
            }
    
            // 2️⃣ Si requiere asignar rol
            if (result?.action === "assign_role") {
                setShowSelectRoles(true);
                setDatosAcudiente(prev => ({ ...prev, per_id: result.per_id }));
    
                // Mostrar mensaje solo si el rol no está asignado
                if (!result.message) {
                    await Swal.fire({ icon: 'info', text: result.message });
                }
    
                const tieneRol = await validarRol(result.per_id);
                const rolInactivo = result.roles?.some(rol => rol.rol_id === 6 && !rol.activoSede);
    
                // 3️⃣ Reasignar si rol está inactivo
                if (tieneRol && rolInactivo) {
                    const asignado = await handleAssignSedes(
                        result.per_id,
                        datosAcudiente.rol_id,
                        datosAcudiente.sp_fecha_inicio,
                        datosAcudiente.sp_fecha_fin
                    );
                    if (asignado) {
                        await registrarAcudiente({
                            per_id: result.per_id,
                            pac_id: pacienteSeleccionado.pac_id,
                            pa_parentesco: parentesco,
                        });
                    }
                    return;
                }
    
                // 4️⃣ Asignar rol si no lo tiene o estaba inactivo
                const asignado = await handleAssignSedes(
                    result.per_id,
                    datosAcudiente.rol_id,
                    datosAcudiente.sp_fecha_inicio,
                    datosAcudiente.sp_fecha_fin
                );
                if (!asignado) return;
    
                await registrarAcudiente({
                    per_id: result.per_id,
                    pac_id: pacienteSeleccionado.pac_id,
                    pa_parentesco: parentesco,
                });
    
                // 5️⃣ Resetear formulario y actualizar lista
                onResetForm();
                onClose();
                setAcudiente(prev =>
                    prev.map(acu =>
                        acu.per_id === result.per_id
                            ? { ...acu, activoSede: false }
                            : acu
                    )
                );
                return;
            }
    
            // 6️⃣ Mostrar info si existe mensaje sin necesidad de asignar rol
            if (result.message) {
                setShowPersona(true);
                return;
            }
    
            // 7️⃣ Si no tiene el rol de acudiente
            if (!await validarRol(result.per_id)) {
                setShowSelectRoles(true);
                const asignado = await handleAssignSedes(
                    result.per_id,
                    datosAcudiente.rol_id,
                    datosAcudiente.sp_fecha_inicio,
                    datosAcudiente.sp_fecha_fin
                );
                if (!asignado) return;
            } else {
                await Swal.fire({ icon: 'info', text: "La persona ya tiene el rol de acudiente asignado." });
            }
    
            // 8️⃣ Registrar acudiente
            const response = await registrarAcudiente({
                pac_id: pacienteSeleccionado.pac_id,
                per_id: result.per_id,
                pa_parentesco: parentesco,
            });
    
            await Swal.fire({
                icon: response?.success ? 'success' : 'error',
                text: response?.message || "Error al registrar acudiente."
            });
    
            if (response?.success) {
                onRegisterSuccess?.({
                    ...response.data,
                    per_id: result.per_id,
                    pac_id: pacienteSeleccionado.pac_id,
                    pa_parentesco: parentesco
                });
                onClose();
            }
    
            onResetForm();
        } catch (error) {
            console.error("❌ Error capturado en handleRegisterAcudiente:", error);
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
                                <option hidden>Seleccione...</option>
                                <option value="Padre/Madre">Padre/Madre</option>
                                <option value="Hijo/a">Hijo/a</option>
                                <option value="Hermano/a">Hermano/a</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        {showSelectRoles && (
                            <>
                                <SelectRolAcudiente
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
                    {showPersona &&
                        <ModalRegistrarPersonas
                            acudienteDocumento={acudienteDocumento}
                            handleAssignSedes={handleAssignSedes}
                            pacienteId={pacienteId}
                            setPacienteSeleccionado={setPacienteSeleccionado}
                            handleRoleChange={handleRoleChange}
                            parentesco={parentesco}
                            setParentesco={setParentesco}
                            selectedRoles={selectedRoles}
                            onClose={onClose}
                        />
                    }
                </div>
            </div>
        </div>
    );
};