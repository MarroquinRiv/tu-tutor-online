"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { MOCK_TUTORS } from "@/lib/mock-tutors"

const appointmentSchema = z.object({
  teacherId: z.string().min(1, "Debes seleccionar un maestro"),
  subject: z.string().min(1, "La materia es requerida"),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
  duration: z.string().min(1, "Debes seleccionar la duración"),
  notes: z.string().optional(),
  meetingLink: z.string().url("URL inválida").optional().or(z.literal("")),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

export default function NewStudentAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedTeacherId = searchParams.get("tutorId")
  
  const [loading, setLoading] = useState(false)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      teacherId: preselectedTeacherId || "",
      subject: "",
      time: "10:00",
      duration: "1",
      notes: "",
      meetingLink: "",
    },
  })

  // Auto-completar materia según el tutor seleccionado
  const selectedTeacherId = form.watch("teacherId")
  const selectedTeacher = MOCK_TUTORS.find(t => t.id === selectedTeacherId)

  const onSubmit = async (values: AppointmentFormValues) => {
    setLoading(true)
    try {
      // Combinar fecha y hora
      const dateTime = new Date(values.date)
      const [hours, minutes] = values.time.split(":")
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const teacher = MOCK_TUTORS.find(t => t.id === values.teacherId)
      
      // Crear nueva cita
      const newAppointment = {
        id: Date.now().toString(),
        teacherName: teacher?.name || "Tutor",
        subject: values.subject,
        dateTime: dateTime.toISOString(),
        duration: parseFloat(values.duration),
        status: "scheduled",
        notes: values.notes,
        meetingLink: values.meetingLink || undefined,
      }

      // Guardar en localStorage
      const stored = localStorage.getItem("student_appointments")
      const appointments = stored ? JSON.parse(stored) : []
      appointments.push(newAppointment)
      localStorage.setItem("student_appointments", JSON.stringify(appointments))

      toast.success("Cita creada exitosamente")
      
      // Redirigir a la página de citas
      setTimeout(() => {
        router.push("/dashboard/student/appointments")
      }, 500)
    } catch (error) {
      toast.error("Error al crear la cita")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Cita</h1>
        <p className="text-muted-foreground">
          Programa una nueva sesión con un tutor
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Cita</CardTitle>
          <CardDescription>
            Completa todos los campos para crear la cita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Tutor Selection */}
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!!preselectedTeacherId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tutor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_TUTORS.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.experience}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show teacher's subjects if selected */}
              {selectedTeacher && (
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-sm font-medium">Materias disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Matemáticas, Física, etc." {...field} />
                    </FormControl>
                    <FormDescription>
                      Elige una de las materias disponibles del tutor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date and Time */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (horas)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona duración" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0.5">0.5 horas</SelectItem>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="1.5">1.5 horas</SelectItem>
                        <SelectItem value="2">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meeting Link */}
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlace de reunión (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://meet.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enlace de Zoom, Google Meet, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Temas que quieres revisar, dudas específicas, etc."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? "Creando..." : "Crear Cita"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
