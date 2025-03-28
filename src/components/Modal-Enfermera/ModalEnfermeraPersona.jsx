import React from 'react'
import { useAuthStore, useEnfermera, useForm } from '../../hooks';
import Swal from 'sweetalert2';
import { SelectRolEnfermera } from '../SelectRolEnfermera';

const registerFormFields = {
    per_password: '',
    confirm_password: '',
    per_usuario: '',
    per_genero: '',
    per_telefono: '',
    per_nombre_completo: '',
    per_documento: '', // Asegurar que no sea undefined
    per_correo: '',
    per_foto: ''
};
export const ModalEnfermeraPersona = ({ enfermeraDocumento, handleAssignSedes, selectedRoles, enf_codigo, handleRoleChange, setEnfCodigo, onClose }) => {
    const { startRegister } = useAuthStore();
    const { startRegisterEnfermera } = useEnfermera();

    const {
        per_password,
        confirm_password,
        per_usuario,
        per_genero,
        per_telefono,
        per_nombre_completo,
        per_documento,
        per_correo,
        per_foto,
        onInputChange,
        isPasswordVisible,
        sp_fecha_inicio,
        sp_fecha_fin,
        rol_id
    } = useForm(registerFormFields);



    const handleEnfermera = async (idPersona) => {
        try {
            const response = await startRegisterEnfermera({
                per_id: idPersona,
                enf_codigo
            });
            console.log(response);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: response.message,
                });
            }
        } catch (error) {
            console.error("❌ Error al registrar enfermera:", error.response.data.message);
            Swal.fire({
                icon: 'error',
                text: error.response.data.message
            })
        }
    };

    const registerSubmit = async (e) => {
        e.preventDefault();

        if (per_password !== confirm_password) {
            Swal.fire({ title: 'Error', icon: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }
        console.log('Datos del formulario:', {
            per_nombre_completo,
            per_documento,
            per_correo,
            per_usuario,
            per_password,
            confirm_password,
            per_telefono,
            per_genero,
            per_foto,
            selectedRoles,
            sp_fecha_inicio,
            sp_fecha_fin,
            enf_codigo,
        });

        try {
            const response = await startRegister({
                per_correo,
                per_usuario,
                per_genero,
                per_telefono,
                per_nombre_completo,
                per_password,
                per_documento: enfermeraDocumento,
                per_foto,
                rol_id: selectedRoles
            });
            console.log("📤 Enviando datos de la persona:", response);

            if (!response || !response.data || !response.data.per_id) {
                Swal.fire({ icon: 'error', text: 'No se pudo obtener el ID del usuario' });
                return;
            }

            const idPersona = response.data.per_id;
            const asignacionExitosa = await handleAssignSedes(idPersona, selectedRoles, sp_fecha_inicio, sp_fecha_fin);
            console.log(asignacionExitosa);
            if (!asignacionExitosa) {
                Swal.fire({ icon: 'error', text: 'No se pudo asignar el rol. Registro cancelado.' });
                return;
            }
            if (Number(selectedRoles) === 5) {
                await handleEnfermera(idPersona);
            }

        } catch (error) {
            console.error('❌ Error al registrar persona:', error);
            Swal.fire({ icon: 'error', text: 'Ocurrió un error al registrar la persona' });
        }
    };





    return (
        <>
            <div className='modal-overlay'>
                <div className='modal'>
                    <div className='modal-content-geriatrico'>
                        <form onSubmit={registerSubmit}>
                            <div className='modal-field'>
                                <label>Nombre Completo</label>
                                <input type='text'
                                    className="modal-input"
                                    name='per_nombre_completo'
                                    value={per_nombre_completo}
                                    onChange={onInputChange}
                                    required />
                            </div>
                            <div className='modal-field'>
                                <label>Documento</label>
                                <input type='text'
                                    name='per_documento'
                                    value={per_documento || enfermeraDocumento}
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                            <div className='modal-field'>
                                <label>Correo</label>
                                <input type='text'
                                    name='per_correo'
                                    value={per_correo}
                                    onChange={onInputChange}
                                    required />
                            </div>
                            <div className='modal-field'>
                                <label>Usuario</label>
                                <input
                                    type='text'
                                    name='per_usuario'
                                    value={per_usuario}
                                    onChange={onInputChange}
                                    required />
                            </div>
                            <div className='modal-field'>
                                <label>Contraseña</label>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name='per_password' value={per_password}
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                            <div className='modal-field'>
                                <label>Confirmar Contraseña</label>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name='confirm_password' value={confirm_password}
                                    onChange={onInputChange}
                                    required />
                            </div>
                            <div className='modal-field'>
                                <label>Teléfono</label>
                                <input type='text'
                                    name='per_telefono'
                                    value={per_telefono}
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                            <div className='modal-field'>
                                <label>Género</label>
                                <select id='per_genero' name='per_genero' value={per_genero} onChange={onInputChange} className='custom-select-container'>
                                    <option hidden>Seleccione una opción</option>
                                    <option value='M'>Masculino</option>
                                    <option value='F'>Femenino</option>
                                    <option value='O'>Otro</option>
                                </select>
                            </div>
                            <div className='modal-field'>
                                <label>Foto</label>
                                <input type='file'
                                    name='per_foto'
                                    onChange={(e) => onInputChange({ target: { name: 'per_foto', value: e.target.files[0] } })}
                                />
                            </div>
                            <SelectRolEnfermera
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
                                    value={sp_fecha_inicio}
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-field">
                                <label>Fecha fin</label>
                                <input
                                    type="date"
                                    name="sp_fecha_fin"
                                    className="modal-input"
                                    value={sp_fecha_fin}
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-field">
                                <label>Código</label>
                                <input type="text" name="enf_codigo" value={enf_codigo} onChange={(e) => setEnfCodigo(e.target.value)} required />
                            </div>
                            <div className='modal-buttons'>
                                <button type='submit' className='save-button'>Registrar</button>
                                <button type='button' className='cancel-button' onClick={onClose}>Cerrar</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
