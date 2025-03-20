import React, { useState } from 'react';
import { useEnfermera, useGeriatricoPersona, usePersona, useSedesRol } from '../../../hooks';
import Swal from 'sweetalert2';
import { ModalRegistrarPersonas, SelectField } from '../../../components';
import { ModalEnfermeraPersona } from '../../../components/Modal-Enfermera/ModalEnfermeraPersona';

export const ModalRegisterEnfermera = ({ onClose }) => {
    const { startRegisterEnfermera } = useEnfermera();
    const { asignarRolesSede } = useSedesRol();
    const { obtenerPersonaRolesMiGeriatricoSede } = useGeriatricoPersona();
    const { buscarVincularPersona } = usePersona();

    const [enfermeraDocumento, setEnfermeraDocumento] = useState('');
    const [enfCodigo, setEnfCodigo] = useState('');
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [showSelectRoles, setShowSelectRoles] = useState(false);
    const [showModalEnfermera, setShowModalEnfermera] = useState(null);
    const [datosEnfermera, setDatosEnfermera] = useState({
        rol_id: null,
        sp_fecha_inicio: '',
        sp_fecha_fin: ''
    });

    const handleChange = (event) => {
        setDatosEnfermera((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatosEnfermera((prev => ({ ...prev, rol_id: rolId })));
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
    // const handleEnfermera = async (datosEnfermera) => {
    //     if (!datosEnfermera.per_id) {
    //         Swal.fire({
    //             icon: 'warning',
    //             text: "⚠️ No se ha seleccionado una persona válida.",
    //         });
    //         return;
    //     }

    //     console.log("📤 Enviando datos de la enfermera:", datosEnfermera)

    //     try {
    //         const response = await startRegisterEnfermera(datosEnfermera);
    //         console.log(response);

    //         Swal.fire({
    //             icon: response.success ? 'success' : 'error',
    //             text: response.message,
    //         });

    //         if (response.success) {
    //             setShowModal(false); // Cierra el modal si el registro es exitoso
    //         } else {
    //             console.error("❌ Error al registrar enfermera:", response.message);
    //         }
    //     } catch (error) {
    //         console.error("❌ Error al registrar enfermera:", error.response.data.message);
    //         Swal.fire({
    //             icon: 'error',
    //             text: error.response.data.message
    //         })
    //     }
    // };


    const validarRol = async (per_id) => {
        const rolesPersona = await obtenerPersonaRolesMiGeriatricoSede(per_id);

        if (!rolesPersona?.persona?.rolesSede) {
            console.error("Error: rolesPersona o rolesSede no están definidos.", rolesPersona);
            return false;
        }

        return rolesPersona.persona.rolesSede.some(rol => rol.rol_nombre === "Enfermera(O)");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!enfermeraDocumento || !enfCodigo) {
            Swal.fire({ icon: 'warning', text: "⚠️ No se ha ingresado un documento válido." });
            return;
        }

        try {
            const result = await buscarVincularPersona({ documento: enfermeraDocumento });

            if (result.message) {
                setShowModalEnfermera(true);
                console.log(result.message);
                return;
            }

            const tieneRolEnfermera = await validarRol(result.per_id);

            if (!tieneRolEnfermera) {
                setShowSelectRoles(true);

                const asignacionExitosa = await handleAssignSedes(result.per_id);
                if (!asignacionExitosa) return;
            } else {
                Swal.fire({
                    icon: 'info',
                    text: "La persona ya tiene el rol de enfermera asignado."
                });
            }

            const response = await startRegisterEnfermera({
                per_id: result.per_id,
                enf_codigo: enfCodigo
            });

            Swal.fire({
                icon: response?.success ? 'success' : 'error',
                text: response?.message || (response?.success ? "Enfermera registrada con éxito." : "Error al registrar enfermera.")
            });
        } catch (error) {
            Swal.fire({ icon: 'error', text: error?.message || "Ocurrió un error inesperado." });
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
                                <SelectField
                                    label="Rol"
                                    name="rol_id"
                                    value={selectedRoles || ""}
                                    onChange={handleRoleChange}
                                />
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
                    {showModalEnfermera && (
                        <ModalEnfermeraPersona
                            enfermeraDocumento={enfermeraDocumento}
                            enf_codigo={enfCodigo}
                            handleRoleChange={handleRoleChange}
                            handleAssignSedes={handleAssignSedes}
                            handleChange={handleChange}
                            selectedRoles={selectedRoles}
                            setEnfCodigo={setEnfCodigo}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
