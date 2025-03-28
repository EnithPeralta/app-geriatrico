import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRoles } from "../../hooks";
import { LoadingComponet, SideBarComponent } from "../../components";

export const HistoyGeriatricoPage = () => {
    const { id } = useParams();
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { obtenerHistorialRoles } = useRoles();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const cargarHistorial = async () => {
            setLoading(true);
            setError(null);
            const response = await obtenerHistorialRoles({ ge_id: id });
            console.log("📌 Respuesta de la API:", response);
            if (response.success) {
                setHistorial(response.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        };

        if (id) {
            cargarHistorial();
        }
    }, [id]);

    // 🔍 Filtrado seguro por rango de fechas
    const filtrarHistorial = historial.filter((persona) => {
        if (!searchTerm.trim()) return true; // Si el campo de búsqueda está vacío, mostrar todo

        const searchDate = new Date(searchTerm);
        if (isNaN(searchDate)) return false; // Evita errores si searchTerm no es una fecha válida

        const tieneFechaEnRango = (roles) =>
            roles.some(({ fechaInicio, fechaFin }) => {
                if (!fechaInicio || !fechaFin) return false;
                
                const startDate = new Date(fechaInicio);
                const endDate = new Date(fechaFin);

                return searchDate >= startDate && searchDate <= endDate;
            });

        return (
            tieneFechaEnRango(persona.rolesGeriatrico) ||
            tieneFechaEnRango(persona.rolesSede)
        );
    });

    if (loading) return <LoadingComponet />;
    if (error) return (
        <div className="content">
            <div className="history-day">
                <div className='history-card'>
                    <h4 className="h4">Historial vacío</h4>
                    <p>{error}</p>
                </div>
            </div>
        </div>
    );

    if (filtrarHistorial.length === 0) return (
        <div className="history-day">
            <div className="history-card">
                <h4 className="h4">No hay historial de roles disponible.</h4>
            </div>
        </div>
    );

    return (
        <div className='animate__animated animate__fadeIn animate__faster'>
            <div className='main-container'>
                <SideBarComponent />
                <div className='content'>
                    <div className='gestionar'>
                        <h4 className='h4'>Historial</h4>
                        <input
                            type="date"
                            placeholder="Buscar por fecha"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    {filtrarHistorial.map((persona, index) => (
                        <div key={index} className="history-day">
                            <div className='history-card'>
                                <h4 className="h4">Datos Personales</h4>
                                <div className="segimiento-item">
                                    <label>Nombre:</label>
                                    <input type="text" value={persona.per_nombre} readOnly />
                                </div>
                                <div className="segimiento-item">
                                    <label>Teléfono:</label>
                                    <input type="text" value={persona.per_telefono} readOnly />
                                </div>
                                <div className="segimiento-item">
                                    <label>Correo:</label>
                                    <input type="text" value={persona.per_correo} readOnly />
                                </div>
                                <div className="segimiento-item">
                                    <label>Fecha Vinculación:</label>
                                    <input type="text" value={persona.gp_fecha_vinculacion} readOnly />
                                </div>
                                <div className="segimiento-item">
                                    <label>Estado:</label>
                                    <input type="text" value={persona.gp_activo ? "Activo" : "Inactivo"} readOnly />
                                </div>

                                <h4 className="h4">Roles en Geriátrico</h4>
                                {persona.rolesGeriatrico.length > 0 ? (
                                    <div>
                                        {persona.rolesGeriatrico.map((rol) => (
                                            <div key={rol.rol_id}>
                                                <div className="segimiento-item">
                                                    <label>Nombre</label>
                                                    <input type="text" value={rol.rol_nombre} readOnly />
                                                </div>
                                                <div className="segimiento-item">
                                                    <label>Estado</label>
                                                    <input type="text" value={rol.rol_activo ? "Activo" : "Inactivo"} readOnly />
                                                </div>
                                                <div className="segimiento-item">
                                                    <label>Fecha de Inicio</label>
                                                    <input type="text" value={rol.fechaInicio} readOnly />
                                                </div>
                                                <div className="segimiento-item">
                                                    <label>Fecha de Fin</label>
                                                    <input type="text" value={rol.fechaFin || "Presente"} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <label>No tiene roles en geriátrico.</label>
                                )}

                                <h4 className="h4">Roles en Sede</h4>
                                {persona.rolesSede.length > 0 ? (
                                    <div>
                                        {persona.rolesSede.map((rol, index) => (
                                            <div key={index}>
                                                <div className="segimiento-item">
                                                    <label>Nombre</label>
                                                    <input type="text" value={rol.rol_nombre} readOnly />
                                                </div>
                                                <div className="segimiento-item">
                                                    <label>Estado</label>
                                                    <input type="text" value={rol.rol_activo ? "Activo" : "Inactivo"} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <label>No tiene roles en sede.</label>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
