import React, { useEffect, useState } from 'react';
import { SideBarComponent } from '../../components';
import { useGeriatrico, useTurnos } from '../../hooks';
import '../../css/turnos.css';
import { FaBookMedical, FaClock, FaCloudMeatball, FaMoon, FaSun } from 'react-icons/fa';

export const CuadroTurnosEnfermeraPage = () => {
  const { homeMiGeriatrico } = useGeriatrico();
  const { verMisTurnosEnfermeria } = useTurnos();
  const [geriatrico, setGeriatrico] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [filtro, setFiltro] = useState("");


  const today = new Date().toISOString().split('T')[0];

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
    const fetchTurnos = async () => {
      try {
        const response = await verMisTurnosEnfermeria();
        console.log("Respuesta API:", response);

        if (response.success) {
          // Acceder al array correcto dentro del objeto anidado
          const turnosData = response.turnos?.turnos || [];
          setTurnos(turnosData);
        } else {
          console.warn("Error en la respuesta:", response.message);
          setTurnos([]);
        }
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        setTurnos([]);
      }
    };

    fetchTurnos();
  }, []);


  // Verifica si el input es una fecha (YYYY-MM-DD)
  const esFecha = (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor);

  // Filtrado dinámico por fecha o sede
  const filteredTurnos = turnos.filter(t =>
    filtro
      ? esFecha(filtro)
        ? t.tur_fecha_inicio === filtro // Filtra por fecha
        : t.sede_nombre.toLowerCase().includes(filtro.toLowerCase()) // Filtra por sede
      : true
  );


  return (
    <div className="main-container">
      <SideBarComponent />
      <div className="content turnos-content" style={{ backgroundColor: geriatrico?.color_principal }}>
        <h2 className="h4">Cuadro de Turnos</h2>
        <div className="filters">
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="search-input"
            placeholder="Buscar por fecha (YYYY-MM-DD) o sede"
          />
        </div>
        <div className="turnos-grid">
          {filteredTurnos.length > 0 ? (
            filteredTurnos.map((t, index) => (
              <div key={index} className="turnos-card">
                <div className="turno-detalle">
                  <div className="turnos-header">
                    <h2 className="turnos-title">{t.sede_nombre}</h2>
                    <p className="turnos-date">{t.tur_fecha_inicio} - {t.tur_fecha_fin}</p>
                  </div>
                  <div className="actividades-grid">
                    <div className="actividad-item">
                      <FaSun className='svg' />
                      <span className='span'>{t.tur_hora_inicio}</span>
                    </div>
                    <div className="actividad-item">
                      <FaMoon className='svg' />
                      <span className='span'>{t.tur_hora_fin}</span>
                    </div>
                  </div>
                  <div className="actividad-item">
                    <FaClock className='svg' />
                    <span className="span">{t.tur_total_horas}</span>
                    {t.tur_fecha_inicio === today ? " Horas trabajadas" : " Horas a trabajar"}
                  </div>
                  <div className="actividad-item">
                    <FaCloudMeatball className='svg' />
                    <span className="span">{t.tur_tipo_turno}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No tienes turnos disponibles hoy</p>
          )}

        </div>
      </div>
    </div>
  );
};
