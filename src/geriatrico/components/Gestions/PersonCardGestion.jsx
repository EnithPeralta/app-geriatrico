import React from 'react';
import { FaArrowUp, FaUserEdit } from 'react-icons/fa';

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
                <button className="edit-button-asignar" onClick={onEdit} title='Editar'>
                    <FaUserEdit className='i-asignar' />
                </button>
                <button className="add-button-asignar" onClick={onAssign} title='Vincular' >
                    <FaArrowUp />
                </button>
            </div>
        </div>
    );
};
