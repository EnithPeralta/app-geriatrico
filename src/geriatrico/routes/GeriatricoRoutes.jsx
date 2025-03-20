import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AcudientePacientePage, AcudientePage, AdminSuperPage, CuidadosEnfermeriaPage, EnfermerasPage, GeriatricosPage, GestionarPersonasPage, GestionPersonaGeriatricoPage, HistorySeguimientoPage, HistoyGeriatricoPage, HomePage, PacienteEspecificoPage, PacientesPage, ProfilePage, RolesPage, SedeEspecificaPage, SedesPage, SeguimientoPage, TurnoEnfermeriaPage } from '../page'

export const GeriatricoRoutes = () => {
    return (
        <Routes>
            <Route path="superAdmin" element={<AdminSuperPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="geriatrico" element={<GeriatricosPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path='sedes' element={<SedesPage />} />
            <Route path='asignar' element={<GestionarPersonasPage/>}/>
            <Route path="gestionarPersonas" element={<GestionPersonaGeriatricoPage />} />
            <Route path="sedeEspecifica" element={<SedeEspecificaPage />} />
            <Route path='pacientes' element={<PacientesPage />} />
            <Route path="enfermeras" element={<EnfermerasPage />} />
            <Route path='misPacientes' element={<AcudientePacientePage />} />
            <Route path="pacienteEspecifico/:id" element={<PacienteEspecificoPage />} />
            <Route path="acudiente/:id" element={<AcudientePage />} />
            <Route path="cuidadosEnfermeria/:id" element={<CuidadosEnfermeriaPage />} />
            <Route path="seguimientos/:id" element={<SeguimientoPage />} />
            <Route path="historial/:id" element={<HistorySeguimientoPage />} />
            <Route path="historialGeriatrico/:id" element={<HistoyGeriatricoPage />} />
            <Route path="crearTurno/:id" element={<TurnoEnfermeriaPage />} />
        </Routes>
    )
}
