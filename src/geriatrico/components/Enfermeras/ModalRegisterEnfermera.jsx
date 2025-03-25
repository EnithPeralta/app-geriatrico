import React, { useEffect, useState } from 'react';
import { useEnfermera, useForm, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';
import Swal from 'sweetalert2';
import { ModalRegistrarPersonas, SelectField } from '../../../components';
import { ModalEnfermeraPersona } from '../../../components/Modal-Enfermera/ModalEnfermeraPersona';

const RolesForm = {
    rol_id: null,
    sp_fecha_inicio: '',
    sp_fecha_fin: ''
};

export const ModalRegisterEnfermera = ({ onClose }) => {
    const { startRegisterEnfermera } = useEnfermera();
    const { asignarRolesSede } = useSedesRol();
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { buscarVincularPersona } = usePersona();
    
    const [personaEncontrada, setPersonaEncontrada] = useState(null);
    const [datosEnfermera, setDatosEnfermera] = useState(RolesForm);
    const [enfermeraDocumento, setEnfermeraDocumento] = useState('');
    const [enfCodigo, setEnfCodigo] = useState('');
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [showSelectRoles, setShowSelectRoles] = useState(false);
    const [showModalEnfermera, setShowModalEnfermera] = useState(false);

    const { onResetForm } = useForm(RolesForm);

    const handleChange = (event) => {
        setDatosEnfermera((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatosEnfermera((prev) => ({ ...prev, rol_id: rolId }));
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

        if (!enfermeraDocumento || !enfCodigo) {
            await Swal.fire({ icon: 'warning', text: "⚠️ No se ha ingresado un documento válido." });
            return;
        }

        try {
            let result = personaEncontrada;
            if (!personaEncontrada) {
                const fetchedPersona = await buscarVincularPersona({ documento: enfermeraDocumento });
                if (!fetchedPersona) return;

                if (fetchedPersona !== personaEncontrada) {
                    setPersonaEncontrada(fetchedPersona);
                    result = fetchedPersona;
                }
            }

            if (result?.action === "assign_role") {
                setShowSelectRoles(true);
                setDatosEnfermera(prev => ({ ...prev, per_id: result.per_id }));
                await Swal.fire({ icon: 'info', text: result.message });

                if (datosEnfermera.rol_id) {
                    const asignado = await handleAssignSedes(
                        result.per_id,
                        datosEnfermera.rol_id,
                        datosEnfermera.sp_fecha_inicio,
                        datosEnfermera.sp_fecha_fin
                    );

                    if (asignado) {
                        await startRegisterEnfermera({ per_id: result.per_id, enf_codigo: enfCodigo });
                    }
                }
                return;
            }

            if (result.message) {
                setShowModalEnfermera(true);
                return;
            }

            if (!await validarRol(result.per_id)) {
                setShowSelectRoles(true);
                if (!await handleAssignSedes(result.per_id, datosEnfermera.rol_id, datosEnfermera.sp_fecha_inicio, datosEnfermera.sp_fecha_fin)) return;
            } else {
                await Swal.fire({ icon: 'info', text: "La persona ya tiene el rol de enfermera asignado." });
            }

            const response = await startRegisterEnfermera({ per_id: result.per_id, enf_codigo: enfCodigo });
            await Swal.fire({
                icon: response?.success ? 'success' : 'error',
                text: response?.message || "Error al registrar enfermera."
            });
            onResetForm();
        } catch (error) {
            console.error("❌ Error capturado en useSedesRol:", error);
        }
    };

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-content-geriatrico'>
                    <h2>Registrar Enfermera</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='modal-field'>
                            <label>Documento:</label>
                            <input type='text' value={enfermeraDocumento} onChange={(e) => setEnfermeraDocumento(e.target.value)} />
                        </div>
                        <div className='modal-field'>
                            <label>Código:</label>
                            <input type='text' value={enfCodigo} onChange={(e) => setEnfCodigo(e.target.value)} />
                        </div>
                        {showSelectRoles && (
                            <>
                                <SelectField label="Rol" name="rol_id" value={selectedRoles || ""} onChange={handleRoleChange} />
                                <div className='modal-field'>
                                    <label>Fecha inicio:</label>
                                    <input type="date" name="sp_fecha_inicio" value={datosEnfermera.sp_fecha_inicio} onChange={handleChange} required />
                                </div>
                                <div className='modal-field'>
                                    <label>Fecha fin:</label>
                                    <input type="date" name="sp_fecha_fin" value={datosEnfermera.sp_fecha_fin} onChange={handleChange} required />
                                </div>
                            </>
                        )}
                        <div className='modal-buttons'>
                            <button type="submit" className='save-button'>Registrar</button>
                            <button type="button" className='cancel-button' onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                    {showModalEnfermera && <ModalEnfermeraPersona onClose={onClose} />}
                </div>
            </div>
        </div>
    );
};
