import { useEffect, useState } from "react";
import { SideBarComponent } from "../../components/SidebarComponet"
import { usePersona } from "../../hooks";
import { PInformation } from "../layout"
import '../../css/profile.css'
import { ModalUpdateProfile } from "../../components/ModalUpdateProfile";

export const ProfilePage = () => {
    const { getAuthenticatedPersona, updatePerfil } = usePersona();
    const [persona, setPersona] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editedPersona, setEditedPersona] = useState(null);

    useEffect(() => {
        let isMounted = true; // Evita cambios en estado si el componente se desmonta

        const fetchPersona = async () => {
            try {
                const result = await getAuthenticatedPersona();
                console.log(result);
                if (isMounted) {
                    setPersona(result.success ? result.persona : null);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error.message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPersona();
        return () => {
            isMounted = false; // Evita que el estado se actualice en un componente desmontado
        };
    }, []);

    const handleEdit = () => {
        setEditedPersona(persona);
        setShowModal(true);
    };
    return (
        <div className="main-container">
            <SideBarComponent />
            <div className="content">
                <PInformation persona={persona} onEdit={handleEdit}/>
                <div className="animate__animated animate__fadeInUp">
                    <div className="info-card">
                        <h2 className="h4">Información Personal</h2>
                        <div className="grid-4-columns">
                            <div>
                                <label>Nombre Completo</label>
                                <input className='input' type="text" value={persona?.nombre || ""} readOnly />
                            </div>
                            <div>
                                <label>Usuario</label>
                                <input className='input' type="text" value={persona?.usuario || ""} readOnly />
                            </div>
                            <div>
                                <label>Documento</label>
                                <input className='input' type="text" value={persona?.documento || ""} readOnly />
                            </div>
                            <div>
                                <label>Genero</label>
                                <input className='input' type="text" value={persona?.genero || ""} readOnly />
                            </div>
                            <div>
                                <label>Correo Electrónico</label>
                                <input className='input' type="text" value={persona?.correo || ""} readOnly />
                            </div>
                            <div>
                                <label>Teléfono</label>
                                <input className='input' type="text" value={persona?.telefono || ""} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalUpdateProfile
                persona={editedPersona}
                updatePersona={updatePerfil}
                setPersona={setPersona}
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </div>
    )
}
