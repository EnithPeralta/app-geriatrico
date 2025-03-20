import React from 'react';

export const CardPersonEnfermera = ({ enfermera, onClick, onInactivate, onCrearTurno }) => {
    return (
        <div
            className={`user-card-container`}
            onClick={onClick}>
            <div className="user-details">
                <div className="user-role">{enfermera.per_nombre}</div>
                <div className="user-id">{enfermera.per_documento}</div>
                <div className="user-name">{enfermera.enf_codigo}</div>
            </div>
            <div className="status-icon-person">
                {enfermera.activoSede ? (
                    <i className="fa-solid fa-circle-check activo"></i>
                ) : (
                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                )}
            </div>
            <div className="buttons-asignar">
                <button className={enfermera.activoSede ? 'active' : 'inactive'} onClick={onInactivate}>
                    <i className={`fa-solid ${enfermera.activoSede ? "fa-user-gear active" : "fa-user-slash inactive"}`} />
                </button>
                {enfermera.activoSede && (
                    <button className="active" onClick={onCrearTurno}>
                        <i className="fa-solid fa-user-pen i-asignar"></i>
                    </button>
                )}
            </div>
        </div>
    );
};
