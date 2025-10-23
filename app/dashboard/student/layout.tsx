import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentHeader } from "@/components/student-header"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Verificar que el usuario tiene rol de estudiante
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!roleData || roleData.role !== "estudiante") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <StudentSidebar user={user} />
      <main className="flex-1 lg:ml-64">
        <StudentHeader />
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
