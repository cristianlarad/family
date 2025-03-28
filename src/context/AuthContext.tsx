import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { User } from "@supabase/supabase-js";
import supabase from "@/database/supabaseClient";

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Verificar sesión actual
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkUser();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (isMounted) {
        setUser(session?.user || null);
      }
    });

    // Limpiar suscripción
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Usar useCallback para optimizar funciones de autenticación
  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Error de inicio de sesión:", error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const insertUserProfile = async () => {
      if (!user) return;

      try {
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name:
              user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url,
            email: user.email,
          },
          {
            onConflict: "id",
          }
        );

        if (error) {
          console.error("Error al insertar/actualizar perfil:", error);
        }
      } catch (error) {
        console.error("Error inesperado al insertar perfil:", error);
      }
    };

    insertUserProfile();
  }, [user]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      window.location.href = "/login";
      if (error) {
        console.error("Error de cierre de sesión:", error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("sb-ksyihmtnrgmlqxkswbab-auth-token");
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Usar useMemo para optimizar el valor del contexto
  const contextValue = useMemo(
    () => ({
      user,
      signInWithGoogle,
      signOut,
      isLoading,
    }),
    [user, signInWithGoogle, signOut, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
