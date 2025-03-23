import React from 'react';
import { CardPerson } from './CardPerson';
import { RolesDisplay } from './RolesDisplay';

export const PersonList = ({
    personasFiltradas,
    activeCard,
    handleCardClick,
    openEditModal,
    openAssignCard,
    handleInactivarVinculacion,
    handleReactivarVinculacion,
    roles
}) => {
    return (
        <div>
            {personasFiltradas.map((persona, index) => (
                <div key={`${persona.per_id}-${persona.per_documento}-${index}`} style={{ position: "relative" }}>
                    <CardPerson
                        persona={persona}
                        activeCard={activeCard}
                        onClick={() => handleCardClick(persona)}
                        onEdit={(e) => {
                            e.stopPropagation();
                            openEditModal(persona);
                        }}
                        onAssign={(e) => {
                            e.stopPropagation();
                            openAssignCard(persona);
                        }}
                        onInactivate={(e) => {
                            e.stopPropagation();
                            persona.gp_activo ? handleInactivarVinculacion(persona) : handleReactivarVinculacion(persona);
                        }}
                    />
                    {/* Mostrar RolesDisplay solo si la tarjeta está activa */}
                    {activeCard === persona.per_id && (
                        <div style={{ marginTop: "10px" }}>
                            <RolesDisplay roles={roles} persona={persona} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
