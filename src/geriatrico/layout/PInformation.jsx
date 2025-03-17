import React from 'react';
import { FaUser } from 'react-icons/fa';
import '../../css/pinformation.css';
import { useLocation } from 'react-router-dom';
export const PInformation = ({ persona, onEdit }) => {
    const location = useLocation();
    const title = location.pathname.includes('profile') ? 'Editar' : 'Acudiente';

    return (
        <div className="animate__animated animate__fadeInDown">
            <div className="profilee-card">
                <div>
                    {persona && persona.foto ? (
                        <img src={persona.foto} alt="Foto de usuario" className="profile-icon" />
                    ) : (
                        <div className="profile-icon">
                            <FaUser size={40} />
                        </div>
                    )}
                </div>
                <div className="profile-info">
                    <div className="profile-name">{persona && persona.nombre}</div>
                    <div className="profile-id">{persona && persona.documento}</div>
                </div>
                <div className="button-container">
                    <button className="acudiente-button" onClick={onEdit}>{title}</button>
                </div>
            </div>
        </div>
    );
}
