"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveUserRole(role: "tutor" | "estudiante") {
  const supabase = await createClient()
  
  // Obtener el usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  // Verificar si el usuario ya tiene un rol
  const { data: existingRole, error: fetchError } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 = no rows returned
    return { error: "Error al verificar el rol existente" }
  }

  let result

  if (existingRole) {
    // Actualizar rol existente
    const { error: updateError } = await supabase
      .from("user_roles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)

    if (updateError) {
      return { error: "Error al actualizar el rol" }
    }
  } else {
    // Insertar nuevo rol
    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({
        user_id: user.id,
        role,
      })

    if (insertError) {
      return { error: "Error al guardar el rol" }
    }
  }

  revalidatePath("/dashboard")
  return { success: true, role }
}

export async function getUserRole() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No tiene rol asignado
      return { role: null }
    }
    return { error: "Error al obtener el rol" }
  }

  return { role: data.role }
}
