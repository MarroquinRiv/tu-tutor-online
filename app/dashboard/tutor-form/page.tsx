"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { saveTutorProfile } from "@/lib/profile-actions"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

const TEMAS_ESPECIALIZACION = [
  "Matemáticas",
  "Física",
  "Química",
  "Biología",
  "Historia",
  "Literatura",
  "Inglés",
  "Español",
  "Programación (Python, JS, etc.)",
  "Preparación para exámenes (SAT, PAES, etc.)",
  "Tutoría emocional/académica",
]

const DISPONIBILIDAD = [
  "Mañanas",
  "Tardes",
  "Noches",
  "Fines de semana",
]

const formSchema = z.object({
  nivelExperiencia: z.string().min(1, "Selecciona tu nivel de experiencia"),
  temasEspecializacion: z.array(z.string()).min(1, "Selecciona al menos un tema de especialización"),
  disponibilidadSemanal: z.array(z.string()).min(1, "Selecciona al menos un horario disponible"),
  presentacion: z.string()
    .min(20, "La presentación debe tener al menos 20 caracteres")
    .max(300, "La presentación no puede exceder 300 caracteres"),
})

export default function TutorFormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nivelExperiencia: "",
      temasEspecializacion: [],
      disponibilidadSemanal: [],
      presentacion: "",
    },
  })

  const presentacionLength = form.watch("presentacion")?.length || 0

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await saveTutorProfile(values)

      if (result.error) {
        toast.error("Error al guardar el perfil", {
          description: result.error,
        })
      } else {
        toast.success("¡Perfil guardado exitosamente!", {
          description: "Redirigiendo a tu dashboard...",
        })
        setTimeout(() => {
          router.push("/dashboard/tutor-dashboard")
        }, 1500)
      }
    } catch (error) {
      toast.error("Error inesperado", {
        description: "Por favor, intenta de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 p-4 py-12">
      {/* Botón de cambio de tema */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Perfil de Tutor</CardTitle>
          <CardDescription>
            Completa tu perfil para que los estudiantes puedan encontrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nivel de Experiencia */}
              <FormField
                control={form.control}
                name="nivelExperiencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de Experiencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Principiante (0–1 año)">Principiante (0–1 año)</SelectItem>
                        <SelectItem value="Intermedio (1–3 años)">Intermedio (1–3 años)</SelectItem>
                        <SelectItem value="Avanzado (3+ años)">Avanzado (3+ años)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Temas de Especialización */}
              <FormField
                control={form.control}
                name="temasEspecializacion"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Temas de Especialización</FormLabel>
                      <FormDescription>
                        Selecciona los temas en los que puedes enseñar
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {TEMAS_ESPECIALIZACION.map((tema) => (
                        <FormField
                          key={tema}
                          control={form.control}
                          name="temasEspecializacion"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tema}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tema)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, tema])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== tema
                                            )
                                          )
                                    }}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {tema}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Disponibilidad Semanal */}
              <FormField
                control={form.control}
                name="disponibilidadSemanal"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Disponibilidad Semanal</FormLabel>
                      <FormDescription>
                        ¿Cuándo estás disponible para dar clases?
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {DISPONIBILIDAD.map((horario) => (
                        <FormField
                          key={horario}
                          control={form.control}
                          name="disponibilidadSemanal"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={horario}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(horario)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, horario])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== horario
                                            )
                                          )
                                    }}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {horario}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Presentación */}
              <FormField
                control={form.control}
                name="presentacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breve Presentación</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cuéntanos sobre ti, tu experiencia y por qué te gusta enseñar..."
                        className="resize-none"
                        rows={5}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {presentacionLength}/300 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Completar Registro"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
