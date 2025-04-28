import React from 'react';
import { useAuthStore, useForm, usePaciente } from '../../hooks';
import Swal from 'sweetalert2';
import { SelectRolPaciente } from '../SelectRolPaciente';

const registerFormFields = {
  per_password: '',
  confirm_password: '',
  per_usuario: '',
  per_genero: '',
  per_telefono: '',
  per_nombre_completo: '',
  per_documento: '',
  per_correo: '',
  per_foto: ''
};

export const ModalPacientePersona = ({
  pacienteDocumento,
  handleAssignSedes,
  selectedRoles,
  handleRoleChange,
  datosPaciente,
  onClose
}) => {
  const { startRegister } = useAuthStore();
  const { registrarPaciente } = usePaciente();

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
    pac_edad,
    pac_peso,
    pac_talla,
    pac_regimen_eps,
    pac_nombre_eps,
    pac_rh_grupo_sanguineo,
    pac_talla_camisa,
    pac_talla_pantalon,
  } = useForm(registerFormFields);


  const registerSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (per_password !== confirm_password) {
      Swal.fire({ title: 'Error', icon: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (!selectedRoles) {
      Swal.fire({ icon: 'error', text: 'Debe seleccionar un rol' });
      return;
    }

    if (!per_password || !per_usuario || !per_correo || !per_telefono || !per_nombre_completo) {
      Swal.fire({ title: 'Error', icon: 'error', text: 'Todos los campos son obligatorios' });
      return;
    }

    try {
      // 1. Registrar la persona (sin datos del paciente)
      const responsePersona = await startRegister({
        per_correo,
        per_usuario,
        per_genero,
        per_telefono,
        per_nombre_completo,
        per_password,
        per_documento: pacienteDocumento || per_documento,
        per_foto,
        rol_id: selectedRoles
      });

      const idPersona = responsePersona?.data?.per_id;
      if (!idPersona) {
        Swal.fire({ icon: 'error', text: 'No se pudo obtener el ID de la persona registrada' });
        return;
      }

      // 2. Asignar el rol (si es necesario) - en caso de que el rol sea 4 (por ejemplo)
      const asignacionExitosa = await handleAssignSedes(
        idPersona,
        selectedRoles,
        sp_fecha_inicio,
        sp_fecha_fin
      );
      if (!asignacionExitosa) {
        console.error('❌ Error al asignar sedes:', asignacionExitosa);
        Swal.fire({ icon: 'error', text: asignacionExitosa.message || 'Error al asignar sedes' });
        return;
      }

      // 3. Registrar los datos del paciente (si el rol seleccionado es 4, por ejemplo)
      if (Number(selectedRoles) === 4) {
        const response = await registrarPaciente({
          per_id: idPersona,
          pac_edad,
          pac_peso,
          pac_talla,
          pac_regimen_eps,
          pac_nombre_eps,
          pac_rh_grupo_sanguineo,
          pac_talla_camisa,
          pac_talla_pantalon,
          sp_fecha_inicio,
          sp_fecha_fin
        });

        Swal.fire({
          icon: response?.success ? 'success' : 'error',
          text: response?.message || 'Error desconocido'
        });
      }

      // 4. Confirmación final
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'La persona fue registrada correctamente.'
      });

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error('❌ Error al registrar persona:', error);
      Swal.fire({ icon: 'error', text: 'Ocurrió un error al registrar la persona' });
    }
  };

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-content'>
          <form onSubmit={registerSubmit}>
            {/* Datos personales */}
            <div className='modal-field'>
              <label>Nombre Completo</label>
              <input type='text' name='per_nombre_completo' value={per_nombre_completo} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Documento</label>
              <input type='text' name='per_documento' value={pacienteDocumento || per_documento} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Correo</label>
              <input type='email' name='per_correo' value={per_correo} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Usuario</label>
              <input type='text' name='per_usuario' value={per_usuario} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Contraseña</label>
              <input type={isPasswordVisible ? 'text' : 'password'} name='per_password' value={per_password} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Confirmar Contraseña</label>
              <input type={isPasswordVisible ? 'text' : 'password'} name='confirm_password' value={confirm_password} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Teléfono</label>
              <input type='text' name='per_telefono' value={per_telefono} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Género</label>
              <select name='per_genero' value={per_genero} onChange={onInputChange} required>
                <option hidden>Seleccione una opción</option>
                <option value='M'>Masculino</option>
                <option value='F'>Femenino</option>
                <option value='O'>Otro</option>
              </select>
            </div>
            <div className='modal-field'>
              <label>Foto</label>
              <input type='file' name='per_foto' onChange={(e) => onInputChange({ target: { name: 'per_foto', value: e.target.files[0] } })} />
            </div>

            {/* Rol y datos del paciente */}
            <SelectRolPaciente label="Rol" name="rol_id" value={selectedRoles || ''} onChange={handleRoleChange} />

            <div className='modal-field'>
              <label>Edad</label>
              <input type='text' name='pac_edad' value={pac_edad} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Peso</label>
              <input type='text' name='pac_peso' value={pac_peso} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Estatura</label>
              <input type='text' name='pac_talla' value={pac_talla} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Régimen EPS</label>
              <select name='pac_regimen_eps' value={pac_regimen_eps} onChange={onInputChange} required>
                <option hidden>Seleccione...</option>
                <option value='Contributivo'>Contributivo</option>
                <option value='Subsidiado'>Subsidiado</option>
              </select>
            </div>
            <div className='modal-field'>
              <label>EPS</label>
              <input type='text' name='pac_nombre_eps' value={pac_nombre_eps} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Grupo sanguíneo</label>
              <select name='pac_rh_grupo_sanguineo' value={pac_rh_grupo_sanguineo} onChange={onInputChange} required>
                <option hidden>Seleccione...</option>
                <option value='A+'>A+</option>
                <option value='A-'>A-</option>
                <option value='B+'>B+</option>
                <option value='B-'>B-</option>
                <option value='AB+'>AB+</option>
                <option value='AB-'>AB-</option>
                <option value='O+'>O+</option>
                <option value='O-'>O-</option>
              </select>
            </div>
            <div className='modal-field'>
              <label>Talla de camisa</label>
              <select name='pac_talla_camisa' value={pac_talla_camisa} onChange={onInputChange} required>
                <option hidden>Seleccione...</option>
                <option value='XS'>XS</option>
                <option value='S'>S</option>
                <option value='M'>M</option>
                <option value='L'>L</option>
                <option value='XL'>XL</option>
                <option value='XXL'>XXL</option>
              </select>
            </div>
            <div className='modal-field'>
              <label>Talla de pantalón</label>
              <input type='text' name='pac_talla_pantalon' value={pac_talla_pantalon} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Fecha de inicio</label>
              <input type='date' name='sp_fecha_inicio' value={sp_fecha_inicio} onChange={onInputChange} required />
            </div>
            <div className='modal-field'>
              <label>Fecha de fin</label>
              <input type='date' name='sp_fecha_fin' value={sp_fecha_fin} onChange={onInputChange} />
            </div>

            <div className='modal-buttons'>
              <button type='submit' className='save-button'>Registrar</button>
              <button type='button' className='cancel-button' onClick={onClose}>Cerrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
