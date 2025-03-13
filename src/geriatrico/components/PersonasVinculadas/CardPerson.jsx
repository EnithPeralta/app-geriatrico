import React from 'react';

export const CardPerson = ({ persona, onClick, onEdit, onAssign, onInactivate }) => {
    return (
        <div
            className={`sede-card-asignar`}
            onClick={onClick}>
            <div className="sede-info">
                <div className="full-name">{persona.per_nombre}</div>
                <div className="CC">{persona.per_usuario}</div>
                <div className="CC">{persona.per_documento}</div>
                <div className="CC">{persona.gp_fecha_vinculacion}</div>
            </div>

            <div className="status-icon-active">
                {persona.gp_activo ? (
                    <i className="fa-solid fa-circle-check activo"></i>
                ) : (
                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                )}
            </div>

            <div className="buttons-asignar">
                <button className={persona.gp_activo ? 'active' : 'inactive'} onClick={onInactivate}>
                    <i className={`fa-solid ${persona.gp_activo ? "fa-user-gear active" : "fa-user-slash inactive"}`} />
                </button>
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
