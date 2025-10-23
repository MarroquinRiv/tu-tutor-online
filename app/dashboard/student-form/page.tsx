"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { saveStudentProfile } from "@/lib/profile-actions"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

const AREAS_INTERES = [
  "Matemáticas",
  "Ciencias",
  "Lenguaje/Literatura",
  "Historia",
  "Idiomas",
  "Programación",
  "Arte",
]

const formSchema = z.object({
  nivelEducativo: z.string().optional(),
  edad: z.coerce.number().min(6, "La edad mínima es 6 años").max(100, "La edad máxima es 100 años").optional().or(z.literal("")),
  areasInteres: z.array(z.string()).min(1, "Selecciona al menos un área de interés"),
  objetivoAprendizaje: z.string().min(10, "Describe brevemente tu objetivo (mínimo 10 caracteres)").max(500, "Máximo 500 caracteres"),
})

export default function StudentFormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nivelEducativo: "",
      edad: undefined,
      areasInteres: [],
      objetivoAprendizaje: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await saveStudentProfile({
        nivelEducativo: values.nivelEducativo,
        edad: values.edad ? Number(values.edad) : undefined,
        areasInteres: values.areasInteres,
        objetivoAprendizaje: values.objetivoAprendizaje,
      })

      if (result.error) {
        toast.error("Error al guardar el perfil", {
          description: result.error,
        })
      } else {
        toast.success("¡Perfil guardado exitosamente!", {
          description: "Redirigiendo a tu dashboard...",
        })
        setTimeout(() => {
          router.push("/dashboard/student")
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
    <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 p-4">
      {/* Botón de cambio de tema */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Perfil de Estudiante</CardTitle>
          <CardDescription>
            Completa tu perfil para que los tutores puedan conocerte mejor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nivel Educativo */}
              <FormField
                control={form.control}
                name="nivelEducativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel Educativo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel educativo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Primaria">Primaria</SelectItem>
                        <SelectItem value="Secundaria">Secundaria</SelectItem>
                        <SelectItem value="Preparatoria/Bachillerato">Preparatoria/Bachillerato</SelectItem>
                        <SelectItem value="Universidad">Universidad</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Edad */}
              <FormField
                control={form.control}
                name="edad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 15"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Entre 6 y 100 años
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Áreas de Interés */}
              <FormField
                control={form.control}
                name="areasInteres"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Áreas de Interés</FormLabel>
                      <FormDescription>
                        Selecciona las áreas en las que quieres mejorar
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {AREAS_INTERES.map((area) => (
                        <FormField
                          key={area}
                          control={form.control}
                          name="areasInteres"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={area}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, area])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== area
                                            )
                                          )
                                    }}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {area}
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

              {/* Objetivo de Aprendizaje */}
              <FormField
                control={form.control}
                name="objetivoAprendizaje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo de Aprendizaje</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe qué quieres aprender o mejorar..."
                        className="resize-none"
                        rows={4}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 10 caracteres, máximo 500
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
