import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePaciente } from "../../hooks";

export const RolPacienteSedePage = () => {
  const { id } = useParams();
  const { obtenerRolesPacientesSede } = usePaciente();
  const [roles, setRoles] = useState([]); // Lista completa de roles
  const [filteredRoles, setFilteredRoles] = useState([]); // Roles filtrados por fecha
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchPacienteSede = async () => {
      try {
        const response = await obtenerRolesPacientesSede(id);
        console.log("Roles obtenidos correctamente.", response);
        if (response.success) {
          setRoles(response.data);
          setFilteredRoles(response.data); // Inicializar lista filtrada
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error al obtener los roles del paciente en la sede:", error);
      }
    };
    fetchPacienteSede();
  }, [id]);

  useEffect(() => {
    if (searchDate) {
      const filtered = roles.filter((rol) => {
        const fechaInicioFormatted = new Date(rol.fechaInicio).toISOString().split("T")[0];
        return fechaInicioFormatted === searchDate;
      });
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(roles);
    }
  }, [searchDate, roles]);

  return (
    <div className="animate__animated animate__fadeInUp content">
      <h2 className="h4">Historial del paciente</h2>
      <div className="search-container">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="search-input"
          placeholder="Buscar por fecha"
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((rol, index) => (
              <tr key={index}>
                <td>{rol.fechaInicio}</td>
                <td>{rol.fechaFin ? rol.fechaFin : "Indefinido"}</td>
                <td>{rol.activoSede ? "Activo" : "Inactivo"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay roles asignados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
