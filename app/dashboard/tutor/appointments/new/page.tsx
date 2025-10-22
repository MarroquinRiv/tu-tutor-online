"use client"

import { useState, useEffect } from "react"
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
import { createAppointment, searchStudents } from "@/lib/appointment-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const appointmentSchema = z.object({
  studentId: z.string().min(1, "Debes seleccionar un estudiante"),
  studentName: z.string().min(1, "El nombre es requerido"),
  subject: z.string().min(1, "La materia es requerida"),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
  duration: z.string().min(1, "Debes seleccionar la duración"),
  pricePerHour: z.string().min(1, "El precio es requerido"),
  notes: z.string().optional(),
  meetingLink: z.string().url("URL inválida").optional().or(z.literal("")),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedStudentId = searchParams.get("studentId")
  
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      studentId: preselectedStudentId || "",
      studentName: "",
      subject: "",
      time: "10:00",
      duration: "1",
      pricePerHour: "20",
      notes: "",
      meetingLink: "",
    },
  })

  useEffect(() => {
    async function loadStudents() {
      try {
        const result = await searchStudents()
        if (result.students) {
          setStudents(result.students)
          
          // Si hay un estudiante preseleccionado, establecer su nombre
          if (preselectedStudentId) {
            const student = result.students.find(s => s.user_id === preselectedStudentId)
            if (student) {
              form.setValue("studentId", student.user_id)
              form.setValue("studentName", `${student.nombre} ${student.apellido}`)
            }
          }
        }
      } catch (error) {
        console.error("Error loading students:", error)
      } finally {
        setLoadingStudents(false)
      }
    }

    loadStudents()
  }, [preselectedStudentId])

  const onSubmit = async (values: AppointmentFormValues) => {
    setLoading(true)
    try {
      // Combinar fecha y hora
      const dateTime = new Date(values.date)
      const [hours, minutes] = values.time.split(":")
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const result = await createAppointment({
        studentId: values.studentId,
        studentName: values.studentName,
        subject: values.subject,
        dateTime: dateTime.toISOString(),
        duration: parseFloat(values.duration),
        pricePerHour: parseFloat(values.pricePerHour),
        notes: values.notes,
        meetingLink: values.meetingLink || undefined,
      })

      if (result.success) {
        toast.success("Cita creada exitosamente")
        router.push("/dashboard/tutor/appointments")
      } else {
        toast.error(result.error || "Error al crear la cita")
      }
    } catch (error) {
      toast.error("Error al crear la cita")
    } finally {
      setLoading(false)
    }
  }

  const selectedStudent = form.watch("studentId")

  useEffect(() => {
    if (selectedStudent && !preselectedStudentId) {
      const student = students.find(s => s.user_id === selectedStudent)
      if (student) {
        form.setValue("studentName", `${student.nombre} ${student.apellido}`)
      }
    }
  }, [selectedStudent, students, preselectedStudentId])

  if (loadingStudents) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando estudiantes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Cita</h1>
        <p className="text-muted-foreground">
          Programa una nueva sesión con un estudiante
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
              {/* Student Selection */}
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estudiante</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!!preselectedStudentId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estudiante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.user_id} value={student.user_id}>
                            {student.nombre} {student.apellido} - {student.nivel_educativo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Duration and Price */}
              <div className="grid gap-4 md:grid-cols-2">
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

                <FormField
                  control={form.control}
                  name="pricePerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio por hora ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="20.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Total: ${(parseFloat(field.value || "0") * parseFloat(form.watch("duration") || "0")).toFixed(2)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        placeholder="Temas a revisar, objetivos de la sesión, etc."
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
                  className="flex-1"
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
