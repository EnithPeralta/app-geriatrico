import React, { useEffect, useState } from 'react';
import '../../css/forge.css';
import { usePassword } from '../../hooks';
import Swal from "sweetalert2";

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");  // Para almacenar el correo ingresado por el usuario
    const { forgotPassword, loading, message, error } = usePassword();  // Usamos el hook personalizado

    // Función que maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            forgotPassword({ per_correo: email });  // Llamamos a la función de recuperación de contraseña
        } else {
            Swal.fire({
                icon: 'warning',
                text: "Por favor, ingresa un correo válido."
            });
        }
    };
    useEffect(() => {
        if (message) {
            Swal.fire({
                icon: 'success',
                text: message
            });
        }
    }, [message]);

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                text: error
            });
        }
    }, [error]);

    return (
        <div className="bodyForget">
            <div className="container-forget">
                <div className="left-forget">
                    <h2>¿Olvidaste tu contraseña?</h2>
                    <p>Escribe el correo asociado a tu cuenta; ahí te llegarán las instrucciones para cambiar tu contraseña.</p>
                    <div className="input-container-forget">
                        <input
                            type="email"
                            placeholder="Escribe tu E-mail"
                            value={email}  // Vinculamos el estado del email al valor del input
                            onChange={(e) => setEmail(e.target.value)}  // Actualizamos el estado cuando el usuario escribe
                        />
                        <i className="fas fa-envelope" />
                    </div>
                    <button
                        className="btn-forget"
                        onClick={handleSubmit}  // Llamamos a la función handleSubmit cuando se hace click
                        disabled={loading}  // Deshabilitamos el botón mientras se procesa la solicitud
                    >
                        {loading ? "Enviando..." : "Enviar"}  {/* Cambiamos el texto del botón si está en proceso */}
                    </button>
                </div>
                <div className="right-forget">
                </div>
            </div>
        </div>
    );
};
