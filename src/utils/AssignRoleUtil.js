import { useState } from 'react';
import Swal from 'sweetalert2';
import { useGeriatricoPersonaRol } from '../hooks';

export const AssignRoleUtil = () => {
    const { asignarRolGeriatrico } = useGeriatricoPersonaRol();
    const [assigning, setAssigning] = useState(false)
    const [selectedGeriatrico, setSelectedGeriatrico] = useState(null);

    const handleAssignRole = async (per_id, ge_id, rol_id, gp_fecha_inicio, gp_fecha_fin) => {
        if (!per_id, ge_id, rol_id, gp_fecha_inicio, gp_fecha_fin) {
            Swal.fire({
                icon: 'error',
                text: 'Debe seleccionar un geriátrico, al menos un rol y una fecha de inicio.',
            })
            return;
        }

        setAssigning(true);
        try {
            for (let rol_id of selectedRoles) {
                const response = await asignarRolGeriatrico({
                    per_id,
                    ge_id: Number(selectedGeriatrico),
                    rol_id,
                    gp_fecha_inicio,
                    gp_fecha_fin
                });

                if (!response.success) {
                    console.error("Error al asignar rol:", response.message);
                    Swal.fire({
                        icon: 'error',
                        text: response.message,
                    })
                    setAssigning(false);
                    return;
                }
            }

            Swal.fire({
                icon: 'success',
                text: response.message,
            })
        } catch (error) {
            console.error("Error en la asignación del rol:", error);
            Swal.fire({
                icon: 'error',
                text: 'Error al asignar el rol',
            })
        }
    };

    return {
        handleAssignRole,
    }
}
