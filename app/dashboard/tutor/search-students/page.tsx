"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, User } from "lucide-react"
import { MOCK_STUDENTS, INTEREST_OPTIONS, type MockStudent } from "@/lib/mock-students"

export default function SearchStudentsPage() {
  const router = useRouter()
  const [selectedInterest, setSelectedInterest] = useState<string>("all")

  // Filtrar estudiantes por tema de interés
  const filteredStudents = selectedInterest === "all"
    ? MOCK_STUDENTS
    : MOCK_STUDENTS.filter((student) => student.interests.includes(selectedInterest))

  const handleScheduleSession = (studentId: string) => {
    router.push(`/dashboard/tutor/appointments/new?studentId=${studentId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buscar Estudiantes</h1>
        <p className="text-muted-foreground">
          Encuentra estudiantes que se ajusten a tus áreas de especialización
        </p>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra estudiantes por tema de interés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Tema de Interés</Label>
            <div className="flex gap-4">
              <Select value={selectedInterest} onValueChange={setSelectedInterest}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Todos los temas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los temas</SelectItem>
                  {INTEREST_OPTIONS.map((interest) => (
                    <SelectItem key={interest} value={interest}>
                      {interest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedInterest !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedInterest("all")}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredStudents.length} estudiante(s) encontrado(s)
          </p>
        </div>

        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No se encontraron estudiantes</h3>
              <p className="text-muted-foreground text-center">
                Intenta seleccionar otro tema de interés
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>
                        {student.educationLevel} • {student.age} años
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Áreas de Interés</p>
                    <div className="flex flex-wrap gap-2">
                      {student.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleScheduleSession(student.id)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Sesión
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
