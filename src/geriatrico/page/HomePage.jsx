import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthStore, usePersona, useRoles } from "../../hooks";
import "../../css/home.css";
import { SelectRol } from "../components/SelectRol/SelectRol";

export const HomePage = () => {
    const { getAuthenticatedPersona } = usePersona();
    const { startLogout } = useAuthStore();
    const { seleccionarRol } = useRoles();
    const navigate = useNavigate();
    const [persona, setPersona] = useState(null);

    // Obtiene el rol seleccionado desde Redux
    const rolSeleccionado = useSelector((state) => state.roles?.rolSeleccionado ?? null);

    useEffect(() => {
        const fetchPersona = async () => {
            try {
                const result = await getAuthenticatedPersona();
                if (result.success) {
                    setPersona(result.persona);
                } else {
                    console.error("Error al obtener persona:", result.message);
                    setPersona(null);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error.message);
                setPersona(null);
            }
        };

        fetchPersona();
    }, []); // Se ejecuta solo una vez al montar el componente

    useEffect(() => {
        const rolStorage = localStorage.getItem("rol_id");
        if (!rolStorage || !rolSeleccionado || !rolSeleccionado.rol_id) {
            console.warn("⚠️ No hay rol seleccionado o se eliminó. No se redirige.");
            return;
        }

        console.log("🎯 Verificando rol seleccionado:", rolSeleccionado);

        if (rolSeleccionado.rol_id === 3 && rolSeleccionado.se_id) {
            navigate(`/geriatrico/sedeEspecifica`);
        } else if (rolSeleccionado.rol_id === 2) {
            console.log("🔀 Redirigiendo a /geriatrico/sedes...");
            navigate(`/geriatrico/sedes`);
        }else if (rolSeleccionado.rol_id === 5) {
            console.log("🔀 Redirigiendo a /geriatrico/pacientes...");
            navigate(`/geriatrico/pacientes`);
        }else if (rolSeleccionado.rol_id === 6) {
            console.log("🔀 Redirigiendo a /geriatrico/misPacientes...");
            navigate(`/geriatrico/misPacientes`);
        }
    }, [rolSeleccionado, navigate]);




    const handleRolChange = async (event) => {
        const selectedOption = event.target.selectedOptions[0];
        const rolId = selectedOption.value;
        const geId = selectedOption.getAttribute("data-ge_id");
        const seId = selectedOption.getAttribute("data-se_id"); // Agregar seId

        console.log("Rol seleccionado:", rolId, "GeID:", geId, "SeID:", seId);

        if (rolId && rolId !== String(rolSeleccionado?.rol_id)) {
            await seleccionarRol({ rol_id: rolId, ge_id: geId, se_id: seId }); // Enviar se_id
        }
    };

    return (
        <div className="bodyHome">
            <nav className="navbar" id="Inicio">
                <div className="navbar-container">
                    <img src="/logoF.png" alt="Logo" width="200" height="80" />
                    <SelectRol
                        label="Rol"
                        name="rol_id"
                        value={rolSeleccionado?.rol_id || ""}
                        onChange={handleRolChange}
                    />
                    <div className="space"></div>
                    <ul className="nav-links">
                        <div className="user-home" onClick={() => navigate("/geriatrico/profile")}>
                            <div className="picture">
                                {persona?.foto ? (
                                    <img src={persona.foto} alt="Foto Del Admin" className="admin-img" />
                                ) : (
                                    <i className="fas fa-user-circle"></i>
                                )}
                            </div>
                        </div>
                        <div className="change-password" onClick={() => navigate("/forgotPassword")}>
                            <i className="fa-solid fa-lock" />
                            <p className="change-password-text">Cambiar clave</p>
                        </div>
                        <button onClick={startLogout} className="btn-logout">
                            <i className="fa-solid fa-right-from-bracket" />
                        </button>
                    </ul>
                </div>
            </nav>
            <div className="carousel">
                <div className="carousel-list">
                    <div className="carousel-item">
                        <img src="/carrusel.jpg" alt="" />
                        <div className="carousel-content">
                            <div className="carousel-author">Geriatrico</div>
                            <div className="carousel-title">Bienvenido</div>
                            <div className="carousel-topic"> {persona ? persona.nombre : "Usuario"}</div>
                            <div className="carousel-description">
                                <div className="logo-container">
                                    <img src="/logoWhite.png" alt="Logo" className="logo-overlay" />
                                </div>
                                En la Fundación Años Maravillosos ofrecemos cuidados integrales y humanizados basados
                                en el respeto, empatía y la excelencia profesional. La fundación brinda un entorno seguro y
                                acogedor que promueva el bienestar físico, emocional y social de todos nuestros residentes,
                                mejorando así la calidad de vida de nuestros adultos mayores.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
