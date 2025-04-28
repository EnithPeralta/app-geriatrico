import React, { useState, useCallback } from 'react';
import { useEnfermera, useForm, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';
import Swal from 'sweetalert2';
import { ModalEnfermeraPersona } from '../../../components/Modal-Enfermera/ModalEnfermeraPersona';
import { SelectRolEnfermera } from '../../../components/SelectRolEnfermera';

const RolesForm = {
    rol_id: null,
    sp_fecha_inicio: '',
    sp_fecha_fin: ''
};

export const ModalRegisterEnfermera = ({ onClose, setEnfermeras }) => {
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
    const [loading, setLoading] = useState(false); 

    const { onResetForm } = useForm(RolesForm);

    const handleChange = (event) => {
        setDatosEnfermera((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatosEnfermera((prev) => ({ ...prev, rol_id: rolId }));
    };

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

    const validarRol = useCallback(async (per_id) => {
        const rolesPersona = await obtenerPersonaRolesMiGeriatricoSede(per_id);
        return rolesPersona?.persona?.rolesSede?.some(rol => rol.rol_nombre === "Enfermera(O)") || false;
    }, [obtenerPersonaRolesMiGeriatricoSede]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); 

        if (!enfermeraDocumento || !enfCodigo) {
            await Swal.fire({ icon: 'warning', text: "⚠️ No se ha ingresado un documento válido." });
            setLoading(false); 
            return;
        }

        try {
            let result = personaEncontrada; 
            if (!personaEncontrada) {
                const fetchedPersona = await buscarVincularPersona({ documento: enfermeraDocumento });
                if (!fetchedPersona) {
                    setLoading(false); 
                    return;
                }

                setPersonaEncontrada(fetchedPersona);
                result = fetchedPersona;
            }

            if (result?.action === "assign_role") {
                setShowSelectRoles(true);
                setDatosEnfermera(prev => ({ ...prev, per_id: result.per_id }));

                if (!result.message) {
                    await Swal.fire({ icon: 'info', text: result.message });
                }

                const tieneRol = await validarRol(result.per_id);
                if (tieneRol) {
                    const rolInactivo = result.roles?.some(
                        (rol) => rol.rol_id === 5 && !rol.activoSede
                    );
                    if (rolInactivo) {
                        if (result.enfermera?.enf_codigo) {
                            setEnfCodigo(result.enfermera.enf_codigo);
                        }

                        const asignado = await handleAssignSedes(
                            result.per_id,
                            datosEnfermera.rol_id,
                            datosEnfermera.sp_fecha_inicio,
                            datosEnfermera.sp_fecha_fin
                        );

                        if (asignado) {
                            await startRegisterEnfermera({ per_id: result.per_id, enf_codigo: enfCodigo });
                            await Swal.fire({ icon: 'success', text: 'Enfermera asignada correctamente.' });
                        }
                        setLoading(false); 
                        return;
                    }
                }

                const asignado = await handleAssignSedes(
                    result.per_id,
                    datosEnfermera.rol_id,
                    datosEnfermera.sp_fecha_inicio,
                    datosEnfermera.sp_fecha_fin
                );
                if (!asignado) {
                    setLoading(false); 
                    return;
                }

                const response = await startRegisterEnfermera({ per_id: result.per_id, enf_codigo: enfCodigo });
                await Swal.fire({
                    icon: response?.success ? 'success' : 'error',
                    text: response?.message || "Error al registrar enfermera."
                });

                onResetForm();
                onClose(true);
                setEnfermeras((prev) => {
                    const updatedEnfermeras = prev.map((enf) =>
                        enf.per_id === result.per_id ? { ...enf, ...result } : enf
                    );
                    return updatedEnfermeras;
                });

                setLoading(false); // Termina la carga
                return;
            }

            if (result.message) {
                setShowModalEnfermera(true);
            }

        } catch (error) {
            console.error("❌ Error capturado en useSedesRol:", error);
            setLoading(false); // Termina la carga
        }
    };

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-content'>
                    <h2>Registrar Enfermera</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='modal-field'>
                            <label>Documento:</label>
                            <input type='text'
                                className="modal-input"
                                value={enfermeraDocumento} onChange={(e) => setEnfermeraDocumento(e.target.value)} />
                        </div>
                        <div className='modal-field'>
                            <label>Código:</label>
                            <input type='text' value={enfCodigo} onChange={(e) => setEnfCodigo(e.target.value)} />
                        </div>
                        {showSelectRoles && (
                            <>
                                <SelectRolEnfermera label="Rol" name="rol_id" value={selectedRoles || ""} onChange={handleRoleChange} />
                                <div className='modal-field'>
                                    <label>Fecha inicio:</label>
                                    <input type="date" name="sp_fecha_inicio" value={datosEnfermera.sp_fecha_inicio} onChange={handleChange} required />
                                </div>
                                <div className='modal-field'>
                                    <label>Fecha fin:</label>
                                    <input type="date" name="sp_fecha_fin" value={datosEnfermera.sp_fecha_fin} onChange={handleChange} />
                                </div>
                            </>
                        )}
                        <div className='modal-buttons'>
                            <button type="submit" className='save-button' disabled={loading}>
                                {loading ? "Cargando..." : "Registrar"}
                            </button>
                            <button type="button" className='cancel-button' onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                    {showModalEnfermera &&
                        <ModalEnfermeraPersona
                            onClose={onClose}
                            enf_codigo={enfCodigo}
                            enfermeraDocumento={enfermeraDocumento}
                            handleAssignSedes={handleAssignSedes}
                            handleRoleChange={handleRoleChange}
                            selectedRoles={selectedRoles}
                            setEnfCodigo={setEnfCodigo}
                        />}
                </div>
            </div>
        </div>
    );
};
