import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AcudientePacientePage, AcudientePage, AdminSuperPage, CuadroTurnosEnfermeraPage, CuidadosEnfermeriaPage, EnfermerasPage, GeriatricosPage, GestionarPersonasPage, GestionPersonaGeriatricoPage, HistorialPacientePage, HistorySeguimientoPage, HistoyGeriatricoPage, HomePage, InformeEnfemeriaPage, PacienteEspecificoPage, PacientesPage, ProfilePage, RolEnfermeraPage, RolesPage, RolPacienteSedePage, SedeEspecificaPage, SedesPage, SeguimientoPage, TurnoEnfermeriaPage, TurnoSedePage } from '../page'

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
            <Route path="pacienteEspecifico/:id" element={<PacienteEspecificoPage />} />
            <Route path="acudiente/:id" element={<AcudientePage />} />
            <Route path="cuidadosEnfermeria/:id" element={<CuidadosEnfermeriaPage />} />
            <Route path="seguimientos/:id" element={<SeguimientoPage />} />
            <Route path="historial/:id" element={<HistorySeguimientoPage />} />
            <Route path="historialGeriatrico/:id" element={<HistoyGeriatricoPage />} />
            <Route path="crearTurno/:id" element={<TurnoEnfermeriaPage />} />
            <Route path="rolPacienteSede/:id" element={<RolPacienteSedePage />} />
            <Route path="historialPaciente/:id" element={<HistorialPacientePage />} />
            <Route path="rolEnfermera" element={<RolEnfermeraPage />} />
            <Route path="informesEnfermeria" element={<InformeEnfemeriaPage />} />
        </Routes>
    )
}
