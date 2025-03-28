import React, { useEffect, useState } from 'react'
import { useRoles } from '../../hooks';
import '../../css/roles.css';
import { GoBackComponet } from '../../components/GoBackComponent';
import { ModalCrearRol } from '../components/Modal-Rol/ModalCrearRol';
import { ModalEditarRol } from '../components/Modal-Rol/ModalEditarRol';

export const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const { obtenerRoles, crearRol, actualizarRol } = useRoles();
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRol, setSelectedRol] = useState(null);

    useEffect(() => {
        const cargaRoles = async () => {
            try {
                const result = await obtenerRoles();
                if (result.success) {
                    setRoles(result.roles);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError("Error en la carga de roles");
                console.error(error);
            }
        };
        cargaRoles();
    }, []);

    const handleSaveRol = async (nuevoRol) => {
        const result = await crearRol(nuevoRol);
        if (result.success) {
            setRoles(prev =>[...prev, result.rol]);
            setIsCreateModalOpen(false);
        }
        return result;
    };

    const handleUpdateRol = async (rolActualizado) => {
        const result = await actualizarRol(rolActualizado);
        if (result.success) {
            setRoles(
                roles.map((rol) => (rol.rol_id === rolActualizado.rol_id ? result.rol : rol))
            );
        }
        return result;
    };

    return (
        <div className="container-rol">
            <GoBackComponet />
            <div className="animate__animated animate__fadeInDown">
                <div className="content-rol">
                    <div className="grid-rol">
                        {roles.length > 0 ? (
                            roles.map((rol) => (
                                <div key={rol.rol_id} className="card-rol">
                                    <div className="rol-info">
                                        <span className="rol-name">{rol.rol_nombre}</span>
                                        <span className="rol-description">{rol.rol_descripcion}</span>
                                    </div>
                                    <div className="actions-rol">
                                        <button
                                            onClick={() => {
                                                setSelectedRol(rol);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <i className="fas fa-edit" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-roles-message">No hay roles disponibles.</p>
                        )}
                        <div className="card-rol" onClick={() => setIsCreateModalOpen(true)}>
                            <div className="rol-info-container">
                                <i className="fas fa-plus" />
                                <p>Agregar Rol</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal para crear un nuevo rol */}
            <ModalCrearRol
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSaveRol}
            />
            {/* Modal para editar un rol existente */}
            <ModalEditarRol
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                rol={selectedRol}
                onUpdate={handleUpdateRol}
            />
        </div>
    )
}
