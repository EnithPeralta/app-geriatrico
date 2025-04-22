import React, { useEffect, useState } from 'react'
import { useGeriatrico, useTurnos } from '../../hooks'
import { FaFileMedical, FaHistory } from 'react-icons/fa';
import { SideBarComponent } from '../../components';

export const HistoryTurnosEnfermeraPage = () => {
  const { verMisTurnosEnfermeriaHistorial } = useTurnos();
  const { homeMiGeriatrico } = useGeriatrico();
  const [turnosHistorial, setTurnosHistorial] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("")
  const [sedeNombre, setSedeNombre] = useState("");
  const [geriatrico, setGeriatrico] = useState(null);
  const [enfermeras, setEnfermeras] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [sedeResult, enfermerasResult] = await Promise.all([
  //         homeMiGeriatrico(),
  //         obtenerEnfermerasSede(),
  //       ]);

  //       if (sedeResult?.success) {
  //         setGeriatrico(sedeResult.geriatrico);
  //       }
  //       if (enfermerasResult?.success && Array.isArray(enfermerasResult.data)) {
  //         setEnfermeras(enfermerasResult.data);
  //       } else {
  //         setError(enfermerasResult.message || "No se encontraron enfermeras.");
  //       }

  //     } catch (err) {
  //       setError("Error al obtener los datos.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await homeMiGeriatrico();
        if (result.success) {
          setGeriatrico(result.geriatrico);
        }
      } catch (err) {
        console.error("Error al obtener los datos.", err);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchTurnosEnfermeriaHistorial = async () => {
      const response = await verMisTurnosEnfermeriaHistorial();
      if (response.success) {
        const turnosArray = response.turnos_por_sede.flatMap(sede => sede.turnos);
        setTurnosHistorial(turnosArray);
        if (response.turnos_por_sede.length > 0) {
          setSedeNombre(response.turnos_por_sede[0].sede_nombre);
        }
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
        <div className="content-area" style={{ backgroundColor: geriatrico?.color_principal }}>
          <h2 className='gestionar-title'><FaHistory /> Historial Mis Turnos</h2>
          <div className="filters">
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="date"
            />
          </div>
          <div className="turnos-container-sede">
            {sedeNombre && <h3 className="h4">{sedeNombre}</h3>}

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
