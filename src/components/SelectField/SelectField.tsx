import React ,{ useEffect, useState } from "react";
import { useRoles, useSession } from "../../hooks";

export const SelectField = ({ label, name, value, onChange }) => {
    const { obtenerRoles } = useRoles();
    const { session, obtenerSesion } = useSession();
    const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
    
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
                    let opciones = resp.roles
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

                    // Si el usuario NO es Super Administrador (ID "0"), ocultar "Administrador de Geriátrico"
                    setRoles(opciones);
                } else {
                    console.error("❌ Error al obtener roles:", resp.message);
                }
            } catch (error) {
                console.error("❌ Error en la carga de roles:", error);
            }
        };
        if (session?.rol_id) {
            cargaRoles();
        } else {
            obtenerSesion().then(() => cargaRoles());
        }
    }, [session, obtenerRoles, obtenerSesion]);


    return (
        <div className="input-container-register">
            <label>{label}</label>
            <select
                className="input-wrapper"
                name={name}
                value={Array.isArray(value) ? value[0] : value || ""} // Garantiza un valor escalar
                onChange={onChange}
            >
                <option value="" hidden>Seleccione un rol</option>
                {roles.map((rol) => (
                    <option key={rol.value} value={rol.value}>
                        {rol.label}
                    </option>
                ))}
            </select>
        </div>
    );
};