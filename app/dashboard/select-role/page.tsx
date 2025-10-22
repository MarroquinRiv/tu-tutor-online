"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { saveUserRole } from "@/lib/role-actions"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SelectRolePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = async (role: "tutor" | "estudiante") => {
    setIsLoading(true)
    setSelectedRole(role)

    try {
      const result = await saveUserRole(role)

      if (result.error) {
        toast.error("Error al guardar el rol", {
          description: result.error,
        })
        setIsLoading(false)
        setSelectedRole(null)
        return
      }

      toast.success("¡Rol seleccionado!", {
        description: `Has seleccionado el rol de ${role}.`,
      })

      // Redirigir según el rol seleccionado
      setTimeout(() => {
        if (role === "tutor") {
          router.push("/dashboard/tutor-form")
        } else {
          router.push("/dashboard/student-form")
        }
      }, 1000)
    } catch (error) {
      toast.error("Error inesperado", {
        description: "Por favor, intenta de nuevo.",
      })
      setIsLoading(false)
      setSelectedRole(null)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-4">
      {/* Botón de cambio de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl w-full space-y-8">
        {/* Título y descripción */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            ¡Bienvenido! 
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Para comenzar, necesitamos saber qué tipo de usuario eres. Selecciona una de las siguientes opciones:
          </p>
        </div>

        {/* Cards con los roles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Card Estudiante */}
          <Card
            className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 ${
              selectedRole === "estudiante"
                ? "border-primary scale-105"
                : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50"
            } ${isLoading && selectedRole !== "estudiante" ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isLoading && handleRoleSelect("estudiante")}
          >
            <CardContent className="p-6 space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src="/student.gif"
                  alt="Estudiante"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Estudiante
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Quiero aprender y encontrar tutores que me ayuden a mejorar mis habilidades
                </p>
              </div>
              {selectedRole === "estudiante" && isLoading && (
                <div className="flex items-center justify-center pt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card Tutor */}
          <Card
            className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 ${
              selectedRole === "tutor"
                ? "border-primary scale-105"
                : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50"
            } ${isLoading && selectedRole !== "tutor" ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isLoading && handleRoleSelect("tutor")}
          >
            <CardContent className="p-6 space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src="/teacher.gif"
                  alt="Tutor"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Tutor
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Quiero enseñar y compartir mis conocimientos con estudiantes que necesiten mi ayuda
                </p>
              </div>
              {selectedRole === "tutor" && isLoading && (
                <div className="flex items-center justify-center pt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Nota adicional */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
          💡 No te preocupes, podrás cambiar tu rol más adelante si lo necesitas
        </p>
      </div>
    </div>
  )
}
