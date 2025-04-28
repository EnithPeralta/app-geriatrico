import { io } from "socket.io-client";

// Asegúrate de que la URL es la del backend donde está corriendo Socket.IO
const socket = io("https://appgeriatrico-production.up.railway.app", {
    transports: ["websocket", "polling"],
});



socket.on("connect", () => {
    console.log("✅ Conectado al servidor de WebSockets con ID:", socket.id);
    const se_id = localStorage.getItem("se_id");
    const se_id_sesion = localStorage.getItem("se_id_sesion");
    // Unirse a la sala usando el se_id (para la sede)
    if (se_id) {
        socket.emit("joinRoom", `sede-${se_id}`);
    } else {
        console.warn("⚠️ No se encontró se_id en localStorage");
    }

    // Unirse a la sala usando el se_id_sesion (para la sesión de usuario)
    if (se_id_sesion) {
        socket.emit("joinRoom", `sede-${se_id_sesion}`);
    } else {
        console.warn("⚠️ No se encontró se_id_sesion en localStorage");
    }
});

socket.on("acudienteRegistrado", (data) => {
    console.log("🎉 Nuevo acudiente registrado:", data);
    // Aquí puedes manejar los datos del acudiente, como mostrar una notificación
});

socket.on("disconnect", () => {
    console.warn("❌ Desconectado del servidor de WebSockets");
});

socket.on("connect_error", (err) => {
    console.error("❌ Error de conexión con WebSockets:", err.message);
});

export default socket;
