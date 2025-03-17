import React, { useEffect, useState } from 'react';
import { useAcudiente, usePaciente, useSeguimiento } from '../../hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingComponet, SideBarComponent } from '../../components';
import { PInformation } from '../layout';
import { FaEdit, FaUser } from 'react-icons/fa';
import { ModalActualizarSeguimiento } from '../components/Seguimiento/ModalActualizarSeguimiento';

export const HistorySeguimientoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { obtenerDetallePacienteSede } = usePaciente();
    const { obtenerAcudientesDePaciente } = useAcudiente();
    const { obtenerHistorialSeguimientos } = useSeguimiento();
    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);
    const [historialSeguimiento, setHistorialSeguimiento] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);


    // Obtener datos del paciente
    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await obtenerDetallePacienteSede(id);
                console.log("📌 Respuesta de la API - Paciente:", response);

                if (response.success) {
                    setPaciente(response.paciente);
                    console.log("✅ Paciente guardado en estado:", response.paciente);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error("❌ Error al obtener datos del paciente:", err);
                setError("Error al obtener los datos del paciente.");
            }
        };

        fetchPaciente();
    }, []);


    // Obtener historial de seguimientos cuando el paciente está disponible
    useEffect(() => {
        if (!paciente || !paciente.pac_id) return; // Validación para evitar ejecuciones innecesarias

        const fetchSeguimiento = async () => {
            try {
                const pacId = Number(paciente.pac_id);
                if (isNaN(pacId)) {
                    console.error("❌ pac_id no es un número válido");
                    return;
                }

                console.log("📌 pac_id:", pacId);

                const result = await obtenerHistorialSeguimientos(pacId);
                console.log("📌 Respuesta del servidor - Seguimientos:", result);

                if (result.success) {
                    setHistorialSeguimiento(result.data);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                console.error("❌ Error al obtener historial de seguimientos:", error);
                setError("Error al obtener el historial de seguimientos.");
            }
        };

        fetchSeguimiento();
    }, [paciente]);

    const filteredHistorial = historialSeguimiento.filter((seguimiento) => {
        const fecha = new Date(seguimiento.seg_fecha);
        const dia = fecha.getDate().toString();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Mes en formato "MM"
        const año = fecha.getFullYear().toString();
        const fechaCompleta = fecha.toISOString().split("T")[0]; // Formato YYYY-MM-DD

        return (
            dia.includes(searchTerm) || // Busca por día
            mes.includes(searchTerm) || // Busca por mes
            año.includes(searchTerm) || // Busca por año
            fechaCompleta.includes(searchTerm) // Busca por fecha completa
        );
    });

    // Manejo de acudiente
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


    const handleEdit = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };



    return (
        <div className='animate__animated animate__fadeIn animate__faster'>
            <div className='main-container'>
                <SideBarComponent />
                <div className='content'>
                    <PInformation persona={paciente} onEdit={handleAcudiente} />
                    <div className='gestionar'>
                        <h2 className='h2'>Historial de Seguimientos</h2>
                        <input
                            type="text"
                            placeholder="Buscar por día, mes, año o fecha completa"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-seguimiento"
                        />
                    </div>
                    {filteredHistorial.length > 0 ? (
                        filteredHistorial.map((seguimiento, index) => (
                            <div key={index} className="history-day">
                                <div className="history-date">{seguimiento.seg_fecha}</div>
                                <div className='history-card'>
                                    <div>
                                        {seguimiento.seg_foto ? (
                                            <img src={seguimiento.seg_foto} alt="Foto de usuario" className="profile-icon" />
                                        ) : (
                                            <div className="profile-icon">
                                                <FaUser size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="segimiento-item">
                                        <label>Glicemia</label>
                                        <input
                                            type="text"
                                            value={seguimiento.seg_glicemia}
                                            readOnly
                                        />
                                    </div>
                                    <div className="segimiento-item">
                                        <label>Peso</label>
                                        <input
                                            type="text"
                                            value={seguimiento.seg_peso}
                                            readOnly
                                        />
                                    </div>
                                    <div className="segimiento-item">
                                        <label>Talla</label>
                                        <input
                                            type="text"
                                            value={seguimiento.seg_talla}
                                            readOnly
                                        />
                                    </div>
                                    <div className="segimiento-item">
                                        <label>Temperatura</label>
                                        <input
                                            type="text"
                                            value={seguimiento.seg_temp}
                                            readOnly
                                        />
                                    </div>
                                    <div className="segimiento-item">
                                        <label>Otro</label>
                                        <input
                                            type="text"
                                            value={seguimiento.otro}
                                            readOnly
                                        />
                                    </div>
                                    <div className='button-container'>
                                        <button className='save-button' onClick={() => handleEdit(seguimiento.seg_id)}>
                                            <FaEdit />
                                        </button>


                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <LoadingComponet />
                    )}
                </div>
                {showModal &&
                    <ModalActualizarSeguimiento
                        id={selectedId}
                        setShowModal={setShowModal}
                    />}
            </div>
        </div>
    );
};