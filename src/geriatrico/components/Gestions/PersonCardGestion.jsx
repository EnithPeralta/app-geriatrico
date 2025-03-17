import React from 'react';

export const PersonCardGestion = ({ persona, onClick, onEdit, onAssign }) => {
    return (
        <div
            className={`user-card-container`}
            onClick={onClick}>
            <div>
                {persona.foto ? (
                    <img src={persona.foto} alt="Foto de perfil" className="asignar-img" />
                ) : (
                    <i className="fas fa-user-circle "></i>
                )}
            </div>
            <div className="user-details">
                <div className="user-role">{persona.nombre}</div>
                <div className="user-id">{persona.documento}</div>
                <div className="user-name">{persona.correo}</div>
            </div>

            <div className="buttons-asignar">
                <button className="edit-button-asignar" onClick={onEdit}>
                    <i className="fa-solid fa-user-pen i-asignar"></i>
                </button>
                <button className="add-button-asignar" onClick={onAssign}>
                    <i className="fas fa-arrow-up i-asignar"></i>
                </button>
            </div>
        </div>
    );
};
