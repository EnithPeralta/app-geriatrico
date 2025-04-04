import React from 'react';
import { useSession } from '../../../hooks';


export const CardPerson = ({ persona, onClick, onEdit, onAssign, onInactivate }) => {
    const { session } = useSession();
    return (
        <div
            className={`user-card-container`}
            onClick={onClick}>
            <div className="user-details">
                <div className="user-role">{persona.per_nombre}</div>
                <div className="user-id">{persona.per_usuario}</div>
                <div className="user-name">{persona.per_documento}</div>
                <div className="user-name">
                    {new Date(persona.gp_fecha_vinculacion).toLocaleDateString("es-ES")}
                </div>
            </div>
            <div className="status-icon-person">
                {persona.gp_activo ? (
                    <i className="fa-solid fa-circle-check activo"></i>
                ) : (
                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                )}
            </div>
            <div className="buttons-asignar">
                {session.rol_id !== 3 && (
                    <button className={persona.gp_activo ? 'asignar' : 'inactive'} onClick={onInactivate}>
                        <i className={`fa-solid ${persona.gp_activo ? "fa-user-gear " : "fa-user-slash inactive"}`} />
                    </button>
                )}
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
