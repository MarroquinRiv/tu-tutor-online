"use client"

import { useState } from "react"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

export function AuthForms() {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl">
      {/* GIF a la izquierda - visible en ambos formularios */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="relative w-full aspect-square max-w-md mx-auto">
          <Image
            src="/gif-tutor-online.gif"
            alt="Tutor Online"
            fill
            className="object-contain rounded-lg"
            unoptimized
          />
        </div>
      </div>

      {/* Formularios a la derecha - alterna entre login y registro */}
      {showLogin ? (
        <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  )
}
