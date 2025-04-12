import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin.css";
import { useAuthStore, useGeriatrico } from "../../hooks";

export const AdminLayout = ({ children, persona, loading }) => {
    const { startLogout } = useAuthStore();
    const navigate = useNavigate();
    const [colores, setColores] = useState({
        principal: "#ffffff",
        secundario: "#f0f0f0",
        terciario: "#d9d9d9"
    });

   

    return (
        <div
            className="bodyAdmin"
        >
            {/* Header */}
            <div className="headerAdmin">   
                <div className="logo">
                    <img className="logo-img" src="/logo.png" alt="" />
                </div>
                <div className="action-buttons">
                    <button className="icon-button" >
                        <i className="fa-solid fa-share-nodes"></i>
                    </button>
                    <button className="icon-button" onClick={startLogout} title="Cerrar Sesión">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            </div>

            {/* Contenido dinámico */}
            <div className="content-grid">{children}</div>

            {/* Perfil de usuario */}
            <div
                className="user-profile"
                onClick={() => navigate("/geriatrico/profile")}
                style={{ backgroundColor: colores.terciario }}
            >
                <div className="picture">
                    {persona?.foto ? (
                        <img src={persona.foto} alt="Foto Del Admin" className="admin-img" />
                    ) : (
                        <i className="fas fa-user-circle" />
                    )}
                </div>
                <span className="user-name">
                    {loading ? "Cargando..." : persona?.nombre || "Usuario desconocido"}
                </span>
            </div>
        </div>
    );
};
