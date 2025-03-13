import React, { useEffect, useState } from "react";
import { CheckoxFieldProps } from "./types";
import { useRoles, useSession } from "../../hooks";

export const CheckboxField = (props: CheckoxFieldProps) => {
    const { obtenerRoles } = useRoles();
    const { session, obtenerSesion } = useSession();
    const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    useEffect(() => {
        const cargaRoles = async () => {
            try {
                if (!session) {
                    console.warn("🔄 Obteniendo sesión...");
                    await obtenerSesion(); 
                }
                
                // Esperamos a que session se actualice antes de continuar
                if (!session?.rol_id) {
                    console.error("⚠️ No se encontró la persona en la sesión.");
                    return;
                }

                const personaId = session.rol_id;
                const resp = await obtenerRoles();

                if (resp.success) {
                    const opciones = resp.roles
                        .filter((rol: any) => {
                            if (personaId === 1) return rol.rol_id === 2;
                            if (personaId === 2) return rol.rol_id === 3;
                            if (personaId === 3) return [4,5,6,7].includes(rol.rol_id);

                            return true;
                        })
                        .map((rol: any) => ({
                            value: rol.rol_id,
                            label: rol.rol_nombre,
                        }));

                    setRoles(opciones);
                } else {
                    console.error("❌ Error al obtener roles:", resp.message);
                }
            } catch (error) {
                console.error("❌ Error en la carga de roles:", error);
            }
        };

        // Solo ejecutamos cargaRoles si session ya está definido
        if (session?.rol_id) {
            cargaRoles();
        } else {
            obtenerSesion().then(() => cargaRoles());
        }
    }, [session, obtenerRoles, obtenerSesion]);

    /** Maneja los cambios en los checkboxes */
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        let updatedRoles = checked
            ? [...selectedRoles, value]
            : selectedRoles.filter((role) => role !== value);

        setSelectedRoles(updatedRoles);

        // Llamar `onChange` con los roles seleccionados
        if (props.onChange) {
            props.onChange(updatedRoles);
        }
    };

    return (
        <div className="">
            <label>{props.label}</label>
            <div className="checkbox-group">
                {roles.map((rol) => (
                    <label key={rol.value} className="checkbox-label">
                        <input
                            type="checkbox"
                            name={props.name}
                            value={rol.value}
                            checked={selectedRoles.includes(String(rol.value))}
                            onChange={handleCheckboxChange} // Llama a la función al cambiar
                        />
                        {rol.label}
                    </label>
                ))}
            </div>
        </div>
    );
};
