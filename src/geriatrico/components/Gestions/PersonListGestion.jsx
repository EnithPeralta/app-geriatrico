import { DisplayAsignar } from "../../../components/DisplayAsignar";
import { PersonCardGestion } from "./PersonCardGestion";

export const PersonListGestion = ({
    personasFiltradas = [], // Asegurar que no es undefined
    activeCard,
    handleCardClick,
    openEditModal,
    openAssignCard,
    geriatrico
}) => {
    return (
        <div>
            {personasFiltradas.length === 0 ? (
                <p>No hay personas disponibles</p>
            ) : (
                personasFiltradas
                    .filter(persona => persona !== null && persona !== undefined) // Filtrar valores nulos
                    .map(persona => (
                        <div key={`${persona.id}-${persona.documento}`} style={{ position: "relative" }}>
                            <PersonCardGestion
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
                            />
                            {activeCard === persona.id && (
                                <div style={{ marginTop: "10px" }}>
                                    <DisplayAsignar geriatrico={geriatrico} />
                                </div>
                            )}
                        </div>
                    ))
            )}
        </div>
    );
};
