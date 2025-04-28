import '../../css/forge.css';
import { useState } from "react";
import { useParams } from "react-router-dom";  
import Swal from 'sweetalert2';
import { usePassword } from '../../hooks';

export const ResetPasswordPage = () => {
  const { resetPassword, loading, message, error } = usePassword();
  const { token } = useParams();  // Obtiene el token desde la URL
  const [form, setForm] = useState({ per_password: "", confirmPassword: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Función para actualizar los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.per_password || !form.confirmPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const response = await resetPassword(token, form.per_password, form.confirmPassword);
    if (response) {
      Swal.fire({
        icon: 'success',
        text: 'La contraseña se ha restablecido correctamente.',
      })
    }
  };

  return (
    <div className="bodyForget">
      <div className="container-forget">
        <div className="left-forget">
          <h2>¿Olvidaste tu contraseña?</h2>
          <p>Recuerda que la contraseña 
            debe tener una longitud mínima de 6
             caracteres y contener al menos una letra y un número.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-container-forget">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="per_password"
                placeholder="Nueva Contraseña"
                value={form.per_password}
                onChange={handleChange}
              />
              <i className="fas fa-lock"></i>
            </div>

            <div className="input-container-forget">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <i
                className={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            <button className="btn-forget" type="submit" disabled={loading}>
              {loading ? "Restableciendo..." : "Enviar"}
            </button>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        <div className="right-forget"></div>
      </div>
    </div>
  );
};
