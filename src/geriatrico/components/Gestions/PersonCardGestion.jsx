import React from 'react';

export const PersonCardGestion = ({ persona, onClick, onEdit, onAssign }) => {
    return (
        <div
            className={`sede-card-asignar`}
            onClick={onClick}>
            {persona.foto ? (
                <img src={persona.foto} alt="Foto de perfil" className="asignar-img" />
            ) : (
                <i className="fas fa-user-circle "></i>
            )}
            <div className="sede-info">
                <div className="full-name">{persona.nombre}</div>
                <div className="CC">{persona.documento}</div>
                <div className="CC">{persona.fechaRegistro}</div>
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
