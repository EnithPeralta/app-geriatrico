import React from 'react';

export const CardPersonColaborador = ({ colaboradores, onClick, onInactivate }) => {
    return (
        <div
            className={`user-card-container`}
            onClick={onClick}>
            <div className="user-details">
                <div className="user-role">{colaboradores.per_nombre}</div>
                <div className="user-id">{colaboradores.per_documento}</div>
                <div className="user-name">{colaboradores.enf_codigo}</div>
            </div>
            <div className="status-icon-person">
                {colaboradores.activoSede ? (
                    <i className="fa-solid fa-circle-check activo"></i>
                ) : (
                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                )}
            </div>
            <div className="buttons-asignar">
                <button className={colaboradores.activoSede ? 'asignar' : 'inactive'} onClick={onInactivate} title='Inactivar'>
                    <i className={`fa-solid ${colaboradores.activoSede ? "fa-user-gear asignar" : "fa-user-slash inactive"}`} />
                </button>
            </div>
        </div>
    );
};
