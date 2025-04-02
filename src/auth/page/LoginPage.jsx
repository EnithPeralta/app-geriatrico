import { useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../css/login.css";
import { useAuthStore, useForm, useRoles, useSession } from "../../hooks";

const loginFormFields = {
  per_password: "",
  per_usuario: "",
};

export const LoginPage = () => {
  const { startLogin, startLogout } = useAuthStore();
  const navigate = useNavigate();
  const {
    per_password,
    per_usuario,
    onInputChange,
    isPasswordVisible,
    togglePasswordVisibility,
  } = useForm(loginFormFields);
  const { session, obtenerSesion } = useSession();
  const { obtenerRolesAsignados, seleccionarRol } = useRoles(); // ✅ Se agregó seleccionarRol

  useEffect(() => {
    if (session) {
      navigate(session.esSuperAdmin ? "/geriatrico/superAdmin" : "/geriatrico/home");
    }
  }, [session, navigate]);

  const fetchRoles = async (per_id) => {
    if (!per_id) {
      Swal.fire({ icon: "error", text: "ID de usuario no válido." });
      return;
    }

    try {
      const res = await obtenerRolesAsignados(per_id);

      if (!res || !res.roles || res.roles.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "No tienes roles asignados. Contacta a un administrador.",
        }).then(() => {
          startLogout(); // Llama la función que limpia la sesión
          navigate("/login");  // Redirige al login
        });
        return;
      }

      // 🔄 Si el usuario tiene más de un rol, lo enviamos a /home y terminamos
      if (res.roles.length > 1) {
        navigate("/geriatrico/home");
        return;
      }

      // 🛑 Nos aseguramos de que haya un rol asignado antes de continuar
      const rolAsignado = res.roles[0];
      if (!rolAsignado) {
        Swal.fire({ icon: "error", text: "Error al obtener el rol del usuario." });
        navigate("/geriatrico/home"); // Redirección segura
        return;
      }

      // ✅ Guardamos el rol si hay uno solo
      seleccionarRol(rolAsignado);
      if (rolAsignado.rol_id === 2) {
        navigate("/geriatrico/sedes");
        return;
      } else if (rolAsignado.rol_id === 5) {
        navigate("/geriatrico/pacientes");
        return;
      } else if (rolAsignado.rol_id === 3) {
        navigate("/geriatrico/sedeEspecifica");
        return;
      } else if (rolAsignado.rol_id === 6) {
        navigate("/geriatrico/misPacientes");
        return;
      }
    } catch (error) {
      Swal.fire({ icon: "error", text: "Hubo un problema al obtener los roles." });
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    const response = await startLogin({ per_usuario, per_password });

    if (!response || !response.success) {
      Swal.fire({
        icon: "error",
        text: response.message
      });
      return;
    }

    const { esSuperAdmin, user } = response;

    await obtenerSesion();

    if (esSuperAdmin) {
      navigate("/geriatrico/superAdmin");
      return;
    }

    if (!user || !user.id) {
      Swal.fire({ icon: "error", text: "Error al obtener los datos del usuario." });
      return;
    }

    await fetchRoles(user.id);
  };


  return (
    <div className="animate__animated animate__fadeIn">
      <div className="BodyLogin">
        <img src="/enf.png" className="img" alt="enfermera" />
        <div className="circletop"></div>
        <div className="cuadrado">
          <div className="web">
            <FaCircle className="circle" />
            <span className="titleLogin">Geriátrico Web</span>
          </div>
          <h3 className="h3">Comienza ahora</h3>
          <h2 className="h2">Iniciar sesión<span className="link">.</span></h2>
          <form className="form" onSubmit={loginSubmit}>
            <div className="input-container">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Usuario"
                value={per_usuario}
                onChange={onInputChange}
                name="per_usuario"
                required
              />
            </div>
            <div className="input-container">
              <i className={`fa-solid ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`} onClick={togglePasswordVisibility}></i>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Contraseña"
                value={per_password}
                onChange={onInputChange}
                name="per_password"
                required
              />
            </div>
            <Link className="link" to="/forgotPassword">
              <p className="p">¿Se te ha olvidado la contraseña?</p>
            </Link>
            <button className="login-button" type="submit">Entrar</button>

          </form>
          <div className="circlebottom"></div>
        </div>
      </div>
    </div>
  );
};
