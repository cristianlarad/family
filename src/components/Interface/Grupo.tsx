import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { Avatar, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../theme/mode-toggle";
import avatarImg from "../../../public/avatar.png";
const Grupo = () => {
  return (
    <nav className="flex justify-between items-center px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <SidebarTrigger />
          <BreadcrumbItem className="hidden md:block">
            <Avatar className="h-8 w-8 rounded-lg ">
              <AvatarImage src={avatarImg} alt="Grupo Familiar" />
            </Avatar>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Grupo Familiar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ModeToggle />
    </nav>
  );
};

export default Grupo;
