import React, { useEffect, useState } from 'react';
import { useTurnos } from '../../hooks';
import { SideBarComponent } from '../../components';
import { FaCalendarDay, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { HistoryTurnosSedePage } from './HistoryTurnosSedePage';
import { Tabs } from '../../components/Tabs/Tabs';

export const TurnoSedePage = () => {
    const { verTurnosSede, eliminarTurnoEnfermeria } = useTurnos();
    const [turnosSede, setTurnosSede] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTurnoSedes = async () => {
            try {
                const response = await verTurnosSede();
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
        };

        fetchTurnoSedes();
    }, []);

    // Filtrar los turnos según la fecha seleccionada
    const turnosFiltrados = fechaFiltro
        ? turnosSede.filter(turno => turno.tur_fecha_inicio === fechaFiltro)
        : turnosSede;

    const handleEliminarTurno = async (tur_id) => {
        const resultado = await Swal.fire({
            text: "¿Estás seguro de eliminar este turno?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        });

        if (!resultado.isConfirmed) return; // Si el usuario cancela, no hace nada

        try {
            const response = await eliminarTurnoEnfermeria(tur_id);
            console.log(response);

            if (response.success) {
                setTurnosSede(turnosSede.filter(turno => turno.tur_id !== tur_id));
                Swal.fire("Eliminado", "El turno ha sido eliminado exitosamente.", "success");
            } else {
                Swal.fire("Error", response.message, "error");
            }
        } catch (error) {
            console.error("Error al eliminar turno:", error);
            Swal.fire("Error", "No se pudo eliminar el turno.", "error");
        }
    };

    const handleTabClick = (index) => {
        if (index === 1) {
            navigate(`/geriatrico/historialTurnoSede`)
        }
    };

    // Definir las pestañas
    const tabs = [
        {
            title: "Turnos Asignados",
            content: (
                <>
                    <h2 className='h1'><FaCalendarDay /> Turnos Asignados</h2>
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
                                    <th>Accion</th>
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
                                            <td>
                                                <button className="btn-delete" onClick={() => handleEliminarTurno(turno.tur_id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
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
                </>
            )
        },
        {
            title: " Historial de Turnos",
            content: <HistoryTurnosSedePage />
        }
    ];

    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content">
                <Tabs tabs={tabs} activeTab={0} onClick={handleTabClick} />
            </div>
        </div>
    );
};
