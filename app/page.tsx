import { AuthForms } from "@/components/auth-forms";
import LoginLogoutButton from "@/components/LoginLogoutButton";
import { ThemeToggle } from "@/components/theme-toggle";
import UserGreetText from "@/components/UserGreetText";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-black p-4">
      {/* Botón de cambio de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {/*Añadir botón de inicio/cierre de sesión en la parte inferior del formulario principal*/}
      <div className="absolute bottom-4 right-4">
        <LoginLogoutButton />
      </div>
      {/*Añadir texto de bienvenida al usuario*/}
      <div className="absolute top-4">
      <UserGreetText />
      </div>
      <AuthForms />
    </div>
  );
}
