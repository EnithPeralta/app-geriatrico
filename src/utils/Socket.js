import { io } from "socket.io-client";

// Asegúrate de que la URL es la del backend donde está corriendo Socket.IO
const socket = io("https://appgeriatrico-production.up.railway.app", { transports: ["websocket", "polling"] });

// Manejar la conexión exitosa
socket.on("connect", () => {
    console.log("✅ Conectado al servidor de WebSockets con ID:", socket.id);
});

// Manejar desconexión
socket.on("disconnect", () => {
    console.warn("❌ Desconectado del servidor de WebSockets");
});

// Manejar errores
socket.on("connect_error", (err) => {
    console.error("❌ Error de conexión con WebSockets:", err.message);
});

export default socket;