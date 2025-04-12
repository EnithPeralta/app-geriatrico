import React, { useEffect, useState } from 'react';
import { useInventarioSede, useMedicamento } from '../../../hooks';
import Swal from 'sweetalert2';
import Select from 'react-select';

export const ModalInventarioSede = ({ onClose, setMedicamentos }) => {
    const [medicamentosGenerales, setMedicamentosGenerales] = useState([]);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState('');
    const [presentacion, setPresentacion] = useState('');
    const [totalUnidades, setTotalUnidades] = useState('');
    const [detalleMedicamento, setDetalleMedicamento] = useState(null);


    const { obtenerMedicamentos } = useMedicamento();
    const { vincularMedicamentoInvSede } = useInventarioSede();

    useEffect(() => {
        const fetchMedicamentos = async () => {
            const response = await obtenerMedicamentos();
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

        if (!medicamentoSeleccionado || !presentacion || !totalUnidades) {
            return Swal.fire('Campos incompletos', 'Por favor completa todos los campos', 'warning');
        }

        try {
            const med_id = Number(medicamentoSeleccionado);
            const cantidad = parseInt(totalUnidades);
            const med_origen = presentacion;

            const response = await vincularMedicamentoInvSede(med_id, cantidad, med_origen);
            console.log(response);

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    text: response.message
                });
                setMedicamentos(prev => [...prev, response.inventario]);
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
                    <h3>Agregar Medicamento al Inventario</h3>
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
                                    <div className='modal-fiel'>
                                        <label>Presentación</label>
                                        <input
                                            type="text"
                                            name="med_nombre"
                                            value={detalleMedicamento.presentacion}
                                            readOnly
                                        />
                                    </div>
                                    <div className='modal-field'>
                                        <label>Nombre del medicamento:</label>
                                        <input
                                            type="text"
                                            name="med_nombre"
                                            value={detalleMedicamento.nombre}
                                            readOnly
                                        />
                                    </div>
                                    <div className='modal-field'>
                                        <label>Unidad de presentación:</label>
                                        <input
                                            type="text"
                                            name="med_nombre"
                                            value={detalleMedicamento.unidad}
                                            readOnly
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-field">
                            <label>Origen del medicamento:</label>
                            <select name="presentacion" value={presentacion} onChange={(e) => setPresentacion(e.target.value)}>
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
