import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/role-actions"

export default async function DashboardPage() {
  // Verificar si el usuario tiene un rol asignado
  const result = await getUserRole()

  // Si no tiene rol o hay un error, redirigir a selección de rol
  if (!result.role || result.error) {
    redirect("/dashboard/select-role")
  }

  // Si tiene rol, redirigir según el tipo
  if (result.role === "tutor") {
    redirect("/dashboard/tutor-form")
  } else {
    redirect("/dashboard/student-form")
  }

  return null
}
