import React, { useEffect, useState } from 'react'
import { useSedesRol } from '../../hooks';
import Swal from 'sweetalert2';
import { SelectRolColaborador } from '../SelectRolColaborador';

export const ModalColaborador = ({ datosInicial, onClose, selectedRoles, setSelectedRoles }) => {
    const { asignarRolesSede } = useSedesRol();

    const [datosPersona, setDatosPersona] = useState({
        per_id: datosInicial?.per_id || "",
        per_nombre_completo: "",
        per_documento: "",
        per_correo: "",
        per_telefono: "",
        per_genero: "",
        per_usuario: "",
        per_password: "",
    });
    const [datosColaborador, setDatosColaborador] = useState({
        rol_id: selectedRoles || null,
        sp_fecha_inicio: "",
        sp_fecha_fin: "",
    });

    useEffect(() => {
        if (datosInicial) {
            setDatosPersona((prev) => ({ ...prev, ...datosInicial }));
            setDatosColaborador((prev) => ({
                ...prev,
                rol_id: selectedRoles || null,
                sp_fecha_inicio: datosInicial.sp_fecha_inicio || "",
                sp_fecha_fin: datosInicial.sp_fecha_fin || "",
            }));
        }
    }, [datosInicial, selectedRoles]);

    const handleChange = (e) => {
        setDatosColaborador((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleRoleChange = (event) => {
        const rolId = Number(event.target.value);
        setSelectedRoles(rolId);
        setDatosColaborador((prev) => ({ ...prev, rol_id: rolId }));
    };

    const handleSubmit = async () => {
        const per_id = datosPersona.per_id;

        try {
            const asignacionExitosa = await asignarRolesSede({
                per_id,
                rol_id: selectedRoles,
                sp_fecha_inicio: datosColaborador.sp_fecha_inicio,
                sp_fecha_fin: datosColaborador.sp_fecha_fin,
            });
            Swal.fire({
                icon: "success",
                text: asignacionExitosa?.message || "Rol asignado con exito",
            })
            onClose();
        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({
                icon: "error",
                text: "Ocurrió un error inesperado.",
            });
        }
    };


    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-content'>
                    <h2>Registrar Colaborador</h2>
                    <SelectRolColaborador label="Rol" name="rol_id" value={selectedRoles || ""} onChange={handleRoleChange} />
                    <div className='modal-field'>
                        <label>Fecha inicio:</label>
                        <input type="date" name="sp_fecha_inicio" value={datosColaborador.sp_fecha_inicio} onChange={handleChange} required />
                    </div>
                    <div className='modal-field'>
                        <label>Fecha fin:</label>
                        <input type="date" name="sp_fecha_fin" value={datosColaborador.sp_fecha_fin} onChange={handleChange} />
                    </div>
                    <div className='modal-buttons'>
                        <button type="button" onClick={handleSubmit} id="save-button" className='save-button'>Registrar</button>
                        <button type="button" className='cancel-button' onClick={onClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
