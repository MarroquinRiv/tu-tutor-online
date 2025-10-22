export interface MockStudent {
  id: string
  name: string
  age: number
  educationLevel: "Primaria" | "Secundaria" | "Preparatoria/Bachillerato" | "Universidad"
  interests: string[]
}

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: "1",
    name: "Ana López",
    age: 16,
    educationLevel: "Preparatoria/Bachillerato",
    interests: ["Matemáticas", "Física"],
  },
  {
    id: "2",
    name: "Carlos Ramírez",
    age: 14,
    educationLevel: "Secundaria",
    interests: ["Programación", "Tecnología", "Matemáticas"],
  },
  {
    id: "3",
    name: "María González",
    age: 20,
    educationLevel: "Universidad",
    interests: ["Idiomas", "Historia", "Arte"],
  },
  {
    id: "4",
    name: "Luis Hernández",
    age: 12,
    educationLevel: "Primaria",
    interests: ["Ciencias", "Matemáticas", "Deportes"],
  },
  {
    id: "5",
    name: "Sofía Martínez",
    age: 17,
    educationLevel: "Preparatoria/Bachillerato",
    interests: ["Lenguaje", "Literatura", "Historia"],
  },
  {
    id: "6",
    name: "Diego Torres",
    age: 15,
    educationLevel: "Secundaria",
    interests: ["Programación", "Matemáticas", "Tecnología"],
  },
  {
    id: "7",
    name: "Valentina Flores",
    age: 19,
    educationLevel: "Universidad",
    interests: ["Arte", "Música", "Idiomas"],
  },
  {
    id: "8",
    name: "Mateo Sánchez",
    age: 13,
    educationLevel: "Secundaria",
    interests: ["Ciencias", "Física", "Matemáticas"],
  },
  {
    id: "9",
    name: "Isabella Morales",
    age: 11,
    educationLevel: "Primaria",
    interests: ["Lenguaje", "Arte", "Música"],
  },
  {
    id: "10",
    name: "Santiago Ruiz",
    age: 18,
    educationLevel: "Preparatoria/Bachillerato",
    interests: ["Historia", "Ciencias", "Deportes"],
  },
]

export const INTEREST_OPTIONS = [
  "Matemáticas",
  "Ciencias",
  "Lenguaje",
  "Historia",
  "Idiomas",
  "Arte",
  "Música",
  "Deportes",
  "Tecnología",
  "Programación",
  "Física",
  "Literatura",
]
