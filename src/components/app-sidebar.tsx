import { useEffect } from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/database/supabaseClient";
import { UsersList } from "./users-list";

export default function AppSidebar() {
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      const { error } = await supabase
        .from("profiles") // Asume que tienes una tabla de perfiles
        .select("*")
        .neq("id", user.id); // Excluir al usuario actual

      if (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <Sidebar>
      <SidebarContent>
        <UsersList />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
