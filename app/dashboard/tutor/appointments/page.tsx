"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Plus, MoreHorizontal, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Appointment {
  id: string
  studentName: string
  subject: string
  dateTime: string
  duration: number
  status: string
  notes?: string
  meetingLink?: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()

  const loadAppointments = () => {
    setLoading(true)
    try {
      // Leer citas desde localStorage
      const stored = localStorage.getItem("tutor_appointments")
      if (stored) {
        const parsedAppointments = JSON.parse(stored)
        setAppointments(parsedAppointments)
      }
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast.error("Error al cargar las citas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
    setUpdatingId(appointmentId)
    try {
      // Actualizar estado en localStorage
      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
      localStorage.setItem("tutor_appointments", JSON.stringify(updatedAppointments))
      setAppointments(updatedAppointments)
      toast.success("Estado actualizado")
    } catch (error) {
      toast.error("Error al actualizar el estado")
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      scheduled: { variant: "default", label: "Programada" },
      completed: { variant: "secondary", label: "Completada" },
      cancelled: { variant: "destructive", label: "Cancelada" },
    }
    const { variant, label } = config[status] || { variant: "outline" as const, label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Citas</h1>
          <p className="text-muted-foreground">
            Gestiona tus sesiones programadas
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/tutor/appointments/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Citas</CardTitle>
          <CardDescription>
            Lista completa de tus sesiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay citas</h3>
              <p className="text-muted-foreground">
                Comienza creando tu primera cita
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/dashboard/tutor/appointments/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cita
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {appointment.studentName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {appointment.studentName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.subject}</TableCell>
                      <TableCell>
                        {format(new Date(appointment.dateTime), "PPp", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>{appointment.duration}h</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updatingId === appointment.id}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {appointment.status !== "completed" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(appointment.id, "completed")
                                }
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Marcar como completada
                              </DropdownMenuItem>
                            )}
                            {appointment.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(appointment.id, "cancelled")
                                }
                                className="text-destructive"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar cita
                              </DropdownMenuItem>
                            )}
                            {appointment.meetingLink && (
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(appointment.meetingLink, "_blank")
                                }
                              >
                                Abrir enlace de reunión
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
