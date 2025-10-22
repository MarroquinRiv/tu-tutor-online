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
import { getTutorAppointments, updateAppointmentStatus } from "@/lib/appointment-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Plus, MoreHorizontal, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Appointment {
  id: string
  student_name: string
  subject: string
  date_time: string
  duration: number
  price_per_hour: number
  total_price: number
  status: string
  notes?: string
  meeting_link?: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const result = await getTutorAppointments()
      if (result.appointments) {
        setAppointments(result.appointments)
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

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    setUpdatingId(appointmentId)
    try {
      const result = await updateAppointmentStatus(appointmentId, newStatus)
      if (result.success) {
        toast.success("Estado actualizado")
        await loadAppointments()
      } else {
        toast.error(result.error || "Error al actualizar")
      }
    } catch (error) {
      toast.error("Error al actualizar el estado")
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pendiente: { variant: "default", label: "Pendiente" },
      programada: { variant: "default", label: "Programada" },
      completada: { variant: "secondary", label: "Completada" },
      cancelada: { variant: "destructive", label: "Cancelada" },
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
                              {appointment.student_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {appointment.student_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.subject}</TableCell>
                      <TableCell>
                        {format(new Date(appointment.date_time), "PPp", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>{appointment.duration}h</TableCell>
                      <TableCell>${appointment.total_price}</TableCell>
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
                            {appointment.status !== "completada" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(appointment.id, "completada")
                                }
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Marcar como completada
                              </DropdownMenuItem>
                            )}
                            {appointment.status !== "cancelada" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(appointment.id, "cancelada")
                                }
                                className="text-destructive"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar cita
                              </DropdownMenuItem>
                            )}
                            {appointment.meeting_link && (
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(appointment.meeting_link, "_blank")
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
