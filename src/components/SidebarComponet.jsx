import React, { useState, useEffect, useRef } from 'react';
import "../css/side.css";
import { FaAngleDoubleLeft, FaArrowCircleRight, FaHome, FaHotel, FaUser, FaUsersCog, FaUsers, FaHandshake, FaHospitalUser, FaUserNurse, FaBuilding, FaFileMedicalAlt, FaFileContract, FaUserPlus, FaUserCog, FaCapsules } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuthStore, useGeriatrico, useSede, useSession } from '../hooks';
import { useNavigate } from "react-router-dom";
import { resetRol } from '../store/geriatrico';
import { useDispatch } from 'react-redux';



export const SideBarComponent = () => {
    const { startLogout } = useAuthStore();
    const { obtenerSesion } = useSession();
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerSedesHome } = useSede()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [esSuperAdmin, setEsSuperAdmin] = useState(false);
    const [adminGeriatrico, setAdminGeriatrico] = useState(false);
    const [adminSede, setAdminSede] = useState(false);
    const [enfermera, setEnfermera] = useState(false);
    const [acudiente, setAcudiente] = useState(false);
    const [geriatrico, setGeriatrico] = useState(null);
    const navigate = useNavigate();
    const [sede, setSede] = useState([]);
    const [error, setError] = useState(null);
    const fetchedRef = useRef(false);
    const dispatch = useDispatch();


    useEffect(() => {
        if (!fetchedRef.current) {
            const fetchSesion = async () => {
                const sesion = await obtenerSesion();
                setEsSuperAdmin(sesion?.esSuperAdmin || false);
                setAdminGeriatrico(sesion?.rol_id === 2);
                setAdminSede(sesion?.rol_id === 3);
                setEnfermera(sesion?.rol_id === 5);
                setAcudiente(sesion?.rol_id === 6);
            };
            fetchSesion();
            fetchedRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (esSuperAdmin) return;

        const fetchSede = async () => {
            try {
                const result = await homeMiGeriatrico();
                if (result.success && result.geriatrico) {
                    setGeriatrico(result.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            }
        };
        fetchSede();
    }, [esSuperAdmin]);


    useEffect(() => {
        const fetchSedeEspecifica = async () => {
            if (esSuperAdmin || adminGeriatrico) return;

            try {
                const result = await obtenerSedesHome();
                console.log("📡 Respuesta de la API:", result);
                if (result.success && result.sede && result.geriatrico) {
                    setSede(result.sede);  // Aseguramos que `sede` es un objeto válido
                    setGeriatrico(result.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            }
        };

        fetchSedeEspecifica();
    }, [esSuperAdmin, adminGeriatrico]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (esSuperAdmin) {
        return (
            <div className="main-container">
                <div className="animate__animated animate__fadeInLeft">
                    <nav id="sidebar" className={sidebarOpen ? '' : 'close'}>
                        <ul>
                            <li>
                                <img src="/logoBlack.png" alt="Logo" className="logo-fundacion" />
                                <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                    <FaAngleDoubleLeft />
                                </button>
                            </li>
                            <li>
                                <Link to={'/geriatrico/superAdmin'}>
                                    <FaHome className='icon' />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/geriatrico'}>
                                    <FaHotel className='icon' />
                                    <span>Geriatricos</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/asignar'}>
                                    <FaUsers className='icon' />
                                    <span>Personas</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/roles'}>
                                    <FaUserCog className='icon' />
                                    <span>Roles</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/register'}>
                                    <FaUserPlus />
                                    <span>Registrar</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/profile'}>
                                    <FaUser className='icon' />
                                    <span>Perfil</span>
                                </Link>
                            </li>

                            <li>
                                <div onClick={startLogout}>
                                    <a>
                                        <FaArrowCircleRight className='icon' />
                                        <span>Salir</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Contenedor del contenido principal */}
                    <div className="content">
                        {/* Aquí se carga el contenido principal para Super Admin */}
                    </div>
                </div>
            </div>
        );
    }

    if (adminGeriatrico) {
        return (
            <div className="main-container">
                <div className="animate__animated animate__fadeInLeft">
                    <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                        <ul>
                            <li>
                                <img src={geriatrico?.ge_logo} alt="Logo" style={{ width: "90px", height: "90px", padding: "10px" }} className="logo-fundacion" />
                                <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                    <FaAngleDoubleLeft />
                                </button>
                            </li>
                            <li onClick={() => {
                                localStorage.removeItem("rol_id"); // 🔥 Borra el rol de localStorage
                                dispatch(resetRol()); // 🔥 Resetea el rol en Redux
                                navigate("/geriatrico/home"); // 🔀 Redirige
                            }}>
                                <Link>
                                    <FaHome className="icon" />
                                    <span>Inicio</span>
                                </Link>
                            </li>

                            <li>
                                <Link to={'/geriatrico/sedes'}>
                                    <FaHotel />
                                    <span>Sedes</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/profile'}>
                                    <FaUser />
                                    <span>Perfil</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/register'}>
                                    <FaUserPlus />
                                    <span>Registrar</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/gestionarPersonas'}>
                                    <FaUsersCog />
                                    <span>Personas</span>
                                </Link>
                            </li>
                            <li>
                                <div onClick={startLogout}>
                                    <a>
                                        <FaArrowCircleRight />
                                        <span>Salir</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Contenedor del contenido principal */}
                    <div className="content" >
                        {/* Aquí se carga el contenido principal para Super Admin */}
                    </div>
                </div>
            </div>
        );
    }

    if (adminSede) {
        return (
            <div className="main-container">
                <div className="animate__animated animate__fadeInLeft">
                    <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                        <ul>
                            <li>
                                <img src={sede?.se_foto} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} className="logo-fundacion" />
                                <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                    <FaAngleDoubleLeft />
                                </button>
                            </li>

                            <li onClick={() => {
                                localStorage.removeItem("rol_id"); // 🔥 Borra el rol de localStorage
                                dispatch(resetRol()); // 🔥 Resetea el rol en Redux
                                navigate("/geriatrico/home"); // 🔀 Redirige
                            }}>
                                <Link>
                                    <FaHome className="icon" />
                                    <span>Inicio</span>
                                </Link>
                            </li>

                            <li>
                                <Link to={'/geriatrico/profile'}>
                                    <FaUser className='icon' />
                                    <span>Perfil</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/inventarioSede'}>
                                    <FaCapsules className='icon' />
                                    <span>Inventario</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/turnoSede'}>
                                    <FaBuilding className='icon' />
                                    <span>Turnos Sede</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/pacientes'}>
                                    <FaHospitalUser className='icon' />
                                    <span>Pacientes</span>
                                </Link>
                            </li><li>
                                <Link to={'/geriatrico/enfermeras'}>
                                    <FaUserNurse className='icon' />
                                    <span>Enfermeras</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatico/colaboradores'}>
                                    <FaHandshake className='icon' />
                                    <span>Colaborador</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/register'}>
                                    <FaUserPlus className='icon' />
                                    <span>Registrar</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/gestionarPersonas'}>
                                    <FaUsersCog className='icon' />
                                    <span>Ver Persona</span>
                                </Link>
                            </li>
                            <li>
                                <div onClick={startLogout}>
                                    <a>
                                        <FaArrowCircleRight className='icon' />
                                        <span>Salir</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Contenedor del contenido principal */}
                    <div className="content" >
                        {/* Aquí se carga el contenido principal para Super Admin */}
                    </div>
                </div>
            </div >
        );
    }

    if (enfermera) {
        return (
            <div className="main-container">
                <div className="animate__animated animate__fadeInLeft">
                    <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                        <ul>
                            <li>
                                <img src={sede?.se_foto} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} className="logo-fundacion" />
                                <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                    <FaAngleDoubleLeft />
                                </button>
                            </li>

                            <li onClick={() => {
                                localStorage.removeItem("rol_id"); // 🔥 Borra el rol de localStorage
                                dispatch(resetRol()); // 🔥 Resetea el rol en Redux
                                navigate("/geriatrico/home"); // 🔀 Redirige
                            }}>
                                <Link>
                                    <FaHome className="icon" />
                                    <span>Inicio</span>
                                </Link>
                            </li>

                            <li>
                                <Link to={'/geriatrico/misTurnos'}>
                                    <FaFileContract className='icon' />
                                    <span>Mis Turnos</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/historialTurnosEnfermera'}>
                                    <FaFileMedicalAlt className='icon' />
                                    <span>Mi Historial</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/pacientes'}>
                                    <FaHospitalUser className='icon' />
                                    <span>Pacientes</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/profile'}>
                                    <FaUser className='icon' />
                                    <span>Perfil</span>
                                </Link>
                            </li>
                            <li>
                                <div onClick={startLogout}>
                                    <a>
                                        <FaArrowCircleRight className='icon' />
                                        <span>Salir</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Contenedor del contenido principal */}
                    <div className="content" style={{ backgroundColor: geriatrico?.colores?.principal }}>
                        {/* Aquí se carga el contenido principal para Super Admin */}
                    </div>
                </div>
            </div>
        );
    }

    if (acudiente) {
        return (
            <div className="main-container">
                <div className="animate__animated animate__fadeInLeft">
                    <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                        <ul>
                            <li>
                                <img src={sede?.se_foto} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} className="logo-fundacion" />
                                <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                    <FaAngleDoubleLeft />
                                </button>
                            </li>

                            <li onClick={() => {
                                localStorage.removeItem("rol_id"); // 🔥 Borra el rol de localStorage
                                dispatch(resetRol()); // 🔥 Resetea el rol en Redux
                                navigate("/geriatrico/home"); // 🔀 Redirige
                            }}>
                                <Link>
                                    <FaHome className="icon" />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/misPacientes'}>
                                    <FaHospitalUser className='icon' />
                                    <span>Pacientes</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/profile'}>
                                    <FaUser className='icon' />
                                    <span>Perfil</span>
                                </Link>
                            </li>

                            <li>
                                <div onClick={startLogout}>
                                    <a>
                                        <FaArrowCircleRight className='icon' />
                                        <span>Salir</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Contenedor del contenido principal */}
                    <div className="content">
                        {/* Aquí se carga el contenido principal para Super Admin */}
                    </div>
                </div>
            </div>
        );
    }
    // Fallback o menú para otros roles (opcional)
    return null;
};
