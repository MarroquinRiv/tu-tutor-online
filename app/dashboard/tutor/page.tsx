"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { getTutorStats, getTutorAppointments } from "@/lib/appointment-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Stats {
  newStudentsThisWeek: number
  completedSessionsThisMonth: number
  earningsThisMonth: number
}

interface Appointment {
  id: string
  student_name: string
  subject: string
  date_time: string
  duration: number
  total_price: number
  status: string
}

// Datos ficticios para las gráficas
const weeklyEarningsData = [
  { day: "Lun", ingresos: 120 },
  { day: "Mar", ingresos: 180 },
  { day: "Mié", ingresos: 240 },
  { day: "Jue", ingresos: 160 },
  { day: "Vie", ingresos: 300 },
  { day: "Sáb", ingresos: 200 },
  { day: "Dom", ingresos: 80 },
]

const dailySessionsData = [
  { day: "Lun", sesiones: 2 },
  { day: "Mar", sesiones: 3 },
  { day: "Mié", sesiones: 4 },
  { day: "Jue", sesiones: 2 },
  { day: "Vie", sesiones: 5 },
  { day: "Sáb", sesiones: 3 },
  { day: "Dom", sesiones: 1 },
]

export default function TutorDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    newStudentsThisWeek: 0,
    completedSessionsThisMonth: 0,
    earningsThisMonth: 0,
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsResult, appointmentsResult] = await Promise.all([
          getTutorStats(),
          getTutorAppointments(),
        ])

        if (statsResult.stats) {
          setStats(statsResult.stats)
        }

        if (appointmentsResult.appointments) {
          // Tomar solo las 3 próximas citas
          setUpcomingAppointments(appointmentsResult.appointments.slice(0, 3))
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      programada: "default",
      completada: "secondary",
      cancelada: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de tutor
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newStudentsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sesiones Completadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.earningsThisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Semanales</CardTitle>
            <CardDescription>
              Tus ganancias de los últimos 7 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ingresos" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sesiones Diarias</CardTitle>
            <CardDescription>
              Número de sesiones por día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySessionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sesiones" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Citas</CardTitle>
          <CardDescription>
            Tus próximas sesiones programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tienes citas programadas
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {appointment.student_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.student_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(appointment.date_time), "PPp", { locale: es })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.duration}h - ${appointment.total_price}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
