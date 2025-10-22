"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import React, { useState } from "react";
import { toast } from "sonner";

const SignInWithGoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error("Error al iniciar sesión con Google", {
        description: "Por favor, intenta de nuevo.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? "Redirigiendo..." : "Iniciar sesión con Google"}
    </Button>
  );
};

export default SignInWithGoogleButton;