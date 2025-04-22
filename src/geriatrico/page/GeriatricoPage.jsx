import { useEffect, useState } from "react";
import { useGeriatrico } from "../../hooks/useGeriatrico";
import Swal from "sweetalert2";
import '../../css/geriatrico.css';
import { useNavigate } from "react-router-dom";
import 'animate.css';
import { LoadingComponet, ModalCrearGeriatrico, ModalGeriatrico, SideBarComponent, ModalEditarGeriatrico } from "../../components";
import { FaEdit, FaEye, FaFile, FaUserEdit } from "react-icons/fa";

export const GeriatricosPage = () => {
    const { obtenerGeriatricos, crearGeriatrico, actualizarGeriatrico, inactivarGeriatrico, reactivarGeriatrico } = useGeriatrico();
    const [geriatricos, setGeriatricos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGeriatrico, setSelectedGeriatrico] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGeriatricos = async () => {
            try {
                const result = await obtenerGeriatricos();
                console.log(result);
                if (result.success) {
                    setGeriatricos(result.geriatricos);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError("Error al obtener los geriátricos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGeriatricos();
    }, []);

    const handleViewDetails = (geriatrico) => {
        setSelectedGeriatrico(geriatrico);
        setIsModalOpen(true);
    };

    const handleEditGeriatrico = (geriatrico) => {

        if (!geriatrico || !geriatrico.ge_id) {
            console.error("No se encontró el ID del geriátrico al editar:", geriatrico);
            return;
        }
        setSelectedGeriatrico(geriatrico);
        setIsEditModalOpen(true);
    };

    const handleSaveGeriatrico = async (nuevoGeriatrico) => {
        const result = await crearGeriatrico(nuevoGeriatrico);
        if (result.success) {
            setGeriatricos(prev => [...prev, result.geriatrico]);
            setIsCreateModalOpen(false);
        }
        return result;
    };


    const handleUpdateGeriatrico = async (ge_id, datosActualizados) => {
        console.log("Datos recibidos en handleUpdateGeriatrico -> ID:", ge_id, "Datos:", datosActualizados);

        if (!ge_id) {
            console.error("ID del geriátrico no válido:", ge_id);
            return;
        }

        const result = await actualizarGeriatrico(ge_id, datosActualizados);

        if (result.success) {
            setGeriatricos(prevGeriatricos =>
                prevGeriatricos.map(g => (g.ge_id === ge_id ? result.geriatrico : g))
            );
            setSelectedGeriatrico(result.geriatrico);
            setIsEditModalOpen(false);
        } else {
            console.error(result.message);
        }
    };

    const handleInactivarGeriatrico = async (ge_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas inactivar este geriátrico?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, Inactivar",
            cancelButtonText: "Cancelar"
        });
        if (confirm.isConfirmed) {
            const result = await inactivarGeriatrico(ge_id);
            if (result.success) {
                Swal.fire({ icon: "success", text: result.message });
                setGeriatricos(prev =>
                    prev.map(g => (g.ge_id === ge_id ? { ...g, ge_activo: false } : g))
                );
            } else {
                Swal.fire("Error", result.message, "error");
            }
        }
    };

    const handleReactivarGeriatrico = async (ge_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas reactivar este geriátrico?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, reactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            const result = await reactivarGeriatrico(ge_id);

            if (result.success) {
                Swal.fire({ icon: "success", text: "El geriátrico ha sido reactivado correctamente." });
                setGeriatricos(prev =>
                    prev.map(g => (g.ge_id === ge_id ? { ...g, ge_activo: true } : g))
                );
            } else {
                Swal.fire("Error", result.message, "error");
            }
        }
    };

    const handleRolesGeriatrico = (geriatrico) => {
        if (!geriatrico || !geriatrico.ge_id) return;
        navigate(`/geriatrico/rolesPorGeriatrico/${geriatrico.ge_id}`);
        console.log("Roles geriátrico:", geriatrico);
    };

    const handleHistorialGeriatrico = (geriatrico) => {
        console.log("Historial del geriátrico:", geriatrico);
        if (!geriatrico || !geriatrico.ge_id) return;
        navigate(`/geriatrico/historialGeriatrico/${geriatrico.ge_id}`);
        console.log("Historial del geriátrico:", geriatrico);
    };

    if (loading) return <LoadingComponet />;
    if (error) return <p className="error">{error}</p>;

    const filteredGeriatricos = geriatricos.filter((geriatrico) =>
        geriatrico.ge_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        geriatrico.ge_nit.toString().includes(searchTerm)
    );

    return (
        <div className="flex">
            <div className="animate__animated animate__fadeInLeft">
                <SideBarComponent />
            </div>

            <div className="main-content">
                <div className="animate__animated animate__fadeInDown">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o NIT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <i className="fa-solid fa-magnifying-glass"></i>

                    </div>
                </div>


                <div className="grid">

                    {filteredGeriatricos.length > 0 ? (
                        filteredGeriatricos.map((geriatrico) => (
                            <div key={geriatrico.ge_nit} >
                                <div className="grid-item" >
                                    <img
                                        src={geriatrico.ge_logo || "/public/Admin.jpg"}
                                        alt="Logo"
                                        width="100"
                                        height="100"
                                        onError={(e) => { e.target.src = "/public/Admin.jpg"; }}
                                    />
                                    <span className="geriatrico-name">{geriatrico.ge_nombre}</span>
                                    <p className="geriatrico-nit">NIT: {geriatrico.ge_nit}</p>
                                    <div className="color-boxes">
                                        <span className="color-box" style={{ backgroundColor: geriatrico.ge_color_principal }}></span>
                                        <span className="color-box" style={{ backgroundColor: geriatrico.ge_color_secundario }}></span>
                                        <span className="color-box" style={{ backgroundColor: geriatrico.ge_color_terciario }}></span>
                                    </div>

                                    <div className="status-icon">
                                        {geriatrico.ge_activo ? (
                                            <i className="fa-solid fa-circle-check activo"></i>
                                        ) : (
                                            <i className="fa-solid fa-circle-xmark inactivo"></i>
                                        )}
                                    </div>
                                    <div className="details">
                                        <button className="details-button" onClick={() => handleViewDetails(geriatrico)}>
                                            <FaEye /> Ver Sedes
                                        </button>
                                        <button className="details-button" onClick={() => handleRolesGeriatrico(geriatrico)}>
                                            <FaFile /> Historial Roles
                                        </button>
                                    </div>
                                    <div className="actions">
                                        <button
                                            className={`toggle-button ${geriatrico.ge_activo ? 'activo' : 'inactivo'}`}
                                            onClick={() => {
                                                if (geriatrico.ge_activo) {
                                                    handleInactivarGeriatrico(geriatrico.ge_id);
                                                } else {
                                                    handleReactivarGeriatrico(geriatrico.ge_id);
                                                }
                                            }}
                                            title="Activar/Desactivar"
                                        >
                                            <i className={`fas ${geriatrico.ge_activo ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                                        </button>

                                        <button className="edit-button" title="Editar" onClick={() => handleEditGeriatrico(geriatrico)}>
                                            <i className="fas fa-edit" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No se encontraron resultados</p>
                    )}
                    <div className="grid-item">
                        <div className="grid-item-add" onClick={() => setIsCreateModalOpen(true)}>
                            <i className="fas fa-circle-plus" />
                            <p>Crear Geriatrico</p>
                        </div>
                    </div>
                </div>
            </div>
            <ModalGeriatrico
                geriatrico={selectedGeriatrico}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <ModalCrearGeriatrico
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSaveGeriatrico}
            />
            <ModalEditarGeriatrico
                geriatrico={selectedGeriatrico}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateGeriatrico}
            />
        </div>
    );
};
