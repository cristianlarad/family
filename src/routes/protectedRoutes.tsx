import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // Puedes reemplazar con un spinner de carga
  }

  if (!user) {
    return <Navigate to="/family/login" replace />;
  }

  return <Outlet />; // Renderiza las rutas hijas
};

export const PublicRoute: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/family" replace />;
  }

  return <Outlet />;
};
