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
import { Calendar, Plus, MoreHorizontal, Check, X, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Appointment {
  id: string
  teacherName: string
  subject: string
  dateTime: string
  duration: number
  status: string
  notes?: string
  meetingLink?: string
}

export default function StudentAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()

  const loadAppointments = () => {
    setLoading(true)
    try {
      // Leer citas desde localStorage
      const stored = localStorage.getItem("student_appointments")
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
      localStorage.setItem("student_appointments", JSON.stringify(updatedAppointments))
      setAppointments(updatedAppointments)
      toast.success("Estado actualizado")
    } catch (error) {
      toast.error("Error al actualizar el estado")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleExportPDF = async () => {
    try {
      // Verificar que estamos en el cliente
      if (typeof window === 'undefined') return

      // Importar jsPDF y autoTable dinámicamente (solo en el cliente)
      const { default: jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default

      // Leer citas desde localStorage
      const stored = localStorage.getItem("student_appointments")
      const appointments: Appointment[] = stored ? JSON.parse(stored) : []

      // Crear documento PDF
      const doc = new jsPDF()

      // Configurar fuente y colores
      const primaryColor: [number, number, number] = [59, 130, 246] // blue-500
      
      // Título
      doc.setFontSize(18)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text('Reporte de Citas', 14, 20)
      
      // Fecha de generación
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      const fechaGeneracion = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })
      doc.text(`Generado el: ${fechaGeneracion}`, 14, 28)
      
      // Si no hay citas
      if (appointments.length === 0) {
        doc.setFontSize(12)
        doc.setTextColor(50, 50, 50)
        doc.text('No hay citas registradas.', 14, 45)
      } else {
        // Preparar datos para la tabla
        const tableData = appointments.map((apt) => {
          const statusLabels: Record<string, string> = {
            scheduled: "Programada",
            completed: "Completada",
            cancelled: "Cancelada",
          }
          
          return [
            apt.teacherName,
            apt.subject,
            format(new Date(apt.dateTime), "dd/MM/yyyy HH:mm", { locale: es }),
            `${apt.duration}h`,
            statusLabels[apt.status] || apt.status,
          ]
        })

        // Agregar tabla con autoTable
        autoTable(doc, {
          startY: 35,
          head: [['Maestro', 'Materia/Tema', 'Fecha y hora', 'Duración', 'Estado']],
          body: tableData,
          theme: 'striped',
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [50, 50, 50],
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 35, left: 14, right: 14 },
        })
      }

      // Guardar PDF
      doc.save('reporte-citas-estudiante.pdf')
      toast.success('Reporte exportado exitosamente')
    } catch (error) {
      console.error('Error al generar PDF:', error)
      toast.error('Error al generar el reporte PDF')
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportPDF}
          >
            <FileText className="mr-2 h-4 w-4" />
            Exportar reporte
          </Button>
          <Button onClick={() => router.push("/dashboard/student/appointments/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </div>
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
                onClick={() => router.push("/dashboard/student/appointments/new")}
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
                    <TableHead>Maestro</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Duración</TableHead>
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
                              {appointment.teacherName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {appointment.teacherName}
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
