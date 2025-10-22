import { AuthForms } from "@/components/auth-forms";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-black p-4">
      {/* Botón de cambio de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <AuthForms />
    </div>
  );
}
