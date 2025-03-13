import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import '../../css/pinformation.css';
export const PInformation = ({ persona, onEdit }) => {
    
    return (
        <div className="animate__animated animate__fadeInDown">
            <div className="profilee-card">
                <div className="">
                    {persona && persona.foto ? (
                        <img src={persona.foto} alt="Foto de usuario" className="profile-icon" />
                    ) : (
                        <div className="">
                            <FaUser size={40} />
                        </div>
                    )}
                </div>
                <div className="profile-info">
                    <div className="profile-name">{persona && persona.nombre}</div>
                    <div className="profile-id">{persona && persona.documento}</div>
                </div>
                <div className="button-container">
                    <button className="acudiente-button" onClick={onEdit}>Editar</button>
                </div>
            </div>
        </div>
    );
}
