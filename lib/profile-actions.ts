"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface StudentProfileData {
  nivelEducativo?: string
  edad?: number
  areasInteres: string[]
  objetivoAprendizaje: string
}

export interface TutorProfileData {
  nivelExperiencia: string
  temasEspecializacion: string[]
  disponibilidadSemanal: string[]
  presentacion: string
}

export async function saveStudentProfile(data: StudentProfileData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  // Verificar si ya existe un perfil
  const { data: existingProfile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (existingProfile) {
    return { error: "Ya tienes un perfil de estudiante registrado" }
  }

  // Insertar nuevo perfil
  const { error: insertError } = await supabase
    .from("student_profiles")
    .insert({
      user_id: user.id,
      nivel_educativo: data.nivelEducativo,
      edad: data.edad,
      areas_interes: data.areasInteres,
      objetivo_aprendizaje: data.objetivoAprendizaje,
    })

  if (insertError) {
    console.error("Error al guardar perfil:", insertError)
    return { error: "Error al guardar el perfil de estudiante" }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function saveTutorProfile(data: TutorProfileData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  // Verificar si ya existe un perfil
  const { data: existingProfile } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (existingProfile) {
    return { error: "Ya tienes un perfil de tutor registrado" }
  }

  // Insertar nuevo perfil
  const { error: insertError } = await supabase
    .from("tutor_profiles")
    .insert({
      user_id: user.id,
      nivel_experiencia: data.nivelExperiencia,
      temas_especializacion: data.temasEspecializacion,
      disponibilidad_semanal: data.disponibilidadSemanal,
      presentacion: data.presentacion,
    })

  if (insertError) {
    console.error("Error al guardar perfil:", insertError)
    return { error: "Error al guardar el perfil de tutor" }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getStudentProfile() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return { error: "Error al obtener el perfil" }
  }

  return { profile: data }
}

export async function getTutorProfile() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  const { data, error } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return { error: "Error al obtener el perfil" }
  }

  return { profile: data }
}
