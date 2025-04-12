import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

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
                <button className={enfermera.activoSede ? 'asignar' : 'inactive'} onClick={onInactivate} title='Inactivar'>
                    <i className={`fa-solid ${enfermera.activoSede ? "fa-user-gear asignar" : "fa-user-slash inactive"}`} />
                </button>
                {enfermera.activoSede && (
                    <button className="turnos" onClick={onCrearTurno} title='Asignar Turno'>
                        <FaArrowUp />
                    </button>
                )}
            </div>
        </div>
    );
};
