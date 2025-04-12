import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useFormulacionMedicamentos } from '../../../hooks';

export const ModalActualizarFormulacion = ({ formulacionSeleccionada, setFormulaciones, onClose, admin_id }) => {
    const { actualizarFormulacionPendiente } = useFormulacionMedicamentos();

    const [formData, setFormData] = useState({
        med_id: '',
        admin_fecha_inicio: '',
        admin_fecha_fin: '',
        admin_dosis_por_toma: '',
        admin_tipo_cantidad: '',
        admin_hora: '',
        admin_metodo: '',
        med_nombre: '',
        admin_estado: ''
    });

    useEffect(() => {
        if (formulacionSeleccionada) {
            setFormData({
                ...formulacionSeleccionada,
                med_id: formulacionSeleccionada.med_id,
                med_nombre: formulacionSeleccionada.medicamentos_formulados?.med_nombre || '',
                admin_estado: formulacionSeleccionada.admin_estado || ''
            });
        }
    }, [formulacionSeleccionada]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleActualizarFormulacion = async (e) => {
        e.preventDefault();
        const hoy = new Date().toISOString().split("T")[0];
        const horaFormateada = formData.admin_hora?.substring(0, 5);

        if (formData.admin_fecha_inicio < hoy) {
            Swal.fire({ icon: 'error', text: "La fecha de inicio no puede estar en el pasado." });
            return;
        }

        if (formData.admin_fecha_fin < formData.admin_fecha_inicio) {
            Swal.fire({ icon: 'error', text: "La fecha de fin no puede ser anterior a la de inicio." });
            return;
        }

        try {
            // Excluir admin_estado al enviar los datos
            const { admin_estado, ...dataToSend } = {
                ...formData,
                admin_hora: horaFormateada
            };

            const response = await actualizarFormulacionPendiente({
                admin_id,
                ...dataToSend,
            });

            if (response.success) {
                Swal.fire({ icon: 'success', text: response.message });

                setFormulaciones(response.data);

                onClose();
            } else {
                Swal.fire({ icon: 'error', text: response.message });
            }
        } catch (error) {
            console.error("Error al actualizar formulación:", error);
            Swal.fire({ icon: 'error', text: "Error inesperado. Intenta de nuevo." });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Actualizar Formulación</h2>
                    </div>

                    <form onSubmit={handleActualizarFormulacion}>
                        <div>
                            <div className="modal-field">
                                <label>Medicamento:</label>
                                <input type="text" value={formData.med_nombre} readOnly />
                            </div>

                            <input type="hidden" name="med_id" value={formData.med_id} />

                            {[
                                { label: 'Fecha Inicio', name: 'admin_fecha_inicio', type: 'date' },
                                { label: 'Fecha Fin', name: 'admin_fecha_fin', type: 'date' },
                                { label: 'Dosis por toma', name: 'admin_dosis_por_toma' },
                                { label: 'Hora', name: 'admin_hora', type: 'time' },
                            ].map(({ label, name, type = 'text' }) => (
                                <div className="modal-field" key={name}>
                                    <label>{label}:</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ))}

                            <div className="modal-field">
                                <label>Tipo de cantidad:</label>
                                <select
                                    name="admin_tipo_cantidad"
                                    value={formData.admin_tipo_cantidad}
                                    onChange={handleInputChange}
                                >
                                    <option value="" hidden>Seleccione</option>
                                    <option value="unidades">Unidades</option>
                                    <option value="mililitros">Mililitros</option>
                                    <option value="gramos">Gramos</option>
                                    <option value="gotas">Gotas</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div className="modal-field">
                                <label>Método de administración:</label>
                                <select
                                    name="admin_metodo"
                                    value={formData.admin_metodo}
                                    onChange={handleInputChange}
                                >
                                    <option value="" hidden>Seleccione</option>
                                    <option value="Oral">Oral</option>
                                    <option value="Intravenosa">Intravenosa</option>
                                    <option value="Subcutánea">Subcutánea</option>
                                    <option value="Tópica">Tópica</option>
                                    <option value="Inhalación">Inhalación</option>
                                    <option value="Rectal">Rectal</option>
                                    <option value="Ótica">Ótica</option>
                                    <option value="Oftálmica">Oftálmica</option>
                                    <option value="Nasal">Nasal</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-field">
                            <label>Estado:</label>
                            <input type="text" value={formData.admin_estado} readOnly />
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="save-button">Actualizar</button>
                            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
