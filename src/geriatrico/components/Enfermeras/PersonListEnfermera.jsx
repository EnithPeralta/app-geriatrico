import React from "react";
import { CardPersonEnfermera } from "./CardPersonEnfermera";
import { RolesDisplayEnfermera } from "./RolesDisplayEnfermera";

export const PersonListEnfermera = ({
    enfermerasFiltradas,
    activeCard,
    handleCardClick,
    handleInactivarEnfermera,
    handleCrearTurno,
    roles,
}) => {
    return (
        <>
            {enfermerasFiltradas.map((enfermera) => (
                <div key={`${enfermera.per_id}-${enfermera.per_documento}`} style={{ position: "relative" }}>
                    <CardPersonEnfermera
                        enfermera={enfermera}
                        activeCard={activeCard}
                        onClick={() => handleCardClick(enfermera)}
                        onInactivate={(e) => {
                            e.stopPropagation();
                            if (enfermera.activoSede) {
                                handleInactivarEnfermera(enfermera);
                            }
                        }}
                        onCrearTurno={(e) => {
                            e.stopPropagation();
                            if (enfermera.activoSede) {
                                handleCrearTurno(enfermera);
                            }
                        }}
                    />
                    
                    {/* Mostrar los roles solo si la tarjeta está activa */}
                    {activeCard === enfermera.per_id && (
                        <div style={{ marginTop: "10px" }}>
                            <RolesDisplayEnfermera roles={roles} enfermera={enfermera} />
                        </div>
                    )}
                </div>
            ))}
        </>
    );
};
