import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTurnos } from "../../../hooks";

export const ModalActualizarTurno = ({ turno, onClose, setTurnos }) => {
  const { actualizarTurnoEnfermeria } = useTurnos();

  // Estados para los valores del formulario
  const [turFechaInicio, setTurFechaInicio] = useState("");
  const [turFechaFin, setTurFechaFin] = useState("");
  const [turHoraInicio, setTurHoraInicio] = useState("");
  const [turHoraFin, setTurHoraFin] = useState("");
  const [turTipoTurno, setTurTipoTurno] = useState("");

  // Efecto para cargar los datos cuando se abre el modal
  useEffect(() => {
    if (turno) {
      setTurFechaInicio(turno.fecha_inicio || "");
      setTurFechaFin(turno.fecha_fin || "");
      setTurHoraInicio(turno.hora_inicio || "");
      setTurHoraFin(turno.hora_fin || "");
      setTurTipoTurno(turno.tipo_turno || "");
    }
  }, [turno]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({
        tur_id: turno,
        tur_fecha_inicio: turFechaInicio,
        tur_fecha_fin: turFechaFin,
        tur_hora_inicio: turHoraInicio,
        tur_hora_fin: turHoraFin,
        tur_tipo_turno: turTipoTurno,
      });

      const response = await actualizarTurnoEnfermeria({
        tur_id: turno,
        tur_fecha_inicio: turFechaInicio,
        tur_fecha_fin: turFechaFin,
        tur_hora_inicio: turHoraInicio,
        tur_hora_fin: turHoraFin,
        tur_tipo_turno: turTipoTurno,
      });

      console.log("Respuesta del backend:", response);

      if (response && response.success) {
        Swal.fire({
          icon: "success",
          text: response.message,
        });
        setTurnos(prevTurnos =>
          prevTurnos.map((t) =>
            t.turno_id === turno.turno_id ? response.data : t
          )
        );

        onClose();
      } else {
        Swal.fire({
          icon: "error",
          titleText: response.message,
          text: response.conflito,
        });
      }
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
      Swal.fire("Error", "No se pudo actualizar el turno.", "error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <h2>Actualizar Turno</h2>
          <form onSubmit={handleSubmit}>
            <div className="modal-field">
              <label>Fecha de Inicio:</label>
              <input
                type="date"
                value={turFechaInicio}
                onChange={(e) => setTurFechaInicio(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Fecha de Fin:</label>
              <input
                type="date"
                value={turFechaFin}
                onChange={(e) => setTurFechaFin(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Hora de Inicio:</label>
              <input
                type="time"
                value={turHoraInicio}
                onChange={(e) => setTurHoraInicio(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Hora de Fin:</label>
              <input
                type="time"
                value={turHoraFin}
                onChange={(e) => setTurHoraFin(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" className="create">
                Actualizar
              </button>
              <button type="button" className="cancel" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
