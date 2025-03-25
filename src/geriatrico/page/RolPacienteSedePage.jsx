import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePaciente } from "../../hooks";

export const RolPacienteSedePage = () => {
  const { id } = useParams();
  const { obtenerRolesPacientesSede } = usePaciente();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchPacienteSede = async () => {
      try {
        const response = await obtenerRolesPacientesSede(id);
        console.log("Roles obtenidos correctamente.", response);
        if (response.success) {
          setRoles(response.data);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error al obtener los roles del paciente en la sede:", error);
      }
    };
    fetchPacienteSede();
  }, [id]); // Agregar id como dependencia para que el efecto se ejecute cuando cambie

  return (
    <div className="animate__animated animate__fadeInUp content">

      <div className="turnos-container-sede">
        <h2>Roles del paciente en la sede</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((rol, index) => (
                <tr key={index}>
                  <td>{rol.rol}</td>
                  <td>{rol.fechaInicio}</td>
                  <td>{rol.fechaFin ? rol.fechaFin : "Indefinido"}</td>
                  <td>{rol.activoSede ? "Activo" : "Inactivo"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay roles asignados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
