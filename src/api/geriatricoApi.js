import axios from "axios";
import { getEnvVariable } from "../helpers";

// Obtener las variables de entorno
const { VITE_API_URL } = getEnvVariable();
// Crear la instancia de Axios
const geriatricoApi = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true, // Esto debe ir aquí, no en headers
});

// Interceptor para agregar el token en las solicitudes
geriatricoApi.interceptors.request.use(config => {
    // Obtener el token desde el localStorage o las cookies
    const token = localStorage.getItem('token');

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`, // Agregar el token al header
            
        };
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default geriatricoApi;
