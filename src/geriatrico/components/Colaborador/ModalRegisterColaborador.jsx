import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { SelectRolColaborador } from '../../../components/SelectRolColaborador';
import { ModalColaboradorPersona } from './ModalColaboradorPersona';
import { useForm, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';

const RolesForm = {
    rol_id: null,
    sp_fecha_inicio: '',
    sp_fecha_fin: ''
};

export const ModalRegisterColaborador = ({ onClose }) => {
    const { asignarRolesSede } = useSedesRol();
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { buscarVincularPersona } = usePersona();

    const [personaEncontrada, setPersonaEncontrada] = useState(null);
    const [datoColaborador, setDatoColaborador] = useState(RolesForm);
    const [colaboradorDocumento, setColaboradorDocumento] = useState('');
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [showSelectRoles, setShowSelectRoles] = useState(false);
    const [showModalColaborador, setShowModalColaborador] = useState(false);

    const { onResetForm } = useForm(RolesForm);

    const handleChange = (event) => {
        setDatoColaborador((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatoColaborador((prev) => ({ ...prev, rol_id: rolId }));
    };

    const handleAssignSedes = async (per_id, rol_id, sp_fecha_inicio, sp_fecha_fin) => {
        if (!per_id || !rol_id || !sp_fecha_inicio || !sp_fecha_fin) {
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
    };

    const validarRol = async (per_id) => {
        console.log("🔍 Verificando roles para la persona con ID:", per_id);
        const rolesPersona = await obtenerPersonaRolesMiGeriatricoSede(per_id);
        console.log("👀 Roles obtenidos:", rolesPersona);
        return rolesPersona?.persona?.rolesSede?.some(rol => rol.rol_nombre === "Enfermera(O)") || false;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!colaboradorDocumento) {
            await Swal.fire({ icon: 'warning', text: "⚠️ No se ha ingresado un documento válido." });
            return;
        }

        try {
            let result = personaEncontrada; // Mantiene el resultado en memoria
            if (!personaEncontrada) {
                // Solo busca si `personaEncontrada` es null o undefined
                const fetchedPersona = await buscarVincularPersona({ documento: colaboradorDocumento });
                if (!fetchedPersona) return;

                setPersonaEncontrada(fetchedPersona);
                result = fetchedPersona;
            }

            // Si la acción es asignar un rol, mostramos opciones
            if (result?.action === "assign_role") {
                setShowSelectRoles(true);
                setDatoColaborador(prev => ({ ...prev, per_id: result.per_id }));

                await Swal.fire({ icon: 'info', text: result.message });

                if (datoColaborador.rol_id) {
                    const asignado = await handleAssignSedes(
                        result.per_id,
                        datoColaborador.rol_id,
                        datoColaborador.sp_fecha_inicio,
                        datoColaborador.sp_fecha_fin
                    );
                    if (!asignado) return;
                    await Swal.fire({ icon: 'success', text: result.message });
                    onResetForm();
                }
                return;
            }

            // Si hay un mensaje en el resultado, mostramos modal
            if (result.message) {
                setShowModalColaborador(true);
                return;
            }

            // Validar si la persona ya tiene el rol de enfermera
            const tieneRol = await validarRol(result.per_id);
            if (tieneRol) {
                // Si tiene el rol pero está inactivo, permitir que se le asigne de nuevo
                const rolInactivo = result.roles?.some(rol => rol.rol_id === 7 && !rol.activoSede);
                if (rolInactivo) {
                    console.log("📢 La persona tiene el rol pero está inactivo. Se procederá a reasignar.");
                } else {
                    await Swal.fire({ icon: 'info', text: "La persona ya tiene el rol de enfermera asignado." });
                    return;
                }
            }

            // Asignar el rol si no lo tiene o si estaba inactivo
            setShowSelectRoles(true);
            const asignado = await handleAssignSedes(
                result.per_id,
                datoColaborador.rol_id,
                datoColaborador.sp_fecha_inicio,
                datoColaborador.sp_fecha_fin
            );
            if (!asignado) return;

            await Swal.fire({ icon: 'success', text: result.message });
            onResetForm(); // Limpia el formulario después del registro exitoso
        } catch (error) {
            console.error("❌ Error capturado en useSedesRol:", error);
        }
    };

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-content'>
                    <h2>Registrar Colaborador</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='modal-field'>
                            <label>Documento:</label>
                            <input type='text'
                                className="modal-input"
                                value={colaboradorDocumento} onChange={(e) => setColaboradorDocumento(e.target.value)} />
                        </div>
                        {showSelectRoles && (
                            <>
                                <SelectRolColaborador label="Rol" name="rol_id" value={selectedRoles || ""} onChange={handleRoleChange} />
                                <div className='modal-field'>
                                    <label>Fecha inicio:</label>
                                    <input type="date" name="sp_fecha_inicio" value={datoColaborador.sp_fecha_inicio} onChange={handleChange} required />
                                </div>
                                <div className='modal-field'>
                                    <label>Fecha fin:</label>
                                    <input type="date" name="sp_fecha_fin" value={datoColaborador.sp_fecha_fin} onChange={handleChange} />
                                </div>
                            </>
                        )}
                        <div className='modal-buttons'>
                            <button type="submit" className='save-button'>Registrar</button>
                            <button type="button" className='cancel-button' onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                    {showModalColaborador && <ModalColaboradorPersona
                        colaboradorDocumento={colaboradorDocumento}
                        handleAssignSedes={handleAssignSedes}
                        handleRoleChange={handleRoleChange}
                        onClose={onClose}
                        selectedRoles={selectedRoles}
                    />
                    }
                </div>
            </div>
        </div>
    );
};
