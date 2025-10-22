import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { TutorSidebar } from "@/components/tutor-sidebar"
import { TutorHeader } from "@/components/tutor-header"

export default async function TutorLayout({
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

  // Verificar que el usuario tiene rol de tutor
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!roleData || roleData.role !== "tutor") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <TutorSidebar user={user} />
      <main className="flex-1 lg:ml-64">
        <TutorHeader />
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
