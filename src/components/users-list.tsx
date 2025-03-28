import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/database/supabaseClient";
import Spinner from "./ui/Spinner";
import { User2 } from "lucide-react";
import avatar from "../../public/avatar.png";

export interface User {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
}

export const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Consulta más específica usando Supabase
        const { data, error } = await supabase.from("profiles").select("*");

        if (error) throw error;

        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Configurar suscripción en tiempo real para actualizaciones de usuarios
    const usersSubscription = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          // Manejar cambios en tiempo real
          switch (payload.eventType) {
            case "INSERT":
              setUsers((prev) =>
                [...prev, payload.new as User].sort((a, b) =>
                  (a.full_name || "").localeCompare(b.full_name || "")
                )
              );
              break;
            case "DELETE":
              setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    // Limpiar suscripción al desmontar
    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, [currentUser]);

  const handleStartChat = (userId: string) => {
    navigate(`/family/chat/${userId}`);
  };

  const handleStartChatGrupo = () => {
    navigate(`/family/chat/grupo`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mt-2 flex justify-center">
        <Link
          to="/"
          className="hover:bg-muted rounded-md transition-colors p-2"
        >
          <User2 />
        </Link>
      </h3>
      <div
        onClick={handleStartChatGrupo}
        className="flex items-center mt-3 ml-2 cursor-pointer hover:bg-muted rounded-md transition-colors"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={avatar} alt="grupo Familiar" />
        </Avatar>
        <div className="ml-3">
          <p className="text-sm font-medium">Grupo Familiar</p>
        </div>
      </div>
      {users.length <= 1 ? ( // Cambiar condición para manejar cuando solo hay un usuario
        <p className="text-gray-500 text-center">
          No hay otros usuarios disponibles
        </p>
      ) : (
        users
          .filter((user) => user.id !== currentUser?.id) // Filtrar para excluir al usuario actual
          .map((user) => (
            <div
              key={user.id} // Añadir key para optimización de React
              onClick={() => handleStartChat(user.id)}
              className="flex items-center mt-3 ml-2 cursor-pointer hover:bg-muted rounded-md transition-colors"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar_url || "/default-avatar.png"}
                  alt={user.full_name || "Usuario"}
                />
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {user.full_name || "Sin nombre"}
                </p>
              </div>
            </div>
          ))
      )}
    </div>
  );
};
