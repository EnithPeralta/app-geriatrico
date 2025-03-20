import { useState } from 'react'
import { useForm, usePersona, useSession } from '../hooks';

const buscarDocument = {
    per_documento: ''
}

export const BuscarPersonaUtil = () => {
    const { obtenerSesion } = useSession();
    const { buscarVincularPersona } = usePersona();
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSelectRoles, setShowSelectRoles] = useState(false);


    const { per_documento } = useForm(buscarDocument);

    const buscarPersona = async () => {
        if (!per_documento.trim()) return;

        setLoading(true);
        try {
            const sesion = await obtenerSesion();
            const ge_id = sesion?.ge_id;

            const resultado = await buscarVincularPersona({ documento: per_documento, ge_id });
            console.log(resultado); // Para depuración

            if (resultado.success) {
                setSelectedPersona(resultado);

                Swal.fire({
                    icon: 'question',
                    text: resultado.message,
                    confirmButtonText: 'Aceptar',
                });

                // Esperamos a que el usuario seleccione un rol antes de mostrar el modal correcto
                setShowSelectRoles(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: resultado.message,
                });
            }
        } catch (error) {
            console.error("❌ Error al buscar la persona:", error);
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error al buscar la persona.',
            });
        }
    };

    return {
        buscarPersona
    }
}
