import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const ModalEnfermera = ({ datosInicial, onRegistrar, onClose, selectedRoles }) => {
    const { asignarRolesSede } = useSedesRol();
    const [datosEnfermera, setDatosEnfermera] = useState({
        per_id: datosInicial?.per_id || '',
        enf_codigo: datosInicial?.enf_codigo || '',
        rol_id: selectedRoles?.[0] || null,
        sp_fecha_inicio: datosInicial?.sp_fecha_inicio || '',
        sp_fecha_fin: datosInicial?.sp_fecha_fin || ''
    });

    useEffect(() => {
        setDatosEnfermera((prev) => ({
            ...prev,
            ...datosInicial,
            rol_id: selectedRoles?.[0] || prev.rol_id
        }));
    }, [datosInicial, selectedRoles]);

    const handleChange = (e) => {
        setDatosEnfermera((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAssignSedes = async (per_id, rol_id, sp_fecha_inicio, sp_fecha_fin) => {
        try {
            if (!per_id || !rol_id || !sp_fecha_inicio || !sp_fecha_fin) {
                console.warn("❌ Datos incompletos para la asignación del rol.");
                await Swal.fire({
                    icon: "warning",
                    text: "Por favor, complete todos los campos antes de asignar el rol."
                });
                return false;
            }

            const response = await asignarRolesSede({
                per_id, rol_id, sp_fecha_inicio, sp_fecha_fin
            });

            if (response?.success) {
                console.log("✅ Rol asignado con éxito:", response.message);
                return true;
            } else {
                console.warn("⚠️ Error en la asignación del rol:", response?.message || "Error desconocido.");
                await Swal.fire({
                    icon: "error",
                    text: response?.message || "Hubo un problema al asignar el rol."
                });
                return false;
            }
        } catch (error) {
            console.error("❌ Error inesperado al asignar el rol:", error);
            await Swal.fire({
                icon: "error",
                text: error?.message || "Ocurrió un error inesperado. Inténtelo nuevamente."
            });
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!datosEnfermera.per_id) {
            return Swal.fire({ icon: 'warning', text: "⚠️ No se ha seleccionado una persona válida." });
        }

        // Primero, asignar el rol
        const asignacionExitosa = await handleAssignSedes(
            datosEnfermera.per_id, 
            selectedRoles?.[0], 
            datosEnfermera.sp_fecha_inicio, 
            datosEnfermera.sp_fecha_fin
        );

        if (!asignacionExitosa) {
            return Swal.fire({ icon: 'error', text: 'No se pudo asignar el rol. Registro cancelado.' });
        }

        // Luego, registrar los datos de la enfermera
        onRegistrar({ ...datosEnfermera, rol_id: selectedRoles?.[0] || null });
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-field">
                        <label>Código</label>
                        <input
                            type="text"
                            name="enf_codigo"
                            className="modal-input"
                            value={datosEnfermera.enf_codigo}
                            onChange={handleChange}
                            placeholder="Ingrese el código de la enfermera"
                            required
                        />
                    </div>
                    <div className="modal-field">
                        <label>Fecha inicio</label>
                        <input
                            type="date"
                            name="sp_fecha_inicio"
                            className="modal-input"
                            value={datosEnfermera.sp_fecha_inicio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-field">
                        <label>Fecha fin</label>
                        <input
                            type="date"
                            name="sp_fecha_fin"
                            className="modal-input"
                            value={datosEnfermera.sp_fecha_fin}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="button" className="create" onClick={handleSubmit}>
                        Registrar Enfermera
                    </button>
                    <button type="button" className="cancel" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
