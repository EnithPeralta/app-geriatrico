import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore, useEnfermera, useForm, useGeriatricoPersonaRol, usePaciente, usePersona, useSedesRol, useSession } from '../../hooks';
import { CheckboxField, InputField, ModalEnfermera, ModalRegistrarPaciente, SelectField, SelectSede } from '../../components';
import { SelectGeriatrico } from '../../components/SelectGeriatrico/SelectGeriatrico';
import { ModalAdminSede } from '../../components/AsignarSede/ModalAdminSede';
import { ModalRegisterColaborador } from '../../geriatrico/components/Colaborador/ModalRegisterColaborador';
import { ModalColaborador } from '../../components/ModalColaborador/ModalColaborador';

const registerFormFields = {
    per_password: '',
    confirm_password: '',
    per_usuario: '',
    per_genero: '',
    per_telefono: '',
    per_nombre_completo: '',
    per_documento: '',
    per_correo: '',
    per_foto: ''
};

export const RegisterComponent = () => {
    const { startRegister, errorMessage } = useAuthStore();
    const { buscarVincularPersona } = usePersona();
    const { registrarPaciente } = usePaciente();
    const { obtenerSesion } = useSession();
    const { startRegisterEnfermera } = useEnfermera();
    const { asignarRolGeriatrico } = useGeriatricoPersonaRol();
    const { asignarRolesSede, asignarRolAdminSede } = useSedesRol();
    const [esSuperAdmin, setEsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [adminGeriátrico, setAdminGeriátrico] = useState(null);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedSedes, setSelectedSedes] = useState([]);
    const [showExtraFields, setShowExtraFields] = useState("");
    const fetchedRef = useRef(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalSede, setShowModalSede] = useState(false);
    const [showSelectRoles, setShowSelectRoles] = useState(false);
    const [showModalEnfermera, setShowModalEnfermera] = useState(false);
    const [showExtraAdminGeriaFields, setShowExtraAdminGeriaFields] = useState(false);
    const [showExtraAdminSedeFields, setShowExtraAdminSedeFields] = useState(false);
    const [showModalColaborador, setShowModalColaborador] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [fechaFin, setFechaFin] = useState("");
    const [selectedGeriatrico, setSelectedGeriatrico] = useState([]);



    useEffect(() => {
        if (!fetchedRef.current) {
            const fetchSesion = async () => {
                const sesion = await obtenerSesion();
                setEsSuperAdmin(sesion?.esSuperAdmin || false);
                setAdminGeriátrico(sesion?.rol_id == 2);
            };
            fetchSesion();
            fetchedRef.current = true;
        }
    }, [obtenerSesion]);

    const {
        per_password,
        confirm_password,
        per_usuario,
        per_genero,
        per_telefono,
        per_nombre_completo,
        per_documento,
        per_correo,
        per_foto,
        onInputChange,
        isPasswordVisible,
        rol_id,
        pac_edad,
        pac_peso,
        pac_talla,
        pac_regimen_eps,
        pac_nombre_eps,
        pac_rh_grupo_sanguineo,
        pac_talla_camisa,
        pac_talla_pantalon,
        enf_codigo,
        sp_fecha_inicio,
        sp_fecha_fin,
        ge_id,
        gp_fecha_inicio,
        gp_fecha_fin,
        togglePasswordVisibility,
        onResetForm
    } = useForm(registerFormFields);

    useEffect(() => {
        if (errorMessage) {
            Swal.fire({
                icon: 'error',
                text: errorMessage
            });
        }
    }, [errorMessage]);


    useEffect(() => {
        // showExtraFields se activa si el usuario elige el rol 3 (Admin Sede)
        setShowExtraFields(rol_id === 3 && !esSuperAdmin && !adminGeriátrico);
    }, [rol_id, esSuperAdmin, adminGeriátrico]);


    const buscarPersona = async () => {
        if (!per_documento.trim()) return;

        setLoading(true);
        try {
            const sesion = await obtenerSesion();
            const ge_id = sesion?.ge_id;

            const resultado = await buscarVincularPersona({ documento: per_documento, ge_id });
            console.log(resultado); // Para depuración

            if (resultado.success) {
                setSelectedPersona(resultado);

                Swal.fire({
                    icon: 'question',
                    text: resultado.message,
                    confirmButtonText: 'Aceptar',
                });

                // Esperamos a que el usuario seleccione un rol antes de mostrar el modal correcto
                setShowSelectRoles(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: resultado.message,
                });
            }
        } catch (error) {
            console.error("❌ Error al buscar la persona:", error);
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error al buscar la persona.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignSedes = async (per_id, rol_id, sp_fecha_inicio, sp_fecha_fin,) => {
        try {

            const response = await asignarRolesSede({
                per_id, rol_id, sp_fecha_inicio, sp_fecha_fin
            });

            if (response?.success) {
                Swal.fire({
                    icon: "success",
                    text: response?.message
                })
                return true;
            } else {
                console.warn("⚠️ Error en la asignación del rol:", response?.message || "Error desconocido.");
                await Swal.fire({
                    icon: "error",
                    text: response?.message || "Hubo un problema al asignar el rol."
                });
                return false;
            }
        } catch (error) {
            console.error("❌ Error inesperado al asignar el rol:", error);
            await Swal.fire({
                icon: "error",
                text: error?.message || "Ocurrió un error inesperado. Inténtelo nuevamente."
            });
            return false;
        }
    };

    const handleAssignRole = async (per_id, ge_id, rol_id, gp_fecha_inicio, gp_fecha_fin) => {

        setAssigning(true);
        try {
            const response = await asignarRolGeriatrico({
                per_id,
                ge_id: Number(ge_id),
                rol_id,
                gp_fecha_inicio,
                gp_fecha_fin
            });

            if (!response.success) {
                console.error("Error al asignar rol:", response.message);
                Swal.fire({
                    icon: 'error',
                    text: response.message,
                });
                setAssigning(false);
                return;
            }

            Swal.fire({
                icon: 'success',
                text: response.message || 'Rol asignado correctamente',
            });
        } catch (error) {
            console.error("Error en la asignación del rol:", error);
            Swal.fire({
                icon: 'error',
                text: 'Error al asignar el rol',
            });
        }
    };


    const handleAssignAdminSede = async (per_id, se_id, rol_id, sp_fecha_inicio, sp_fecha_fin) => {
        setAssigning(true);
        try {
            const response = await asignarRolAdminSede({
                per_id,
                se_id: Number(se_id),
                rol_id,
                sp_fecha_inicio,
                sp_fecha_fin: sp_fecha_fin || null,
            });

            console.log("Respuesta del servidor:", response);

            if (!response.success) {
                throw new Error(response.message);
            } else {
                await Swal.fire({
                    icon: "success",
                    text: response.message,
                });
            }

            // ✅ Mostrar el modal si el rol asignado es "Paciente"
            if (response.rolNombre === "Paciente") {
                Swal.fire({
                    icon: "success",
                    text: response.mensajeAdicional,
                });
                setShowModal(true);
            }

            onResetForm();

        } catch (error) {
            console.error("Error al asignar rol:", error);
            Swal.fire({
                icon: "error",
                text: error.message || "Error al asignar rol",
            });
        } finally {
            setAssigning(false);
        }
    };

    const handleAssignAdminSedeModal = async () => {

        setAssigning(true);
        try {
            for (let rol_id of selectedRoles) {
                const response = await asignarRolAdminSede({
                    per_id: selectedPersona.per_id,
                    se_id: Number(selectedSedes),
                    rol_id: rol_id,
                    sp_fecha_inicio: fechaInicio,
                    sp_fecha_fin: fechaFin || null,
                });

                onResetForm();
                if (!response.success) {
                    throw new Error(response.message);
                }

                // ✅ Mostrar el modal si el rol asignado es "Paciente"
                if (response.rolNombre === "Paciente") {
                    Swal.fire({
                        icon: "success",
                        text: response.mensajeAdicional,
                    });
                    setShowModal(true);
                }
            }
        } catch (error) {
            console.error("Error al asignar rol:", error);
            Swal.fire({
                icon: "error",
                text: error.message || "Error al asignar rol",
            });
        } finally {
            setAssigning(false);
        }
    };



    const handleRoleChange = (event) => {
        const value = Number(event.target.value); // Asegurar que sea un número
        setSelectedRoles(value);
        setSelectedSedes(value);
        setShowExtraAdminGeriaFields(value === 2);
        setShowExtraAdminSedeFields(value === 3);
        setShowExtraFields(value === 4);
        setShowModalEnfermera(value === 5);
        setShowModalColaborador(value === 7);
    };

    const handleGeriatricoChange = (event) => {
        setSelectedGeriatrico(Number(event.target.value)); // Convertir a número por seguridad
    };


    const handlePacientes = async (datosPaciente) => {
        if (!datosPaciente.per_id) {
            Swal.fire({
                icon: 'warning',
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }


        try {
            const response = await registrarPaciente(datosPaciente);

            Swal.fire({
                icon: response?.success ? 'success' : 'error',
                text: response?.message || "Error desconocido",
            });

        } catch (error) {
            console.error("❌ Error al registrar paciente:", error);
            Swal.fire({
                icon: 'error',
                text: error?.response?.data?.message || "Error al registrar paciente"
            });
        }
    };


    const handleEnfermera = async (datosEnfermera) => {
        if (!datosEnfermera.per_id) {
            Swal.fire({
                icon: 'warning',
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }


        try {
            const response = await startRegisterEnfermera(datosEnfermera);
            console.log(response);

            Swal.fire({
                icon: response.success ? 'success' : 'error',
                text: response.message,
            });

            if (response.success) {
                setShowModal(false); // Cierra el modal si el registro es exitoso
            } else {
                console.error("❌ Error al registrar enfermera:", response.message);
            }
        } catch (error) {
            console.error("❌ Error al registrar enfermera:", error.response.data.message);
            Swal.fire({
                icon: 'error',
                text: error.response.data.message
            })
        }
    };

    function validRegister() {
        return per_password && confirm_password && per_usuario && per_genero && per_telefono && per_nombre_completo && per_documento && per_correo;
    }

    const registroSubmit = async (e) => {
        e.preventDefault();

        // 1️⃣ Validar contraseñas
        if (per_password !== confirm_password) {
            Swal.fire({ title: 'Error', icon: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }

        if (!selectedRoles) {
            Swal.fire({ title: 'Error', icon: 'error', text: 'Debe seleccionar un rol' });
            return;
        }

        try {
            // 2️⃣ Registrar al usuario
            const response = await startRegister({
                per_correo,
                per_usuario,
                per_genero,
                per_telefono,
                per_nombre_completo,
                per_password,
                per_documento,
                per_foto,
                rol_id: selectedRoles
            });

            const idPersona = response?.data?.per_id;
            if (!idPersona) {
                Swal.fire({ icon: 'error', text: 'No se pudo obtener el ID del usuario' });
                return;
            }

            // 3️⃣ Acciones según el rol
            const rolId = Number(selectedRoles);

            if (rolId === 2) { // Admin Geriátrico

                await handleAssignRole(idPersona, selectedGeriatrico, rolId, gp_fecha_inicio, gp_fecha_fin);

            } else if (rolId === 3) { // Admin Sede
                await handleAssignAdminSede(idPersona, selectedSedes, rolId, sp_fecha_inicio, sp_fecha_fin);
            }

            // 4️⃣ Asignar sedes generales
            const asignacionExitosa = await handleAssignSedes(idPersona, selectedRoles, sp_fecha_inicio, sp_fecha_fin);

            if (asignacionExitosa) {
                Swal.fire({
                    icon: 'success',
                    text: asignacionExitosa.message
                });
                setShowModal(false);
            }

            // 5️⃣ Datos según el rol
            if (rolId === 4) { // Paciente
                const datosPaciente = {
                    per_id: idPersona,
                    pac_edad,
                    pac_peso,
                    pac_talla,
                    pac_regimen_eps,
                    pac_nombre_eps,
                    pac_rh_grupo_sanguineo,
                    pac_talla_camisa,
                    pac_talla_pantalon,
                    sp_fecha_inicio,
                    sp_fecha_fin
                };
                console.log("📤 Enviando datos del paciente:", datosPaciente);
                const pacienteResponse = await handlePacientes(datosPaciente);
                if (pacienteResponse.success) {
                    Swal.fire({
                        icon: 'success',
                        text: pacienteResponse.message
                    });
                    return;
                }
            } else if (rolId === 5) { // Enfermera
                const datosEnfermera = {
                    per_id: idPersona,
                    rol_id: rolId,
                    enf_codigo,
                    sp_fecha_inicio,
                    sp_fecha_fin
                };
                const enfermeraResponse = await handleEnfermera(datosEnfermera);
                if (enfermeraResponse?.success) {
                    Swal.fire({
                        icon: 'success',
                        text: enfermeraResponse.message
                    });
                    return;
                }
            } else if (![2, 3].includes(rolId)) {
                Swal.fire({ icon: 'error', text: 'El rol seleccionado no es válido' });
                return;
            }
            // 6️⃣ Éxito
            Swal.fire({
                icon: 'success',
                text: 'La cuenta ha sido creada correctamente',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: error.response?.data?.message || error.message || 'Ocurrió un error inesperado'
            });
        }
    };




    return (
        <form className="form-container" onSubmit={registroSubmit}>
            {!esSuperAdmin && (
                <div className="search-container-asignar">
                    <input
                        type="text"
                        className="search-input-asignar"
                        placeholder="Buscar por Cédula..."
                        name="per_documento"
                        value={per_documento}
                        onChange={onInputChange}
                    />
                    <button type="button" className="search-button-buscar" onClick={buscarPersona} disabled={loading}>
                        <i className={`fas fa-search ${loading ? 'fa-spin' : ''}`} /> Buscar
                    </button>
                </div>
            )}
            <div className="input-grid">
                <InputField label="Nombre completo" type="text" name="per_nombre_completo" value={per_nombre_completo} onChange={onInputChange} placeholder="Juan Gomez" icon="fas fa-user" required />
                <InputField label="Cedula" type="cc" name="per_documento" value={per_documento} onChange={onInputChange} placeholder="1234567890" icon="fas fa-id-card" required />
                <InputField label="E-mail" type="email" name="per_correo" value={per_correo} onChange={onInputChange} placeholder="correo@example.com" icon="fas fa-envelope" required />
                <InputField label="Usuario" type="text" name="per_usuario" value={per_usuario} onChange={onInputChange} placeholder="juangomez" icon="fas fa-user" required />
                <InputField label="Contraseña" type={isPasswordVisible ? "text" : "password"} name="per_password" value={per_password} onChange={onInputChange} placeholder="••••••••" icon={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={togglePasswordVisibility} required />
                <InputField label="Confirmar Contraseña" type={isPasswordVisible ? "text" : "password"} name="confirm_password" value={confirm_password} onChange={onInputChange} placeholder="••••••••" icon={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={togglePasswordVisibility} required />
                <div className="input-container-register">
                    <label>Género</label>
                    <select id="per_genero" name="per_genero" value={per_genero} onChange={onInputChange} className="custom-select-container">
                        <option hidden>Seleccione una opción</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                    </select>
                </div>
                <InputField label="Teléfono" type="text" name="per_telefono" value={per_telefono} onChange={onInputChange} placeholder="3112345678" icon="fas fa-phone" />
                <InputField label="Foto" type="file" name="per_foto" onChange={onInputChange} accept="image/*" />

                {validRegister() && (
                    <>
                        <SelectField label="Rol" name="rol_id" value={selectedRoles} onChange={handleRoleChange} />

                        {/* Se activan los campos adicionales SOLO si el usuario tiene rol 2 (AdminGeriatrico) */}
                        {showExtraAdminGeriaFields && (
                            <>
                                <SelectGeriatrico label="Geriátrico" name="ge_id" value={selectedGeriatrico} onChange={handleGeriatricoChange} />
                                <InputField label="Fecha inicio" type="date" name="gp_fecha_inicio" value={gp_fecha_inicio} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Fecha fin" type="date" name="gp_fecha_fin" value={gp_fecha_fin} onChange={onInputChange} placeholder="aaaa-mm-dd" />
                            </>
                        )}

                        {/* Se activan los campos adicionales SOLO si el usuario tiene rol 3 (AdminSede) */}
                        {showExtraAdminSedeFields && (
                            <>
                                <SelectSede label="Sede" name="se_id" value={selectedSedes} onChange={(e) => setSelectedSedes(Number(e.target.value))} />
                                <InputField label="Fecha inicio" type="date" name="sp_fecha_inicio" value={sp_fecha_inicio} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Fecha fin" type="date" name="sp_fecha_fin" value={sp_fecha_fin} onChange={onInputChange} placeholder="aaaa-mm-dd" />
                            </>
                        )}

                        {/* Se activan los campos adicionales SOLO si el usuario tiene rol 4 (Paciente) */}
                        {showExtraFields && (
                            <>
                                <InputField label="Edad" type="text" name="pac_edad" value={pac_edad} onChange={onInputChange} placeholder="Edad" required />
                                <InputField label="Peso" type="text" name="pac_peso" value={pac_peso} onChange={onInputChange} placeholder="Peso" required />
                                <InputField label="Estatura" type="text" name="pac_talla" value={pac_talla} onChange={onInputChange} placeholder="Estatura" required />
                                <InputField label="Régimen EPS" type="text" name="pac_regimen_eps" value={pac_regimen_eps} onChange={onInputChange} placeholder="Régimen EPS" required />
                                <InputField label="EPS" type="text" name="pac_nombre_eps" value={pac_nombre_eps} onChange={onInputChange} placeholder="EPS" required />
                                <InputField label="Grupo sanguíneo" type="text" name="pac_rh_grupo_sanguineo" value={pac_rh_grupo_sanguineo} onChange={onInputChange} placeholder="Grupo sanguíneo" required />
                                <InputField label="Talla de camisa" type="text" name="pac_talla_camisa" value={pac_talla_camisa} onChange={onInputChange} placeholder="Talla de camisa" required />
                                <InputField label="Talla de pantalón" type="text" name="pac_talla_pantalon" value={pac_talla_pantalon} onChange={onInputChange} placeholder="Talla de pantalón" required />
                                <InputField label="Fecha de inicio" type="date" name="sp_fecha_inicio" value={sp_fecha_inicio} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Fecha de fin" type="date" name="sp_fecha_fin" value={sp_fecha_fin} onChange={onInputChange} placeholder="aaaa-mm-dd" />
                            </>
                        )}
                        {showModalEnfermera && (
                            <>
                                <InputField label="Fecha inicio" type="date" name="sp_fecha_inicio" value={sp_fecha_inicio} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Fecha fin" type="date" name="sp_fecha_fin" value={sp_fecha_fin} onChange={onInputChange} placeholder="aaaa-mm-dd" />
                                <InputField label="Codigo" type="cc" name="enf_codigo" value={enf_codigo} onChange={onInputChange} placeholder="1234567890" required />
                            </>
                        )}
                        {showModalColaborador && (
                            <>
                                <InputField label="Fecha inicio" type="date" name="sp_fecha_inicio" value={sp_fecha_inicio} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Fecha fin" type="date" name="sp_fecha_fin" value={sp_fecha_fin} onChange={onInputChange} placeholder="aaaa-mm-dd" />
                            </>
                        )}
                    </>
                )}

            </div>
            <div className="button-container">
                <button type="submit" className="save-button">Registrarme</button>
            </div>
            {showSelectRoles && selectedPersona && (
                <CheckboxField
                    name="rol_id"
                    value={selectedRoles}
                    onChange={(roles) => {
                        const rolesNumericos = roles.map(Number);
                        setSelectedRoles(rolesNumericos);

                        const rolSeleccionado = rolesNumericos[0] || null;
                        console.log(rolSeleccionado);

                        if (rolSeleccionado === 3) {
                            setShowModalSede(true);
                            setShowModal(false);
                            setShowModalEnfermera(false);
                            
                        } else if (rolSeleccionado === 5) {
                            setShowModalEnfermera(true);
                            setShowModal(false);
                        } else if (rolSeleccionado === 7) {
                            setShowModalColaborador(true);
                            setShowModal(false);
                            setShowModalEnfermera(false);
                        }
                        else {
                            setShowModal(true);
                            setShowModalEnfermera(false);
                        }
                    }}
                />
            )}

            {showModalSede && selectedPersona && (
                <ModalAdminSede
                    assigning={assigning}
                    fechaFin={fechaFin}
                    fechaInicio={fechaInicio}
                    selectedRoles={selectedRoles}
                    selectedSedes={selectedSedes}
                    setSelectedSedes={setSelectedSedes}
                    handleAssignAdminSede={handleAssignAdminSedeModal}
                    handleAssignSedes={handleAssignSedes}
                    setFechaFin={setFechaFin}
                    setFechaInicio={setFechaInicio}
                    setAssigning={setAssigning}
                    onClose={() => setShowModalSede(false)}
                />
            )}

            {showModal && selectedPersona && (
                <ModalRegistrarPaciente
                    datosIniciales={selectedPersona}
                    onClose={() => setShowModal(false)}
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                />
            )}

            {showModalEnfermera && selectedPersona && (
                <ModalEnfermera
                    datosInicial={selectedPersona}
                    onRegistrar={handleEnfermera}
                    onClose={() => setShowModalEnfermera(false)}
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                />
            )}
            {
                showModalColaborador && selectedPersona && (
                    <ModalColaborador
                        datosInicial={selectedPersona}
                        selectedRoles={selectedRoles}
                        setSelectedRoles={setSelectedRoles}
                        onClose={() => setShowModalColaborador(false)}
                    />
                )
            }
        </form>
    );
};

