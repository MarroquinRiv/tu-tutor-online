"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signup } from "@/lib/auth-actions"
import { toast } from "sonner"

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signup(name, email, password)

      if (result.error) {
        toast.error("Error al registrarse", {
          description: result.error,
        })
      } else if (result.needsEmailConfirmation) {
        toast.success("¡Registro exitoso!", {
          description: "Por favor, verifica tu correo electrónico para confirmar tu cuenta.",
          duration: 6000,
        })
        // Limpiar el formulario
        setName("")
        setEmail("")
        setPassword("")
        // Opcional: cambiar al formulario de login después de un momento
        setTimeout(() => {
          onSwitchToLogin()
        }, 3000)
      } else {
        toast.success("¡Registro exitoso!", {
          description: "Redirigiendo al dashboard...",
        })
        router.push("/dashboard")
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
    <Card className="w-full lg:w-1/2 max-w-md">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>
          Completa el formulario para registrarte
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Correo Electrónico</Label>
            <Input
              id="register-email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Contraseña</Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 6 caracteres
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              Inicia sesión
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
