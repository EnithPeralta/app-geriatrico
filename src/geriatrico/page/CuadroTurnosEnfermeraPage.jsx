import React, { useEffect, useState } from 'react';
import { SideBarComponent } from '../../components';
import { useTurnos } from '../../hooks';
import '../../css/turnos.css';
import { FaBuilding, FaClock, FaMoon, FaSun } from 'react-icons/fa';

export const CuadroTurnosEnfermeraPage = () => {
  const { verMisTurnosEnfermeria } = useTurnos();
  const [turnos, setTurnos] = useState([]); 
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await verMisTurnosEnfermeria();
        if (response.success) {
          setTurnos(response.turnos || []);
        } else {
          console.warn(response.message);
        }
      } catch (error) {
        console.error("Error al obtener turnos:", error);
      }
    };

    fetchTurnos();
  }, []);

  // Verifica si el input es una fecha (YYYY-MM-DD)
  const esFecha = (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor);

  // Filtrado dinámico por fecha o sede
  const filteredTurnos = turnos.filter(turno =>
    turno.turnos.some(t =>
      filtro
        ? esFecha(filtro) 
          ? t.tur_fecha_inicio === filtro // Filtra por fecha
          : turno.sede_nombre.toLowerCase().includes(filtro.toLowerCase()) // Filtra por sede
        : true
    )
  );

  return (
    <div className="main-container">
      <SideBarComponent />
      <div className="content turnos-content">
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
            filteredTurnos.map((turno, index) => (
              <div key={index} className="turnos-card">
                {turno.turnos.map((t, idx) => (
                  <div key={idx} className="turno-detalle">
                    <div className="turnos-header">
                      <h2 className="turnos-title">{t.tur_tipo_turno}</h2>
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
                      <span className="span">{t.tur_total_horas}</span> Horas trabajadas
                    </div>
                  </div>
                ))}
                <div className='actividad-item'>
                  <FaBuilding className='svg' />
                  <span className="span">{turno.sede_nombre}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No hay turnos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};
