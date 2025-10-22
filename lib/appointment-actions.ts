"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface AppointmentData {
  studentId: string
  studentName: string
  subject: string
  dateTime: string
  duration: number
  pricePerHour: number
  notes?: string
  meetingLink?: string
}

export async function createAppointment(data: AppointmentData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  // Insertar nueva cita
  const { error: insertError } = await supabase
    .from("appointments")
    .insert({
      tutor_id: user.id,
      student_id: data.studentId,
      student_name: data.studentName,
      subject: data.subject,
      date_time: data.dateTime,
      duration: data.duration,
      price_per_hour: data.pricePerHour,
      notes: data.notes,
      meeting_link: data.meetingLink,
      status: "pendiente",
    })

  if (insertError) {
    console.error("Error al crear cita:", insertError)
    return { error: "Error al crear la cita" }
  }

  revalidatePath("/dashboard/tutor/appointments")
  return { success: true }
}

export async function getTutorAppointments() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado", appointments: [] }
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("tutor_id", user.id)
    .order("date_time", { ascending: true })

  if (error) {
    console.error("Error al obtener citas:", error)
    return { error: "Error al obtener las citas", appointments: [] }
  }

  return { appointments: data || [] }
}

export async function updateAppointmentStatus(appointmentId: string, status: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", appointmentId)
    .eq("tutor_id", user.id)

  if (error) {
    console.error("Error al actualizar cita:", error)
    return { error: "Error al actualizar la cita" }
  }

  revalidatePath("/dashboard/tutor/appointments")
  return { success: true }
}

export async function searchStudents(filters?: {
  nivelEducativo?: string
  edad?: number
  areasInteres?: string[]
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from("student_profiles")
    .select(`
      *,
      user:user_id (
        id,
        email
      )
    `)

  // Aplicar filtros si existen
  if (filters?.nivelEducativo) {
    query = query.eq("nivel_educativo", filters.nivelEducativo)
  }

  if (filters?.edad) {
    query = query.eq("edad", filters.edad)
  }

  if (filters?.areasInteres && filters.areasInteres.length > 0) {
    query = query.overlaps("areas_interes", filters.areasInteres)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al buscar estudiantes:", error)
    return { error: "Error al buscar estudiantes", students: [] }
  }

  return { students: data || [] }
}

export async function getTutorStats() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return {
      error: "Usuario no autenticado",
      stats: {
        newStudentsThisWeek: 0,
        completedSessionsThisMonth: 0,
        earningsThisMonth: 0,
        totalAppointments: 0,
      }
    }
  }

  // Obtener todas las citas del tutor
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("tutor_id", user.id)

  if (!appointments) {
    return {
      stats: {
        newStudentsThisWeek: 0,
        completedSessionsThisMonth: 0,
        earningsThisMonth: 0,
        totalAppointments: 0,
      }
    }
  }

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Calcular métricas
  const newStudentsThisWeek = appointments.filter(
    (apt) => new Date(apt.created_at) >= weekAgo
  ).length

  const completedSessionsThisMonth = appointments.filter(
    (apt) =>
      apt.status === "completada" &&
      new Date(apt.date_time) >= monthStart
  ).length

  const earningsThisMonth = appointments
    .filter(
      (apt) =>
        apt.status === "completada" &&
        new Date(apt.date_time) >= monthStart
    )
    .reduce((sum, apt) => sum + (apt.total_price || 0), 0)

  return {
    stats: {
      newStudentsThisWeek,
      completedSessionsThisMonth,
      earningsThisMonth,
      totalAppointments: appointments.length,
    }
  }
}
