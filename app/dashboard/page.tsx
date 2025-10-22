import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/role-actions"
import { getStudentProfile, getTutorProfile } from "@/lib/profile-actions"

export default async function DashboardPage() {
  // Verificar si el usuario tiene un rol asignado
  const roleResult = await getUserRole()

  // Si no tiene rol o hay un error, redirigir a selección de rol
  if (!roleResult.role || roleResult.error) {
    redirect("/dashboard/select-role")
  }

  // Verificar si el usuario tiene un perfil completado
  if (roleResult.role === "tutor") {
    const profileResult = await getTutorProfile()
    
    if (!profileResult.profile) {
      // No tiene perfil, redirigir al formulario
      redirect("/dashboard/tutor-form")
    }
    
    // Tiene perfil, redirigir al dashboard de tutor
    redirect("/dashboard/tutor-dashboard")
  } else {
    const profileResult = await getStudentProfile()
    
    if (!profileResult.profile) {
      // No tiene perfil, redirigir al formulario
      redirect("/dashboard/student-form")
    }
    
    // Tiene perfil, redirigir al dashboard de estudiante
    redirect("/dashboard/student-dashboard")
  }

  return null
}
