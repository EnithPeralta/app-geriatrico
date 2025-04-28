import React, { useCallback, useState } from 'react';
import Swal from 'sweetalert2';
import { useAcudiente, useForm, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';
import { ModalRegistrarPersonas } from '../../../components';
import { SelectRolAcudiente } from '../../../components/SelectRolAcudiente';
import socket from '../../../utils/Socket';

export const ModalRegisterAcudiente = ({ onClose, pacienteId, setAcudiente }) => {
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


    const validarRol = useCallback(async (per_id) => {
        const rolesPersona = await obtenerPersonaRolesMiGeriatricoSede(per_id);
        return rolesPersona?.persona?.rolesSede?.some(rol => rol.rol_nombre === "Acudiente(O)") || false;
    }, [obtenerPersonaRolesMiGeriatricoSede]);


    const handleAssignSedes = useCallback(async (per_id, rol_id, sp_fecha_inicio, sp_fecha_fin) => {
        if (!per_id || !rol_id || !sp_fecha_inicio) {
            await Swal.fire({ icon: "warning", text: "Por favor, complete todos los campos antes de asignar el rol." });
            return false;
        }

        try {
            const response = await asignarRolesSede({ per_id, rol_id, sp_fecha_inicio, sp_fecha_fin });
            if (response?.success) {
                return true;
            } else {
                await Swal.fire({ icon: "error", text: response?.message || "Hubo un problema al asignar el rol." });
                return false;
            }
        } catch (error) {
            await Swal.fire({ icon: "error", text: "Ocurrió un error inesperado. Inténtelo nuevamente." });
            return false;
        }
    }, [asignarRolesSede]);


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

            if (!personaEncontrada) {
                const fetchedPersona = await buscarVincularPersona({ documento: acudienteDocumento });
                if (!fetchedPersona) return;

                setPersonaEncontrada(fetchedPersona);
                result = fetchedPersona;
            }

            if (result?.action === "assign_role") {
                setShowSelectRoles(true);
                setDatosAcudiente(prev => ({ ...prev, per_id: result.per_id }));

                if (!result.message) {
                    await Swal.fire({ icon: 'info', text: result.message });
                }

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

                // ✅ Aquí agregamos correctamente el acudiente:
                setAcudiente(prev => [...prev, { ...result, pa_parentesco: parentesco }]);

                onResetForm();
                onClose();
                return;
            }

            if (result.message) {
                setShowPersona(true);
                return;
            }

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

            const response = await registrarAcudiente({
                pac_id: pacienteSeleccionado.pac_id,
                per_id: result.per_id,
                pa_parentesco: parentesco,
            });
            console.log(response);

            await Swal.fire({
                icon: response?.success ? 'success' : 'error',
                text: response?.message || "Error al registrar acudiente."
            });

            // ✅ Actualizar lista de acudientes correctamente:
            setAcudiente(prev => [...prev, { ...result, pa_parentesco: parentesco }]);

            onResetForm();
            onClose();
        } catch (error) {
            console.error("❌ Error capturado en handleRegisterAcudiente:", error);
        }
    };



    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-content'>
                    <h2>Registrar Acudiente</h2>
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
                            setAcudiente={setAcudiente}
                        />
                    }
                </div>
            </div>
        </div>
    );
};