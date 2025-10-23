"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Star, Calendar } from "lucide-react"
import { MOCK_TEACHERS, getAllSubjects } from "@/lib/mock-teachers"
import { useRouter } from "next/navigation"

export default function SearchTeachersPage() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const allSubjects = getAllSubjects()

  // Filtrar maestros por materia seleccionada y búsqueda
  const filteredTeachers = MOCK_TEACHERS.filter((teacher) => {
    const matchesSubject =
      selectedSubject === "all" || teacher.subjects.includes(selectedSubject)
    const matchesSearch =
      searchQuery === "" ||
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesSubject && matchesSearch
  })

  const getExperienceBadgeVariant = (level: string) => {
    switch (level) {
      case "Avanzado":
        return "default"
      case "Intermedio":
        return "secondary"
      case "Principiante":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buscar Maestros</h1>
        <p className="text-muted-foreground">
          Encuentra el maestro perfecto para tus necesidades
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Refina tu búsqueda por materia o nombre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar por nombre</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre del maestro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Filtrar por materia</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {allSubjects.map((subject) => (
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
            {filteredTeachers.length} maestro{filteredTeachers.length !== 1 ? "s" : ""} encontrado
            {filteredTeachers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredTeachers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron maestros
              </h3>
              <p className="text-muted-foreground text-center">
                Intenta ajustar tus filtros de búsqueda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{teacher.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{teacher.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Nivel de experiencia</p>
                    <Badge variant={getExperienceBadgeVariant(teacher.experienceLevel)}>
                      {teacher.experienceLevel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Materias</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Disponibilidad</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.availability.join(", ")}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/dashboard/student/appointments/new?teacherId=${teacher.id}`
                      )
                    }
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar sesión
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
