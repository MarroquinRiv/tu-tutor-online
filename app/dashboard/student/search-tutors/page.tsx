"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import { MOCK_TUTORS, ALL_SUBJECTS } from "@/lib/mock-tutors"

export default function SearchTutorsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const router = useRouter()

  const filteredTutors = selectedSubject === "all"
    ? MOCK_TUTORS
    : MOCK_TUTORS.filter((tutor) =>
        tutor.subjects.includes(selectedSubject)
      )

  const getExperienceBadgeVariant = (experience: string) => {
    switch (experience) {
      case "Avanzado":
        return "default" as const
      case "Intermedio":
        return "secondary" as const
      case "Principiante":
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  const getExperienceBadgeClass = (experience: string) => {
    if (experience === "Avanzado") {
      return "bg-purple-600 hover:bg-purple-700 text-white"
    }
    return ""
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buscar Tutores</h1>
        <p className="text-muted-foreground">
          Encuentra el tutor perfecto para tus necesidades
        </p>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra tutores por materia de interés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Materia
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {ALL_SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredTutors.length} {filteredTutors.length === 1 ? "tutor encontrado" : "tutores encontrados"}
          </p>
        </div>

        {filteredTutors.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No hay tutores</h3>
                <p className="text-muted-foreground">
                  No se encontraron tutores para esta materia
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutors.map((tutor) => (
              <Card key={tutor.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {tutor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{tutor.name}</CardTitle>
                        <Badge
                          variant={getExperienceBadgeVariant(tutor.experience)}
                          className={`mt-1 ${getExperienceBadgeClass(tutor.experience)}`}
                        >
                          {tutor.experience}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Materias:</p>
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Disponibilidad:</p>
                      <div className="flex flex-wrap gap-1">
                        {tutor.availability.map((time) => (
                          <Badge key={time} variant="outline">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() =>
                      router.push(
                        `/dashboard/student/appointments/new?tutorId=${tutor.id}`
                      )
                    }
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Sesión
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
