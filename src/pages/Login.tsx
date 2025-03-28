import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
        <Button onClick={signInWithGoogle} disabled={isLoading}>
          Iniciar sesión con Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
