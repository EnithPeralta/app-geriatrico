import Swal from "sweetalert2";
import { useDetalleAdministracionMedicamento, useForm } from "../../../../hooks";

const FormulacionFields = {
    origen_inventario: '',
    detalle_hora: '',
    detalle_observaciones: ''
};

export const ModalRegisterFormula = ({ admin_id, onClose, setFormulaciones }) => {
    const { registrarAdministracionDosis } = useDetalleAdministracionMedicamento();

    const {
        formState,
        onInputChange,
        onResetForm
    } = useForm(FormulacionFields);

    const {
        origen_inventario,
        detalle_hora,
        detalle_observaciones
    } = formState;

    const handleAdministracionDosis = async (e) => {
        e.preventDefault();

        if (!origen_inventario || !detalle_hora || !detalle_observaciones.trim()) {
            Swal.fire({
                icon: 'warning',
                text: 'Todos los campos son obligatorios.'
            });
            return;
        }
        console.log(origen_inventario, detalle_hora, detalle_observaciones);

        const result = await registrarAdministracionDosis(admin_id, {
            origen_inventario,
            detalle_hora,
            detalle_observaciones: detalle_observaciones.trim()
        });

        if (result.success) {
            Swal.fire({
                icon: 'success',
                text: result.message || "Administración registrada con éxito"
            });
            setFormulaciones(prev => Array.isArray(prev) ? [...prev, result.data] : [result.data]);
            onResetForm();
            onClose();
        } else {
            Swal.fire({
                icon: 'error',
                text: result.message || "Ocurrió un error al registrar la administración"
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="h4">Registrar Formulación</h2>
                    </div>
                    <form onSubmit={handleAdministracionDosis}>
                        <div className="modal-field">
                            <label htmlFor="origen_inventario">Origen Inventario:</label>
                            <select
                                id="origen_inventario"
                                name="origen_inventario"
                                value={origen_inventario}
                                onChange={onInputChange}
                                required
                            >
                                <option value="" hidden>Seleccione...</option>
                                <option value="sede">Sede</option>
                                <option value="paciente">Paciente</option>
                            </select>
                        </div>

                        <div className="modal-field">
                            <label htmlFor="detalle_hora">Detalle Hora:</label>
                            <input
                                type="time"
                                id="detalle_hora"
                                name="detalle_hora"
                                value={detalle_hora}
                                onChange={onInputChange}
                                required
                            />
                        </div>

                        <div className="modal-field">
                            <label htmlFor="detalle_observaciones">Detalle Observaciones:</label>
                            <input
                                type="text"
                                id="detalle_observaciones"
                                name="detalle_observaciones"
                                value={detalle_observaciones}
                                onChange={onInputChange}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="save-button">Registrar</button>
                            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
