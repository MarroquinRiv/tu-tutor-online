"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function TutorHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end px-6 lg:px-8">
        <ThemeToggle />
      </div>
    </header>
  )
}
