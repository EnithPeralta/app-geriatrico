import { Navigate, Route, Routes } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { useEffect } from "react";
import { LoadingComponet } from "../components";
import { ForgotPasswordPage, RegisterPage, ResetPasswordPage } from "../auth/page";
import { useAuthStore } from "../hooks";
import { GeriatricoRoutes } from "../geriatrico/routes/GeriatricoRoutes";

export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return <LoadingComponet />;
  }

  return (
    <Routes>
      <Route path="/restablecerPassword/:token" element={<ResetPasswordPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />


      {status === "authenticated" ? (
        <>
          <Route path="/geriatrico/*" element={<GeriatricoRoutes />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/" element={<Navigate to="/auth/login" />} />
        </>
      )}
    </Routes>
  );
};
