import React, { useEffect, useState } from "react";
import { useGeriatricoPersona } from "../../hooks";
import { useParams } from "react-router-dom";
import { SideBarComponent } from "../../components";
import { PersonaCardRoles } from "../components/RolesPorGeriatrico/PersonaCardRoles";

export const RolesPorGeriatricoPage = () => {
    const { id } = useParams();
    const { personasVinculadasPorGeriatrico, obtenerPersonaRolesPorGeriatrico } = useGeriatricoPersona();
    const [personas, setPersonas] = useState([]);
    const [filteredPersonas, setFilteredPersonas] = useState([]);
    const [rolesPersonas, setRolesPersonas] = useState([]);
    const [activeCard, setActiveCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPersonas = async () => {
            try {
                const response = await personasVinculadasPorGeriatrico(id);
                if (response.success) {
                    setPersonas(response.data);
                    setFilteredPersonas(response.data);
                } else {
                    console.error(response.message);
                }
            } catch (err) {
                console.error("Error al obtener los datos:", err);
            }
        };
        fetchPersonas();
    }, [id]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredPersonas(
            personas.filter(persona => 
                persona.per_nombre.toLowerCase().includes(value)
            )
        );
    };

    const handleCardClick = async (persona) => {
        const isActive = activeCard === persona.per_id ? null : persona.per_id;
        setActiveCard(isActive);

        if (isActive) {
            try {
                const response = await obtenerPersonaRolesPorGeriatrico(persona.per_id, id);
                if (response.success) {
                    setRolesPersonas(response.data.persona);
                } else {
                    console.error(response.message);
                }
                console.log(`Roles para ${persona.per_nombre}:`, response);
            } catch (error) {
                console.error("Error al obtener los roles de la persona:", error);
            }
        }
    };

    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content-area">
                <h2 className="gestionar-title">Roles Por Geriatría</h2>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Buscar por nombre" 
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <PersonaCardRoles
                    personas={filteredPersonas}
                    activeCard={activeCard}
                    handleCardClick={handleCardClick}
                    rolesPersonas={rolesPersonas}
                    ge_id={id}
                />
            </div>
        </div>
    );
};
