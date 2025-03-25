import React, { useEffect, useState } from 'react'
import { SideBarComponent } from '../../components'
import { FaCalendarDay, FaFileMedical } from 'react-icons/fa'
import { useTurnos } from '../../hooks'

export const HistoryTurnosSedePage = () => {
    const { verTurnosSedeHistorial } = useTurnos();
    const [turnosSede, setTurnosSede] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState("")
    useEffect(() => {
        const fetchHistoryTurnoSedes = async () => {
            try {
                const response = await verTurnosSedeHistorial();
                console.log("Respuesta AdminSede:", response);

                if (response.success && response.turnos) {
                    const turnosArray = Object.values(response.turnos).flat();
                    setTurnosSede(turnosArray);
                } else {
                    console.log(response.message);
                }
            } catch (error) {
                console.error("Error al obtener turnos:", error);
            }
        }

        fetchHistoryTurnoSedes();
    }, [])

    const turnosFiltrados = fechaFiltro
    ? turnosSede.filter(turno => turno.tur_fecha_inicio === fechaFiltro)
    : turnosSede;

    return (
        <>
            <div className="main-container">
                <div className="content">
                    <h2 className='h1'><FaFileMedical /> Historial De Turnos</h2>
                    <div className="filters">
                        <input
                            type="date"
                            value={fechaFiltro}
                            onChange={(e) => setFechaFiltro(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="turnos-container-sede">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Enfermera</th>
                                    <th>Cédula</th>
                                    <th>Tipo turno</th>
                                    <th>Fecha inicio</th>
                                    <th>Fecha fin</th>
                                    <th>Hora inicio</th>
                                    <th>Hora fin</th>
                                    <th>Horas total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnosFiltrados.length > 0 ? (
                                    turnosFiltrados.map((turno) => (
                                        <tr key={turno.tur_id}>
                                            <td>{turno.enfermera.datos_enfermera.per_nombre_completo}</td>
                                            <td>{turno.enfermera.datos_enfermera.per_documento}</td>
                                            <td>{turno.tur_tipo_turno}</td>
                                            <td>{turno.tur_fecha_inicio}</td>
                                            <td>{turno.tur_fecha_fin}</td>
                                            <td>{turno.tur_hora_inicio}</td>
                                            <td>{turno.tur_hora_fin}</td>
                                            <td>{turno.tur_total_horas}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No hay turnos asignados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
