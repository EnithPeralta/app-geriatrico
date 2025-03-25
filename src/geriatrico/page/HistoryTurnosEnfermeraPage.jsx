import React, { useEffect, useState } from 'react'
import { useTurnos } from '../../hooks'
import { FaFileMedical } from 'react-icons/fa';
import { SideBarComponent } from '../../components';

export const HistoryTurnosEnfermeraPage = () => {
  const { verMisTurnosEnfermeriaHistorial } = useTurnos();
  const [turnosHistorial, setTurnosHistorial] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("")


  useEffect(() => {
    const fetchTurnosEnfermeriaHistorial = async () => {
      const response = await verMisTurnosEnfermeriaHistorial();
      if (response.success) {
        console.log("Historial de turnos obtenido:", response.turnos_por_sede);
        const turnosArray = response.turnos_por_sede.flatMap(sede => sede.turnos);
        setTurnosHistorial(turnosArray);
        console.log("Turnos guardados en estado:", turnosArray);
      } else {
        console.log(response.message);
      }
    };

    fetchTurnosEnfermeriaHistorial();
  }, []);


  const turnosFiltrados = fechaFiltro
    ? turnosHistorial.filter(turno =>
      new Date(turno.tur_fecha_inicio).toISOString().split('T')[0] === fechaFiltro
    )
    : turnosHistorial;


  return (
    <div>
      <div className="main-container">
        <SideBarComponent />
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
                  turnosFiltrados.map((turno, index) => (
                    <tr key={index}>
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
                    <td colSpan="8">No hay turnos asignados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
