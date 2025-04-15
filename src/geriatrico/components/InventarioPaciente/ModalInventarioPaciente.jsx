import React, { useEffect, useState } from 'react';
import { useInventarioPaciente, useInventarioSede } from '../../../hooks';
import Swal from 'sweetalert2';
import Select from 'react-select';


export const ModalInventarioPaciente = ({ onClose, pac_id }) => {
    const { vincularMedicamentoInvPac } = useInventarioPaciente();
    const { obtenerMedicamentosSede } = useInventarioSede();

    const [medicamentosGenerales, setMedicamentosGenerales] = useState([]);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState('');
    const [presentacion, setPresentacion] = useState('');
    const [totalUnidades, setTotalUnidades] = useState('');
    const [medicamentos, setMedicamentos] = useState([]);
    const [detalleMedicamento, setDetalleMedicamento] = useState(null);


    useEffect(() => {
        const fetchMedicamentos = async () => {
            const response = await obtenerMedicamentosSede();
            if (response.success) {
                setMedicamentosGenerales(response.data);
            } else {
                Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error');
            }
        };
        fetchMedicamentos();
    }, []);


    const opciones = medicamentosGenerales.map((med) => ({
        value: med.med_id,
        label: med.med_nombre,
        presentacion: med.med_presentacion?.charAt(0).toUpperCase() + med.med_presentacion?.slice(1).toLowerCase(),
        nombre: med.med_nombre,
        unidad: med.unidades_por_presentacion,
        // tipo: med.med_tipo_contenido?.charAt(0).toUpperCase() + med.med_tipo_contenido?.slice(1).toLowerCase()
    }));

    const handleChange = (opcion) => {
        setMedicamentoSeleccionado(opcion.value);
        setDetalleMedicamento({
            presentacion: opcion.presentacion,
            nombre: opcion.nombre,
            unidad: opcion.unidad,
            // tipo: opcion.tipo
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!medicamentoSeleccionado || !presentacion || !totalUnidades) {
            return Swal.fire('Campos incompletos', 'Por favor completa todos los campos', 'warning');
        }

        try {
            const response = await vincularMedicamentoInvPac({
                med_id: Number(medicamentoSeleccionado),
                pac_id: Number(pac_id),
                cantidad: parseInt(totalUnidades),
                med_origen: presentacion
            });

            if (response.success) {
                setMedicamentos(prev => [...prev, response.inventario]);
                Swal.fire({
                    icon: 'success',
                    text: response.message
                });
                onClose();
            } else {
                Swal.fire('Error', response.message || 'Ocurrió un error al guardar', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <h3>Agregar medicamento al paciente</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-field">
                            <label>Medicamento:</label>
                            <Select
                                options={opciones}
                                onChange={handleChange}
                                placeholder="Buscar medicamento..."
                            />

                            {detalleMedicamento && (
                                <>
                                    <label>Presentación</label>
                                    <input
                                        type="text"
                                        name="med_nombre"
                                        value={detalleMedicamento.presentacion}
                                        readOnly
                                    />
                                    <label>Nombre del medicamento:</label>
                                    <input
                                        type="text"
                                        name="med_nombre"
                                        value={detalleMedicamento.nombre}
                                        readOnly
                                    />
                                    <label>Unidad de presentación:</label>
                                    <input
                                        type="text"
                                        name="med_nombre"
                                        value={detalleMedicamento.unidad}
                                        readOnly
                                    />
                                    {/* 
                                    <label>Tipo de contenido:</label>
                                    <input
                                        type="text"
                                        name="med_nombre"
                                        value={detalleMedicamento.tipo}
                                        readOnly
                                    />
                                    */}

                                </>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>Origen del medicamento:</label>
                            <select
                                name="presentacion"
                                value={presentacion}
                                onChange={(e) => setPresentacion(e.target.value)}
                            >
                                <option value="" hidden>Seleccionar</option>
                                <option value="EPS">EPS</option>
                                <option value="Compra Directa">Compra Directa</option>
                                <option value="Donación">Donación</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>Total de unidades:</label>
                            <input
                                type="number"
                                min="1"
                                value={totalUnidades}
                                onChange={(e) => setTotalUnidades(e.target.value)}
                            />
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="save-button">Guardar</button>
                            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
