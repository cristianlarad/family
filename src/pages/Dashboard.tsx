import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CogIcon, MessageCircle, Users2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import avatarImg from "../../public/avatar.png";

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <>
      <nav className="flex justify-between items-center px-6 bg-muted p-3 rounded-lg shadow-2xs border-1">
        <Breadcrumb>
          <BreadcrumbList>
            <SidebarTrigger />
            <BreadcrumbItem className="hidden md:block">
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={avatarImg} alt="Grupo Familiar" />
              </Avatar>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Chat Familiar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ModeToggle />
      </nav>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Bienvenido a tu Espacio Familiar,{" "}
              {user?.user_metadata?.name || user?.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3  gap-4 mb-6">
              <Link to="/chat-grupo" className="text-center">
                <div className="bg-blue-100 p-4 rounded-lg hover:bg-blue-200 transition">
                  <MessageCircle className="mx-auto text-3xl mb-2 text-blue-600" />
                  <span>Chats Familiares</span>
                </div>
              </Link>
              <Link to="/family-members" className="text-center">
                <div className="bg-green-100 p-4 rounded-lg hover:bg-green-200 transition">
                  <Users2 className="mx-auto text-3xl mb-2 text-green-600" />
                  <span>Miembros</span>
                </div>
              </Link>
              <Link to="/settings" className="text-center">
                <div className="bg-purple-100 p-4 rounded-lg hover:bg-purple-200 transition">
                  <CogIcon className="mx-auto text-3xl mb-2 text-purple-600" />
                  <span>Configuración</span>
                </div>
              </Link>
            </div>
            <Button variant="destructive" onClick={signOut} className="w-full">
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
