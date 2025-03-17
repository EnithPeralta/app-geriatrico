import React, { useEffect, useState } from 'react';
import { SelectSedeProps } from './types';
import { useSede } from '../../hooks';

export const SelectSede = ({ label, ...props }: SelectSedeProps) => {
    const {obtenerSedesGeriatrico} = useSede();
    const [sedes, setSedes] = useState<Array<{ value: string; label: string }>>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSedes = async () => {
            try {
                const result = await obtenerSedesGeriatrico();
                console.log(result);
                if (result.success) {
                    const opciones = result.sedes.map((sede) => ({
                        value: sede.se_id,
                        label: sede.se_nombre

                    }));
                    setSedes(opciones);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError('Error al obtener los sedes');
            }
        };

        fetchSedes();
    }, []);

    return (
        <div className="dropdown-button-geriatrico">
            <label>{label}</label>
            <select
                className="select-geriatrico"
                name={props.name}
                value={props.value || ""}
                onChange={props.onChange}
            >
                <option hidden>Seleccione Sedes</option>
                {error ? (
                    <option value="" disabled>{`Error: ${error}`}</option>
                ) : (
                    sedes.map((sede) => (
                        <option key={sede.value} value={sede.value}>
                            {sede.label}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};
