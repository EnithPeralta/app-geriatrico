import React, { useEffect, useState } from 'react';
import { useForm, useFormulacionMedicamentos, useMedicamento } from '../../../hooks';
import Select from 'react-select';
import Swal from 'sweetalert2';

const FormulacionFields = {
    admin_fecha_inicio: '',
    admin_fecha_fin: '',
    admin_dosis_por_toma: '',
    admin_tipo_cantidad: '',
    admin_hora: '',
    admin_metodo: ''
};

export const ModalFormulacion = ({ pac_id, onClose }) => {
    const { obtenerMedicamentos } = useMedicamento();
    const { registrarFormulacionMedicamento } = useFormulacionMedicamentos();

    const [medicamentosGenerales, setMedicamentosGenerales] = useState([]);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [detalleMedicamento, setDetalleMedicamento] = useState(null);

    const {
        formState,
        onInputChange,
        onResetForm
    } = useForm(FormulacionFields);

    const {
        admin_fecha_inicio,
        admin_fecha_fin,
        admin_dosis_por_toma,
        admin_tipo_cantidad,
        admin_hora,
        admin_metodo
    } = formState;

    useEffect(() => {
        const fetchMedicamentos = async () => {
            const response = await obtenerMedicamentos();
            if (response.success) {
                setMedicamentosGenerales(response.data);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'No se pudieron cargar los medicamentos',
                });
            }
        };
        fetchMedicamentos();
    }, []);

    const opciones = medicamentosGenerales.map((med) => ({
        value: med.med_id,
        label: med.med_nombre,
        presentacion: med.med_presentacion,
        nombre: med.med_nombre,
        unidad: med.unidades_por_presentacion,
    }));

    const handleChange = (opcion) => {
        setMedicamentoSeleccionado(opcion.value);
        setDetalleMedicamento({
            presentacion: opcion.presentacion,
            nombre: opcion.nombre,
            unidad: opcion.unidad,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!medicamentoSeleccionado) {
            return Swal.fire({ icon: 'warning', text: 'Selecciona un medicamento' });
        }

        if (!admin_fecha_inicio || !admin_fecha_fin || !admin_dosis_por_toma || !admin_tipo_cantidad || !admin_hora || !admin_metodo) {
            return Swal.fire({ icon: 'warning', text: 'Completa todos los campos del formulario' });
        }

        const result = await registrarFormulacionMedicamento({
            pac_id,
            med_id: medicamentoSeleccionado,
            ...formState
        });

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Formulación registrada',
                text: result.message
            });
            onResetForm();
            setMedicamentoSeleccionado(null);
            setDetalleMedicamento(null);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <h4 className="h4">Formulación Médica</h4>

                        <div className="modal-field">
                            <label>Medicamento:</label>
                            <Select
                                options={opciones}
                                onChange={handleChange}
                                value={opciones.find(op => op.value === medicamentoSeleccionado) || null}
                            />
                        </div>

                        {detalleMedicamento && (
                            <>
                                <div className="modal-field">
                                    <label>Presentación</label>
                                    <input type="text" value={detalleMedicamento.presentacion} readOnly />
                                </div>
                                <div className="modal-field">
                                    <label>Nombre del medicamento:</label>
                                    <input type="text" value={detalleMedicamento.nombre} readOnly />
                                </div>
                                <div className="modal-field">
                                    <label>Unidad de presentación:</label>
                                    <input type="text" value={detalleMedicamento.unidad} readOnly />
                                </div>
                            </>
                        )}

                        <div className="modal-field">
                            <label>Fecha de inicio:</label>
                            <input
                                type="date"
                                name="admin_fecha_inicio"
                                value={admin_fecha_inicio}
                                onChange={onInputChange}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Fecha de fin:</label>
                            <input
                                type="date"
                                name="admin_fecha_fin"
                                value={admin_fecha_fin}
                                onChange={onInputChange}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Dosis por toma:</label>
                            <input
                                type="text"
                                name="admin_dosis_por_toma"
                                value={admin_dosis_por_toma}
                                onChange={onInputChange}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Tipo de cantidad:</label>
                            <select
                                name="admin_tipo_cantidad"
                                value={admin_tipo_cantidad}
                                onChange={onInputChange}
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
                            <label>Hora de administración:</label>
                            <input
                                type="time"
                                name="admin_hora"
                                value={admin_hora}
                                onChange={onInputChange}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Método de administración:</label>
                            <select
                                name="admin_metodo"
                                value={admin_metodo}
                                onChange={onInputChange}
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
