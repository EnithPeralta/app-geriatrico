import React from 'react';
import { SideBarComponent } from '../../components';
import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { useForm, useTurnos } from '../../hooks';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const TurnosFormFields = {
    tur_fecha_inicio: '',
    tur_fecha_fin: '',
    tur_hora_inicio: '',
    tur_hora_fin: '',
    tur_tipo_turno: ''
};

export const TurnoEnfermeriaPage = () => {
    const { id: enf_id } = useParams(); // Renombramos id para evitar conflicto
    const { asignarTurnoEnfermeria } = useTurnos();

    const {
        tur_fecha_inicio,
        tur_fecha_fin,
        tur_hora_inicio,
        tur_hora_fin,
        tur_tipo_turno,
        onInputChange
    } = useForm(TurnosFormFields);

    const handleAsignarTurno = async (e) => {
        e.preventDefault();

        const turnoData = {
            enf_id, // Usamos el ID de la URL
            tur_fecha_inicio,
            tur_fecha_fin,
            tur_hora_inicio,
            tur_hora_fin,
            tur_tipo_turno
        };

        console.log("Enviando datos:", turnoData);

        try {
            const result = await asignarTurnoEnfermeria(turnoData);
            console.log("Respuesta del backend:", result);

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    text: result.message
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    text: result.message
                })
            }
        } catch (error) {
            console.error("Error al asignar turno:", error);
        }
    };

    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content crear-turno-content">
                <h2 className='h1'><FaCalendarDay /> Crear Turno</h2>
                <div className="crear-turno-form-container">
                    <form className='crear-turno-form' onSubmit={handleAsignarTurno}>
                        <div className='form-group'>
                            <label> <FaCalendarDay /> Fecha Inicio:</label>
                            <input
                                type="date"
                                name="tur_fecha_inicio"
                                value={tur_fecha_inicio}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><FaCalendarDay /> Fecha Fin:</label>
                            <input
                                type="date"
                                name="tur_fecha_fin"
                                value={tur_fecha_fin}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><FaClock /> Turno Día:</label>
                            <input
                                type="text"
                                name="tur_hora_inicio"
                                value={tur_hora_inicio}
                                onChange={onInputChange}
                                placeholder="Ej: 08:00 AM - 02:00 PM"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><FaClock /> Turno Noche:</label>
                            <input
                                type="text"
                                name="tur_hora_fin"
                                value={tur_hora_fin}
                                onChange={onInputChange}
                                placeholder="Ej: 05:00 PM - 09:00 PM"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><FaClock /> Tipo de Turno:</label>
                            <select
                                name="tur_tipo_turno"
                                value={tur_tipo_turno}
                                onChange={onInputChange}
                                required
                            >
                                <option value="" hidden>Seleccione...</option>
                                <option value="Diurno">Diurno</option>
                                <option value="Nocturno">Nocturno</option>
                            </select>
                        </div>
                        <button type="submit" className="save-button">
                        Asignar Turno
                    </button>
                    </form>
                    
                </div>
            </div>
        </div>
    );
};
