import React from "react";
import { CardPersonColaborador } from "./CardPersonColaborador";
import { RolesDisplayColaborador } from "./RolesDisplayColaborador";

export const PersonListColaborador = ({
    colaboradoresFiltrados,
    activeCard,
    handleCardClick,
    handleInactivarColaborador,
    roles,
}) => {
    return (
        <>
            {colaboradoresFiltrados.map((colaboradores) => (
                <div key={`${colaboradores.per_id}-${colaboradores.per_documento}`} style={{ position: "relative" }}>
                    <CardPersonColaborador
                       colaboradores={colaboradores}
                        activeCard={activeCard}
                        onClick={() => handleCardClick(colaboradores)}
                        onInactivate={(e) => {
                            e.stopPropagation();
                            if (colaboradores.activoSede) {
                                handleInactivarColaborador(colaboradores);
                            }
                        }}
                    />
                    
                    {/* Mostrar los roles solo si la tarjeta está activa */}
                    {activeCard === colaboradores.per_id && (
                        <div style={{ marginTop: "10px" }}>
                            <RolesDisplayColaborador roles={roles}  />
                        </div>
                    )}
                </div>
            ))}
        </>
    );
};
