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

export const ModalRegisterColaborador = ({ onClose, setColaboradores }) => {
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
            let result = personaEncontrada;

            // Buscar persona si aún no se ha encontrado
            if (!result) {
                const fetchedPersona = await buscarVincularPersona({ documento: colaboradorDocumento });
                if (!fetchedPersona) return;

                setPersonaEncontrada(fetchedPersona);
                result = fetchedPersona;
            }

            const { per_id, action, message, roles } = result;

            // Asignación de rol
            if (action === "assign_role") {
                setShowSelectRoles(true);
                setDatoColaborador(prev => ({ ...prev, per_id }));

                if (!message) {
                    await Swal.fire({ icon: 'info', text: message });
                }

                const tieneRol = await validarRol(per_id);
                if (tieneRol) {

                    const rolInactivo = roles?.some(rol => rol.rol_id === 7 && !rol.activoSede);

                    if (rolInactivo) {
                        if (rolInactivo) {
                            console.log("📢 La persona tiene el rol pero está inactivo. Se procederá a reasignar.");
                        }

                        const asignado = await handleAssignSedes(
                            per_id,
                            datoColaborador.rol_id,
                            datoColaborador.sp_fecha_inicio,
                            datoColaborador.sp_fecha_fin
                        );
                        if (asignado) {
                            await Swal.fire({ icon: 'success', text: asignado?.message || "Rol asignado con exito" });
                        }
                        return;
                    }
                }
                const asignado = await handleAssignSedes(
                    per_id,
                    datoColaborador.rol_id,
                    datoColaborador.sp_fecha_inicio,
                    datoColaborador.sp_fecha_fin
                );
                if (!asignado) return;

                await Swal.fire({ icon: 'success', text: asignado?.message || "Rol asignado con exito" });
                onResetForm();
                onClose();
                setColaboradores(prev => {
                    const updatedColaboradores = prev.map(colaboradores =>
                        colaboradores.per_id === per_id
                            ? { ...colaboradores, activoSede: true }
                            : colaboradores
                    );
                    return updatedColaboradores
                });
                return;
            }
            if (message) {
                setShowModalColaborador(true);
                return;
            }
        }

        catch (error) {
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
                    {showModalColaborador &&
                        <ModalColaboradorPersona
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
