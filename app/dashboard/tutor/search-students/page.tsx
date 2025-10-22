"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { searchStudents } from "@/lib/appointment-actions"
import { Search, Calendar, User } from "lucide-react"

interface StudentProfile {
  user_id: string
  nombre: string
  apellido: string
  nivel_educativo: string
  edad: number
  areas_interes: string[]
  objetivo_aprendizaje: string
  avatar_url?: string
}

const areasOptions = [
  "Matemáticas",
  "Ciencias",
  "Lenguaje",
  "Historia",
  "Idiomas",
  "Arte",
  "Música",
  "Deportes",
  "Tecnología",
]

const nivelOptions = [
  "Primaria",
  "Secundaria",
  "Preparatoria",
  "Universidad",
  "Posgrado",
]

export default function SearchStudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNivel, setSelectedNivel] = useState<string>("")
  const [selectedEdad, setSelectedEdad] = useState<string>("")
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const result = await searchStudents()
      if (result.students) {
        setStudents(result.students)
        setFilteredStudents(result.students)
      }
    } catch (error) {
      console.error("Error loading students:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...students]

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.apellido.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por nivel educativo
    if (selectedNivel) {
      filtered = filtered.filter((student) => student.nivel_educativo === selectedNivel)
    }

    // Filtro por edad
    if (selectedEdad) {
      filtered = filtered.filter((student) => student.edad === parseInt(selectedEdad))
    }

    // Filtro por áreas de interés
    if (selectedAreas.length > 0) {
      filtered = filtered.filter((student) =>
        selectedAreas.some((area) => student.areas_interes.includes(area))
      )
    }

    setFilteredStudents(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedNivel, selectedEdad, selectedAreas, students])

  const handleAreaToggle = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedNivel("")
    setSelectedEdad("")
    setSelectedAreas([])
  }

  const handleScheduleSession = (studentId: string) => {
    router.push(`/dashboard/tutor/appointments/new?studentId=${studentId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando estudiantes...</p>
        </div>
      </div>
    )
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

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Filters Sidebar */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refina tu búsqueda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search by name */}
            <div className="space-y-2">
              <Label>Buscar por nombre</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre del estudiante"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Nivel educativo */}
            <div className="space-y-2">
              <Label>Nivel Educativo</Label>
              <Select value={selectedNivel} onValueChange={setSelectedNivel}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  {nivelOptions.map((nivel) => (
                    <SelectItem key={nivel} value={nivel}>
                      {nivel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Edad */}
            <div className="space-y-2">
              <Label>Edad</Label>
              <Input
                type="number"
                placeholder="Edad del estudiante"
                value={selectedEdad}
                onChange={(e) => setSelectedEdad(e.target.value)}
                min="5"
                max="100"
              />
            </div>

            {/* Áreas de interés */}
            <div className="space-y-2">
              <Label>Áreas de Interés</Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {areasOptions.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={selectedAreas.includes(area)}
                      onCheckedChange={() => handleAreaToggle(area)}
                    />
                    <label
                      htmlFor={area}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear filters button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFilters}
            >
              Limpiar Filtros
            </Button>
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
                  Intenta ajustar los filtros para encontrar más resultados
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredStudents.map((student) => (
                <Card key={student.user_id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback>
                          {student.nombre[0]}
                          {student.apellido[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {student.nombre} {student.apellido}
                        </CardTitle>
                        <CardDescription>
                          {student.nivel_educativo} • {student.edad} años
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Áreas de Interés</p>
                      <div className="flex flex-wrap gap-2">
                        {student.areas_interes.map((area) => (
                          <Badge key={area} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {student.objetivo_aprendizaje && (
                      <div>
                        <p className="text-sm font-medium mb-1">Objetivo</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {student.objetivo_aprendizaje}
                        </p>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={() => handleScheduleSession(student.user_id)}
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
    </div>
  )
}
