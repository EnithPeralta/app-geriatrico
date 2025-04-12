import React from 'react'
import { Route, Routes } from 'react-router-dom'
import {
    AcudientePacientePage,
    AcudientePage,
    AdminSuperPage,
    ColaboradoresPage,
    CuadroTurnosEnfermeraPage,
    CuidadosEnfermeriaPage,
    DiagnosticoPage,
    EnfermerasPage,
    FormulacionMedicamentosPage,
    GeriatricosPage,
    GestionarPersonasPage,
    GestionPersonaGeriatricoPage,
    HistorialPacientePage,
    HistorySeguimientoPage,
    HistoryTurnosEnfermeraPage,
    HistoryTurnosSedePage,
    HistoyGeriatricoPage,
    HomePage,
    InventarioPacientePage,
    InventarioSedePage,
    MedicamentosPage,
    PacienteEspecificoPage,
    PacientesPage,
    ProfilePage,
    RecomendacionesPage,
    RolesPage,
    RolesPorGeriatricoPage,
    RolPacienteSedePage,
    SedeEspecificaPage,
    SedesPage,
    SeguimientoPage,
    TurnoEnfermeriaPage,
    TurnoSedePage
} from '../page'

export const GeriatricoRoutes = () => {
    return (
        <Routes>
            <Route path="superAdmin" element={<AdminSuperPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="geriatrico" element={<GeriatricosPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path='sedes' element={<SedesPage />} />
            <Route path='asignar' element={<GestionarPersonasPage />} />
            <Route path="gestionarPersonas" element={<GestionPersonaGeriatricoPage />} />
            <Route path="sedeEspecifica" element={<SedeEspecificaPage />} />
            <Route path='pacientes' element={<PacientesPage />} />
            <Route path="enfermeras" element={<EnfermerasPage />} />
            <Route path='misPacientes' element={<AcudientePacientePage />} />
            <Route path='misTurnos' element={<CuadroTurnosEnfermeraPage />} />
            <Route path='turnoSede' element={<TurnoSedePage />} />
            <Route path="historialTurnosEnfermera" element={<HistoryTurnosEnfermeraPage />} />
            <Route path="inventarioSede" element={<InventarioSedePage />} />
            <Route path="medicamentos" element={<MedicamentosPage />} />
            <Route path="colaboradores" element={<ColaboradoresPage />} />
            <Route path="historialTurnoSede/:id" element={<HistoryTurnosSedePage />} />
            <Route path="pacienteEspecifico/:id" element={<PacienteEspecificoPage />} />
            <Route path="rolesPorGeriatrico/:id" element={<RolesPorGeriatricoPage />} />
            <Route path="acudiente/:id" element={<AcudientePage />} />
            <Route path="cuidadosEnfermeria/:id" element={<CuidadosEnfermeriaPage />} />
            <Route path="seguimientos/:id" element={<SeguimientoPage />} />
            <Route path="historial/:id" element={<HistorySeguimientoPage />} />
            <Route path="historialGeriatrico/:id" element={<HistoyGeriatricoPage />} />
            <Route path="crearTurno/:id" element={<TurnoEnfermeriaPage />} />
            <Route path="rolPacienteSede/:id" element={<RolPacienteSedePage />} />
            <Route path="historialPaciente/:id" element={<HistorialPacientePage />} />
            <Route path="recomendaciones/:id" element={<RecomendacionesPage />} />
            <Route path="diagnostico/:id" element={<DiagnosticoPage />} />
            <Route path="inventarioPaciente/:id" element={<InventarioPacientePage />} />
            <Route path="formulacionMedicamentos/:id" element={<FormulacionMedicamentosPage />} />
        </Routes>
    )
}
