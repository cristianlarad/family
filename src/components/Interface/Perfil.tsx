import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import supabase from "@/database/supabaseClient";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../users-list";
import { Avatar, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../theme/mode-toggle";

const Perfil = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setProfile(data);
    };
    fetchProfile();
  }, [userId]);
  return (
    <nav className="flex justify-between items-center px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <SidebarTrigger />
          <BreadcrumbItem className="hidden md:block">
            <Avatar className="h-8 w-8 rounded-lg ">
              <AvatarImage
                src={profile?.avatar_url || "/default-avatar.png"}
                alt={profile?.full_name || "Usuario"}
              />
            </Avatar>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>{profile?.full_name?.split(" ")[0]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ModeToggle />
    </nav>
  );
};

export default Perfil;
