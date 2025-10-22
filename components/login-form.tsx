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
import { login } from "@/lib/auth-actions"
import { toast } from "sonner"
import SignInWithGoogleButton from "./SignInWithGoogleButton"

export function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.error) {
        toast.error("Error al iniciar sesión", {
          description: result.error,
        })
      } else {
        toast.success("¡Inicio de sesión exitoso!", {
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
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
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
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continuar con
              </span>
            </div>
          </div>

          <SignInWithGoogleButton />
          
          <div className="text-sm text-center text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              Regístrate
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
