import React from "react";
import { RolesDisplayComponet } from "../../../components";

export const PersonaCardRoles = ({
    personas = [],
    activeCard,
    handleCardClick,
    rolesPersonas,
    ge_id,
}) => {
    console.log("get", ge_id);
    return (
        <>
            {personas.map((persona, index) => (
                <div
                    key={`${persona.per_id}-${persona.per_documento}-${index}`}
                    onClick={() => handleCardClick(persona)}
                    style={{ position: "relative" }}
                >
                    <div className="user-card-container">
                        <div className="user-details">
                            <div className="user-role">{persona.per_nombre}</div>
                            <div className="user-name">{persona.per_documento}</div>
                            
                            {new Date(persona.gp_fecha_vinculacion).toLocaleDateString("es-ES")}
                        </div>
                        <div className="status-icon-person">
                            {persona.gp_activo ? (
                                <i className="fa-solid fa-circle-check activo"></i>
                            ) : (
                                <i className="fa-solid fa-circle-xmark inactivo"></i>
                            )}
                        </div>

                    </div>

                    {activeCard === persona.per_id && (
                        <div style={{ marginTop: "10px" }}>
                            <RolesDisplayComponet rolesPersonas={rolesPersonas} person={persona} getId={ge_id} />
                        </div>
                    )}
                </div>
            ))}
        </>
    );
};
