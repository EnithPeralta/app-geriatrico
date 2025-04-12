import React, { useEffect, useState } from 'react';
import { useGeriatrico, useTurnos } from '../../hooks';
import { SideBarComponent } from '../../components';
import { FaCalendarDay, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '../../components/Tabs/Tabs';
import { ModalActualizarTurno } from '../components/Turnos/ModalActualizarTurno';
import { HistoryTurnosSedePage } from './HistoryTurnosSedePage';

export const TurnoSedePage = () => {
    const { homeMiGeriatrico } = useGeriatrico();
    const { verTurnosSede, eliminarTurnoEnfermeria } = useTurnos();
    const [turnosSede, setTurnosSede] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState("");
    const [turnoEditar, setTurnoEditar] = useState(null);
    const [geriatrico, setGeriatrico] = useState(null);
    const navigate = useNavigate();

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
        const fetchTurnoSedes = async () => {
            try {
                const response = await verTurnosSede();
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

        if (!resultado.isConfirmed) return; 

        try {
            const response = await eliminarTurnoEnfermeria(tur_id);
            if (response.success) {
                setTurnosSede(turnosSede.filter(turno => turno.tur_id !== tur_id));
                Swal.fire({
                    icon: "success",
                    text: response.message
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text: response.message
                });
            }
        } catch (error) {
            console.error("Error al eliminar turno:", error);
            Swal.fire({
                icon: "error",
                text: "No se pudo eliminar el turno."
            });
        }
    };

    const handleTabClick = (index) => {
        if (index === 1) {
            navigate(`/geriatrico/historialTurnoSede`);
        }
    };

    const tabs = [
        {
            title: "Turnos Asignados",
            content: (
                <>
                    <h2 className="h1"><FaCalendarDay /> Turnos Asignados</h2>
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
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnosFiltrados.length > 0 ? (
                                    turnosFiltrados.map((t, index) => (
                                        <tr key={index}>
                                            <td>{t.nombre_enfermera}</td>
                                            <td>{t.doc_enfermera}</td>
                                            <td>{t.tipo_turno}</td>
                                            <td>{t.fecha_inicio}</td>
                                            <td>{t.fecha_fin}</td>
                                            <td>{t.hora_inicio}</td>
                                            <td>{t.hora_fin}</td>
                                            <td>{t.total_horas_turno}</td>
                                            <td>
                                                <div className="buttons-asignar">
                                                    <button className="btn-edit" onClick={() => setTurnoEditar(t.turno_id)} title='Editar'>
                                                        <FaEdit />
                                                    </button>
                                                    <button className="btn-delete" onClick={() => handleEliminarTurno(t.turno_id)} title='Eliminar'>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No hay turnos asignados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ),
        },
        {
            title: "Historial de Turnos",
            content: <HistoryTurnosSedePage />,
        },
    ];

    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content" style={{ backgroundColor: geriatrico?.color_principal }}>
                <Tabs tabs={tabs} activeTab={0} onClick={handleTabClick} />
            </div>
            {turnoEditar && (
                <ModalActualizarTurno
                    turno={turnoEditar}
                    setTurnos={setTurnosSede}
                    onClose={() => setTurnoEditar(null)}
                />
            )}
        </div>
    );
};

