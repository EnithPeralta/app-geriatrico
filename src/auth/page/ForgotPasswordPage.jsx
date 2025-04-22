import React, { useEffect, useState } from 'react';
import '../../css/forge.css';
import { useAuthStore, usePassword } from '../../hooks';
import Swal from "sweetalert2";

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loginEnabled, setLoginEnabled] = useState(false); // Nuevo estado
    const { forgotPassword, loading, message, error } = usePassword();
    const { startLogout } = useAuthStore();

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            forgotPassword({ per_correo: email });
            setHasSubmitted(true); // <- Marcar que ya envió
        } else {
            Swal.fire({
                icon: 'warning',
                text: "Por favor, ingresa un correo válido."
            });
        }
    };

    useEffect(() => {
        if (message && hasSubmitted) {
            Swal.fire({
                icon: 'success',
                text: message
            }).then(() => {
                setLoginEnabled(true);
            });
        }
    }, [message, hasSubmitted]);

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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <i className="fas fa-envelope" />
                    </div>

                    <button
                        className="btn-forget"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar"}
                    </button>

                    {loginEnabled && (
                        <button
                            className="btn-forget"
                            onClick={startLogout}
                            style={{ marginTop: '15px' }}
                        >
                            Ir a Iniciar sesión
                        </button>
                    )}
                </div>

                <div className="right-forget"></div>
            </div>
        </div>
    );
};
