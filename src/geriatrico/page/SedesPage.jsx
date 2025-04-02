import React, { useEffect, useState } from 'react'
import { useGeriatrico, useSede } from '../../hooks';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingComponet, SideBarComponent } from '../../components';
import { setRolSeleccionado } from '../../store/geriatrico';
import Swal from 'sweetalert2';
import '../../css/geriatrico.css';
import { SedeModal } from '../../components/ModalSedes/SedeModal';
import { SedeDetalle } from '../../components/ModalSedes/SedeDetalle';

export const SedesPage = () => {
    const { obtenerSedesGeriatrico, obtenerDetalleSede, reactivarSedes, inactivarSedes } = useSede();
    const { homeMiGeriatrico } = useGeriatrico();
    const [sedes, setSedes] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpens, setIsModalOpens] = useState(false);
    const [sedeToEdit, setSedeToEdit] = useState(null);
    const [selectedSede, setSelectedSede] = useState(null);
    const [geriatrico, setGeriatrico] = useState(null);
    const dispatch = useDispatch();
    const rolSeleccionado = useSelector(state => state.roles?.rolSeleccionado ?? null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const storedRolId = localStorage.getItem("rol_id");
        const storedGeId = localStorage.getItem("ge_id");

        if (!rolSeleccionado && storedRolId) {
            dispatch(setRolSeleccionado({ rol_id: Number(storedRolId), ge_id: storedGeId ? Number(storedGeId) : null }));
        }
    }, [dispatch, rolSeleccionado]);


    useEffect(() => {
        const fetchSede = async () => {
            try {
                setLoaded(true);
                setError(null);
                const result = await homeMiGeriatrico();
                if (result.success && result.geriatrico) {
                    setGeriatrico(result.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoaded(false);
            }
        };
        if (!geriatrico) fetchSede();
    }, [geriatrico]);


    useEffect(() => {
        if (rolSeleccionado && !loaded) {
            setLoaded(true);
            obtenerSedesGeriatrico(Number(rolSeleccionado.rol_id))
                .then(response => {
                    if (response.success) {
                        setSedes(response.sedes);
                    } else {
                        setError(response.message);
                    }
                })
                .catch(() => setError("Error obteniendo sedes"));
        }
    }, [rolSeleccionado]);

    const handleOpenModal = (sede = null) => {
        setSedeToEdit(sede ?? null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSedeToEdit(null);
    };

   
const handleSaveSede = (newSede) => {
    setSedes((prevSedes) => {
        const index = prevSedes.findIndex((s) => s.se_id === newSede.se_id);
        if (index !== -1) {
            // Actualiza la sede existente
            const updatedSedes = [...prevSedes];
            updatedSedes[index] = newSede;
            return updatedSedes;
        } else {
            // Agrega una nueva sede
            return [...prevSedes, newSede];
        }
    });
};
    const handleInactivarSedes = async (se_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas inactivar la sede?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Inactivar",
            cancelButtonText: "Cancelar"
        });
    
        if (confirm.isConfirmed) {
            try {
                const result = await inactivarSedes(se_id);
                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        text: result.message,
                    });
                    setSedes(prev =>
                        prev.map(s => (s.se_id === se_id ? { ...s, se_activo: false } : s)) // Corrección aquí
                    );
                } else {
                    Swal.fire(result.message, "error");
                }
            } catch {
                console.log("Error al inactivar la sede");
                Swal.fire("No se pudo inactivar la sede", "error");
            }
        }
    };

    const handleReactivarSedes = async (se_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas reactivar esta sede?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, reactivar",
            cancelButtonText: "Cancelar"
        });
    
        if (confirm.isConfirmed) {
            try {
                const result = await reactivarSedes(se_id);
                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        text: result.message
                    });
                    setSedes(prev =>
                        prev.map(s => (s.se_id === se_id ? { ...s, se_activo: true } : s)) // Corrección aquí
                    );
                } else {
                    Swal.fire(result.message, "error");
                }
            } catch {
                console.log("Error al reactivar la sede");
                Swal.fire("No se pudo reactivar la sede", "error");
            }
        }
    };

    const filteredSedes = sedes.filter(sede =>
        sede.se_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.se_direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDetalles = async (se_id) => {
        try {
            const result = await obtenerDetalleSede(se_id);
            if (result.success) {
                setSelectedSede(result.sede);
                setIsModalOpens(true);
            } else {
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loaded) {
        return <LoadingComponet />;
    }
    return (
        <div className='flex' >
            <div className="animate__animated animate__fadeInLeft">
                <SideBarComponent />
            </div>
            <div className="main-content" style={{ backgroundColor: geriatrico?.color_secundario }}>
                <input type="text"
                    placeholder="Buscar por nombre o dirección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className="grid">
                    {filteredSedes.length > 0 ? (
                        filteredSedes.map((sede) => (
                            <div key={sede.se_id} >
                                <div className="grid-item">
                                    {sede.se_foto ? (
                                        <img className="" src={sede.se_foto} alt={`${sede.se_nombre}`} width="100" height="100" />
                                    ) : (
                                        <i className="fa-solid fa-hospital" />
                                    )}
                                    <span >{sede.se_nombre}</span>
                                    <span>{sede.se_direccion}</span>
                                    <div className="status-icon-sedes">
                                        {sede.se_activo ? (
                                            <i className="fa-solid fa-circle-check activo"></i>
                                        ) : (
                                            <i className="fa-solid fa-circle-xmark inactivo"></i>
                                        )}
                                    </div>
                                    <button className="details-button" onClick={() => handleDetalles(sede.se_id)} >
                                        Ver Mas
                                    </button>
                                    <div className="actions">
                                        <button
                                            className={`toggle-button ${sede.se_activo ? 'active' : 'inactive'}`}
                                            onClick={() => {
                                                if (sede.se_activo) {
                                                    handleInactivarSedes(sede.se_id);
                                                } else {
                                                    handleReactivarSedes(sede.se_id);
                                                }
                                            }}
                                        >
                                            <i className={`fas ${sede.se_activo ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                                        </button>

                                        <div className="edit-button-sedes" onClick={() => handleOpenModal(sede)}>
                                            <i className="fas fa-edit"></i>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron sedes.</p>
                    )}
                    <div className="grid-item">
                        <div className="grid-item-add" onClick={() => setIsModalOpen(true)}>
                            <i className="fas fa-circle-plus" />
                            <p>Crear Sedes</p>
                        </div>
                    </div>
                </div>
            </div>
            <SedeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveSede}
                sede={sedeToEdit}
            />
            <SedeDetalle
                sedeDetalle={selectedSede}
                isOpens={isModalOpens}
                onClose={() => setIsModalOpens(false)}
            />
        </div>
    )
}
