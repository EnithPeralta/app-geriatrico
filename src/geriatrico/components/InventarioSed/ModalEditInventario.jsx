import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useInventarioSede } from '../../../hooks';

export const ModalEditInventario = ({ onClose, med_sede_id, setMedicamentos, medicamento , med_total_unidades_disponibles}) => {
    const { actualizarMedicamento } = useInventarioSede();

    // Estado local para manejar el medicamento editable
    const [medicamentoEditado, setMedicamentoEditado] = useState(medicamento || {});

    useEffect(() => {
        setMedicamentoEditado(medicamento || {}); // Sincroniza el estado cuando se selecciona un nuevo medicamento
    }, [medicamento]);

    const handleChange = (e) => {
        setMedicamentoEditado(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    
    const handleEditarMedicamento = async (e) => {
        e.preventDefault();
        try {
            const response = await actualizarMedicamento(med_sede_id, medicamentoEditado);

            Swal.fire({
                icon: 'success',
                text: response.message
            });

            setMedicamentos(prevMedicamentos =>
                prevMedicamentos.map(med =>
                    med.med_sede_id === med_sede_id
                        ? { ...med, med_total_unidades_disponibles }
                        : med
                )
            );
            onClose(); // Cierra el modal

        } catch (error) {
            console.error("Error al actualizar medicamento:", error);
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al actualizar el medicamento'
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleEditarMedicamento}>
                        <h2>Editar Medicamento</h2>
                        <div className="modal-field">
                            <label>Nombre:</label>
                            <input type="text"
                                name="med_nombre"
                                value={medicamentoEditado?.med_nombre || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Presentación:</label>
                            <input
                                type="text"
                                name="med_presentacion"
                                value={medicamentoEditado?.med_presentacion || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Unidades por Presentación:</label>
                            <input
                                type="number"
                                name="unidades_por_presentacion"
                                value={medicamentoEditado?.unidades_por_presentacion || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Descripción:</label>
                            <textarea
                                rows="5"
                                cols="30"
                                name="med_descripcion"
                                value={medicamentoEditado?.med_descripcion || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="create">
                                Guardar
                            </button>
                            <button type="button" className="cancel" onClick={onClose} >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};