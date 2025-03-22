import React, { useEffect, useState } from "react";
import { SideBarComponent } from "../../components";
import { PInformation } from "../layout";
import { useAcudiente, usePaciente, useSession } from "../../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { ModalEditarPaciente } from "../components/Paciente/ModalEditarPaciente";
import { Tabs } from "../../components/Tabs/Tabs"; // ✅ Manteniendo Tabs para Enfermeros
import { CuidadosEnfermeriaPage } from "./CuidadosEnfermeriaPage";
import { SeguimientoPage } from "./SeguimientoPage";
import { RolPacienteSedePage } from "./RolPacienteSedePage";

export const PacienteEspecificoPage = () => {
    const { id } = useParams();
    const { obtenerDetallePacienteSede, } = usePaciente();
    const { obtenerAcudientesDePaciente } = useAcudiente();
    const [paciente, setPaciente] = useState({});
    const { session, obtenerSesion } = useSession();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showEditarPersona, setShowEditarPersona] = useState(false);

    useEffect(() => {
        obtenerSesion();
        const fetchPaciente = async () => {
            try {
                const response = await obtenerDetallePacienteSede(id);
                if (response.success) {
                    setPaciente(response.paciente);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener los datos del paciente.");
            }
        };
        fetchPaciente();
    }, [id]);

    // 📌 Manejar cambio de pestañas y redirección
    const handleTabChange = (index) => {
        if (!paciente?.per_id) return; // 📌 Evita errores si paciente aún no ha cargado

        if (index === 1) {
            navigate(`/geriatrico/cuidadosEnfermeria/${paciente?.per_id}`);
        } else if (index === 2) {
            navigate(`/geriatrico/seguimientos/${paciente?.per_id}`);
        } else if (index === 3) {
            navigate(`/geriatrico/rolPacienteSede/${paciente?.per_id}`);
        }
    };

    const handleAcudiente = async () => {
        if (!paciente?.pac_id) return;

        try {
            await obtenerAcudientesDePaciente(paciente.pac_id);
            navigate(`/geriatrico/acudiente/${paciente.pac_id}`);
        } catch (error) {
            console.error("❌ Error al obtener acudiente:", error);
            setError("Error al obtener el detalle del paciente.");
        }
    };


    // 📌 Configuración de Tabs SOLO para Enfermeros
    const tabs = [
        {
            title: "Información del Paciente",
            content: (
                <>
                    <h2>Información del Paciente</h2>
                    <div className="grid-4-columns">
                        {[
                            { label: "Nombre Completo", value: paciente?.nombre || "" },
                            { label: "Documento", value: paciente?.documento || "" },
                            { label: "Edad", value: paciente?.edad || "" },
                            { label: "Nombre EPS", value: paciente?.nombre_eps || "" },
                            { label: "Peso", value: paciente?.peso || "" },
                            { label: "Régimen EPS", value: paciente?.regimen_eps || "" },
                            { label: "Grupo Sanguíneo", value: paciente?.rh_grupo_sanguineo || "" },
                            { label: "Estatura", value: paciente?.talla || "" },
                            { label: "Talla de Camisa", value: paciente?.talla_camisa || "" },
                            { label: "Talla de Pantalón", value: paciente?.talla_pantalon || "" }
                        ].map((item, index) => (
                            <div key={index}>
                                <label>{item.label}</label>
                                <input className="input" type="text" value={item.value} readOnly />
                            </div>
                        ))}
                    </div>
                </>
            )
        },
        {
            title: "Gestión de Cuidados",
            content: <CuidadosEnfermeriaPage /> // 📌 Se redirige automáticamente
        },
        {
            title: "Seguimientos",
            content: <SeguimientoPage /> // 📌 Se redirige automáticament
        },
        {
            title: "Historia Roles",
            content: <RolPacienteSedePage /> // 📌 Se redirige automáticamente
        },
    ];

    return (
        <div>
            <div className="main-container">
                <SideBarComponent />
                <div className="content">
                    <PInformation persona={paciente} onEdit={handleAcudiente} />
                    <div className="animate__animated animate__fadeInUp">
                        <div className="info-card">
                            <div className="button-container">
                                {session?.rol_id === 3 && (
                                    <button className="gestionar-btn" onClick={() => setShowEditarPersona(true)}>
                                        Editar
                                    </button>
                                )}
                            </div>
                            {/* 📌 Si es ADMIN SEDE (rol_id === 3), mostramos los datos sin Tabs */}
                            {session?.rol_id === 3 ? (
                                <>
                                    <h2 className="gestionar-title">Información del Paciente</h2>
                                    <div className="grid-4-columns">
                                        {[
                                            { label: "Nombre Completo", value: paciente?.nombre || "" },
                                            { label: "Documento", value: paciente?.documento || "" },
                                            { label: "Edad", value: paciente?.edad || "" },
                                            { label: "Nombre EPS", value: paciente?.nombre_eps || "" },
                                            { label: "Peso", value: paciente?.peso || "" },
                                            { label: "Régimen EPS", value: paciente?.regimen_eps || "" },
                                            { label: "Grupo Sanguíneo", value: paciente?.rh_grupo_sanguineo || "" },
                                            { label: "Estatura", value: paciente?.talla || "" },
                                            { label: "Talla de Camisa", value: paciente?.talla_camisa || "" },
                                            { label: "Talla de Pantalón", value: paciente?.talla_pantalon || "" }
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <label>{item.label}</label>
                                                <input className="input" type="text" value={item.value} readOnly />
                                            </div>
                                        ))}
                                    </div>

                                </>

                            ) : (
                                // 📌 Si es ENFERMERO (rol_id === 5), mostramos los Tabs
                                <Tabs tabs={tabs} activeTab={0} onClick={handleTabChange} />
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {showEditarPersona && (
                <ModalEditarPaciente paciente={paciente} cerrarModal={() => setShowEditarPersona(false)} />
            )}
        </div>
    );
};
