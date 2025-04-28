import React, { useEffect, useState } from 'react';
import { SideBarComponent } from '../../components';
import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { useForm, useGeriatrico, useTurnos } from '../../hooks';
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
    const { id } = useParams(); // Renombramos id para evitar conflicto
    const enf_id = parseInt(id);
    const { asignarTurnoEnfermeria } = useTurnos();
    const { homeMiGeriatrico } = useGeriatrico();
    const [geriatrico, setGeriatrico] = useState();

    useEffect(() => {
        const fetchGeriatrico = async () => {
            try {
                const result = await homeMiGeriatrico();
                setGeriatrico(result.geriatrico);
            } catch (error) {
                console.error('Error al obtener el geriatrico:', error);
            }
        }
        fetchGeriatrico();
    }, [])


    const {
        tur_fecha_inicio,
        tur_fecha_fin,
        tur_hora_inicio,
        tur_hora_fin,
        tur_tipo_turno,
        onInputChange,
        onResetForm
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


        try {
            const result = await asignarTurnoEnfermeria(turnoData);
            const conflictos = result.error.conflictos;

            const conflictosEstaSede = conflictos.enEstaSede.map((c) => `<div>${c.sede} - ${c.fecha_inicio}</div>`).join('');
            const conflictosOtraSede = conflictos.enOtraSede.map((c) => `<div>${c.sede} - ${c.fecha_inicio}</div>`).join('');
            let htmlConflictos = '';

            if (conflictos.enEstaSede.length > 0) {
                htmlConflictos += `<p><strong>En esta sede:</strong></p><ul>${conflictosEstaSede}</ul>`;
            }
            if (conflictos.enOtraSede.length > 0) {
                htmlConflictos += `<p><strong>En otra sede:</strong></p><ul>${conflictosOtraSede}</ul>`;
            }

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    text: result.message
                })
                onResetForm();
            } else {
                Swal.fire({
                    icon: 'warning',
                    html: ` <p>${result.error.message}</p>
                    ${htmlConflictos}`,
                });
            }
        } catch (error) {
            console.error("Error al asignar turno:", error);
        }
    };

    return (
        <div className="main-container" >
            <SideBarComponent />
            <div className="content crear-turno-content" style={{ backgroundColor: geriatrico?.color_principal }}>
                <h2 className="gestionar-title"><FaCalendarDay /> Asignar Turno</h2>
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
                            <label><FaClock /> Hora de Inicio:</label>
                            <input
                                type="time"
                                name="tur_hora_inicio"
                                value={tur_hora_inicio}
                                onChange={onInputChange}
                                placeholder="Ej: 08:00 AM "
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><FaClock /> Hora de Fin:</label>
                            <input
                                type="time"
                                name="tur_hora_fin"
                                value={tur_hora_fin}
                                onChange={onInputChange}
                                placeholder="Ej: 05:00 PM"
                                required
                            />
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
