import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AdminSuperPage, GeriatricosPage, GestionarPersonasPage, GestionPersonaGeriatricoPage, HomePage, ProfilePage, RolesPage, SedesPage } from '../page'

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
        </Routes>
    )
}
