import React, { useState, useEffect, useRef } from 'react';
import "../css/side.css";
import { FaAngleDoubleLeft, FaArrowCircleRight, FaHome, FaHotel, FaUser, FaUsersCog, FaUsers, FaHandshake, FaHospitalUser, FaUserNurse, FaBuilding, FaFileMedicalAlt, FaFileContract, FaUserPlus, FaUserCog, FaCapsules, FaMedkit, FaHistory, FaCogs, FaUserEdit, FaUserTie } from 'react-icons/fa';
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
                if (result.success && result.sede && result.geriatrico) {
                    setSede(result.sede);
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
                                <Link to={'/geriatrico/superAdmin'} title='Inicio'>
                                    <FaHome className='icon' />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/geriatrico'} title='Geriatricos'>
                                    <FaHotel className='icon' />
                                    <span>Geriatricos</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/asignar'} title='Personas'>
                                    <FaUsers className='icon' />
                                    <span>Personas</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/roles'} title='Roles'>
                                    <FaCogs className='icon' />
                                    <span>Roles</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/register'} title='Registrar'>
                                    <FaUserPlus />
                                    <span>Registrar</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/profile'} title='Perfil'>
                                    <FaUser className='icon' />
                                    <span>Perfil</span>
                                </Link>
                            </li>

                            <li>
                                <div onClick={startLogout} title='Salir'>
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
                            <li
                                title='Inicio'
                                onClick={() => {
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
                                <Link to={'/geriatrico/sedes'} title='Sedes'>
                                    <FaHotel />
                                    <span>Sedes</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/gestionarPersonas'} title='Personas'>
                                    <FaUsers />
                                    <span>Personas</span>
                                </Link>
                            </li>

                            <li>
                                <Link to={'/register'} title='Registrar'>
                                    <FaUserPlus />
                                    <span>Registrar</span>
                                </Link>
                            </li>

                            <li>
                                <Link to={'/geriatrico/profile'} title='Perfil'>
                                    <FaUser />
                                    <span>Perfil</span>
                                </Link>
                            </li>
                            <li>
                                <div onClick={startLogout} title='Salir'>
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
            <div className="animate__animated animate__fadeInLeft">
                <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                    <ul>
                        <li>
                            <img src={sede?.se_foto} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} className="logo-fundacion" />
                            <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                <FaAngleDoubleLeft />
                            </button>
                        </li>

                        <li
                            title='Inicio'
                            onClick={() => {
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
                            <Link to={'/geriatrico/gestionarPersonas'}>
                                <FaUserCog className='icon' title='Gestionar Personas' />
                                <span>Ver Persona</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/turnoSede'}>
                                <FaBuilding className='icon' title='Turnos Sede' />
                                <span>Turnos Sede</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/pacientes'}>
                                <FaUser className='icon' title='Pacientes' />                                
                                <span>Pacientes</span>
                            </Link>
                        </li><li>
                            <Link to={'/geriatrico/enfermeras'}>
                                <FaUserNurse className='icon' title='Enfermeras' />
                                <span>Enfermeras</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/colaboradores'}>
                                <FaUserTie className='icon' title='Colaboradores' />
                                <span>Colaborador</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/medicamentos'}>
                                <FaMedkit className='icon' title='Medicamentos' />
                                <span>Medicamento</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/inventarioSede'}>
                                <FaCapsules className='icon' title='Inventario' />
                                <span>Inventario</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/register'}>
                                <FaUserPlus className='icon' title='Registrar' />
                                <span>Registrar</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/profile'}>
                                <FaUserEdit className='icon' title='Perfil' />
                                <span>Perfil</span>
                            </Link>
                        </li>
                        <li>
                            <div onClick={startLogout}>
                                <Link>
                                    <FaArrowCircleRight className='icon' title='Salir' />
                                    <span>Salir</span>
                                </Link>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    if (enfermera) {
        return (
            <div className="animate__animated animate__fadeInLeft">
                <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                    <ul>
                        <li>
                            <img src={sede?.se_foto} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} className="logo-fundacion" />
                            <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                <FaAngleDoubleLeft />
                            </button>
                        </li>

                        <li
                            title='Inicio'
                            onClick={() => {
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
                            <Link to={'/geriatrico/misTurnos'} title='Mis Turnos'>
                                <FaFileContract className='icon' />
                                <span>Mis Turnos</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/historialTurnosEnfermera'} title='Mis Historial'>
                                <FaHistory className='icon' />
                                <span>Mi Historial</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/pacientes'} title='Pacientes'>
                                <FaHospitalUser className='icon' />
                                <span>Pacientes</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/medicamentos'}>
                                <FaMedkit className='icon' title='Medicamentos' />
                                <span>Medicamento</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/profile'} title='Perfil'>
                                <FaUser className='icon' />
                                <span>Perfil</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/inventarioSede'}>
                                <FaCapsules className='icon' title='Inventario' />
                                <span>Inventario</span>
                            </Link>
                        </li>
                        <li>
                            <div onClick={startLogout} title='Salir'>
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
        );
    }

    if (acudiente) {
        return (
            <div className="animate__animated animate__fadeInLeft">
                <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                    <ul>
                        <li>
                            <img src={sede?.se_foto} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} className="logo-fundacion" />
                            <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                <FaAngleDoubleLeft />
                            </button>
                        </li>

                        <li
                            title='Inicio'
                            onClick={() => {
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
                            <Link to={'/geriatrico/misPacientes'} title='Mis Pacientes'>
                                <FaHospitalUser className='icon' />
                                <span>Pacientes</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/geriatrico/profile'} title='Perfil'>
                                <FaUser className='icon' />
                                <span>Perfil</span>
                            </Link>
                        </li>

                        <li>
                            <div onClick={startLogout} title='Salir'>
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
        );
    }
    // Fallback o menú para otros roles (opcional)
    return null;
};
