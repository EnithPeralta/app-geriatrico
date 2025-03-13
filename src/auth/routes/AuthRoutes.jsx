import { Route, Routes } from "react-router-dom"
import { LoginPage } from "../page"

export const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />
        </Routes>
    )
}
