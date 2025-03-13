import React, { useState, useEffect, useRef } from 'react';
import "../css/side.css";
import {
    FaAngleDoubleLeft, FaArrowCircleRight, FaChevronDown,
    FaHome, FaHotel, FaUser, FaUsersCog, FaNotesMedical, FaPills,
    FaUsers
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuthStore, useGeriatrico, useSession } from '../hooks';


export const SideBarComponent = () => {
    const { startLogout } = useAuthStore();
    const { obtenerSesion } = useSession();
    const { homeMiGeriatrico } = useGeriatrico();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState({});
    const [esSuperAdmin, setEsSuperAdmin] = useState(false);
    const [adminGeriatrico, setAdminGeriatrico] = useState(false);
    const [adminSede, setAdminSede] = useState(false);
    const [geriatrico, setGeriatrico] = useState(null);
    const [error, setError] = useState(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!fetchedRef.current) {
            const fetchSesion = async () => {
                const sesion = await obtenerSesion();
                console.log("Sesion obtenida:", sesion);
                setEsSuperAdmin(sesion?.esSuperAdmin || false);
                setAdminGeriatrico(sesion?.rol_id === 2);
                setAdminSede(sesion?.rol_id === 3);
            };
            fetchSesion();
            fetchedRef.current = true;
        }
    }, [obtenerSesion]);

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
    }, []);
    
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSubMenu = (buttonId) => {
        if (!subMenuOpen[buttonId]) {
            closeAllSubMenus();
        }
        setSubMenuOpen((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
        if (!sidebarOpen) {
            setSidebarOpen(true);
        }
    };

    const closeAllSubMenus = () => {
        setSubMenuOpen({});
    };

    // Menú para Super Admin
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
                                    <FaHome className='icon'/>
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/geriatrico'}>
                                    <FaHotel className='icon'/>
                                    <span>Geriatricos</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/asignar'}>
                                    <FaUsers className='icon'/>
                                    <span>Ver Personas</span>
                                </Link>
                            </li>
                            
                            <li>
                                <Link to={'/geriatrico/profile'}>
                                    <FaUser className='icon'/>
                                    <span>Perfil</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/roles'}>
                                    <FaUsersCog className='icon'/>
                                    <span>Roles</span>
                                </Link>
                            </li>
                            <li>
                                <Link onClick={startLogout}>
                                    <FaArrowCircleRight className='icon' />
                                    <span>Salir</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => toggleSubMenu('informes')}
                                    className={`dropdown-btn ${subMenuOpen['informes'] ? 'rotate' : ''}`}
                                >
                                    <FaNotesMedical className='icon'/>
                                    <span>Informes de Enfermería</span>
                                    <FaChevronDown className='icon'/>
                                </button>
                                <ul className={`sub-menu ${subMenuOpen['informes'] ? 'show' : ''}`}>
                                    <div>
                                        <li><a href="#">Informes de Psicología</a></li>
                                        <li><a href="#">Informe de médico</a></li>
                                    </div>
                                </ul>
                            </li>
                            <li>
                                <button
                                    onClick={() => toggleSubMenu('medicamentos')}
                                    className={`dropdown-btn ${subMenuOpen['medicamentos'] ? 'rotate' : ''}`}
                                >
                                    <FaPills className='icon' />
                                    <span>Medicamentos y horarios</span>
                                    <FaChevronDown />
                                </button>
                                <ul className={`sub-menu ${subMenuOpen['medicamentos'] ? 'show' : ''}`}>
                                    <div>
                                        <li><a href="#">Medicamentos Suministrados</a></li>
                                    </div>
                                </ul>
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

    // Menú para Admin Geriátrico
    if (adminGeriatrico) {
        return (
            <div className="main-container">
                <div className="animate__animated animate__fadeInLeft">
                    <nav id="sidebar" className={sidebarOpen ? '' : 'close'} >
                        <ul>
                            <li>
                                <img src={geriatrico?.ge_logo} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} className="logo-fundacion" />
                                <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                                    <FaAngleDoubleLeft />
                                </button>
                            </li>
                            <li>
                                <Link to={'/geriatrico/home'}>
                                    <FaHome />
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
                                    <FaUsers />
                                    <span>Registrar</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/geriatrico/gestionarPersonas'}>
                                    <FaUsersCog />
                                    <span>Ver Personas</span>
                                </Link>
                            </li>
                            <li>
                                <Link onClick={startLogout}>
                                    <FaArrowCircleRight />
                                    <span>Salir</span>
                                </Link>
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
