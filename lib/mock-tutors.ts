export interface Tutor {
  id: string
  name: string
  experience: "Principiante" | "Intermedio" | "Avanzado"
  subjects: string[]
  availability: string[]
}

export const MOCK_TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Prof. Ramírez",
    experience: "Avanzado",
    subjects: ["Matemáticas", "Estadística"],
    availability: ["Mañanas", "Tardes"],
  },
  {
    id: "2",
    name: "Prof. García",
    experience: "Intermedio",
    subjects: ["Física", "Química"],
    availability: ["Tardes", "Noches"],
  },
  {
    id: "3",
    name: "Prof. López",
    experience: "Avanzado",
    subjects: ["Programación", "Algoritmos"],
    availability: ["Fines de semana"],
  },
  {
    id: "4",
    name: "Prof. Martínez",
    experience: "Principiante",
    subjects: ["Inglés", "Literatura"],
    availability: ["Mañanas"],
  },
  {
    id: "5",
    name: "Prof. Hernández",
    experience: "Avanzado",
    subjects: ["Matemáticas", "Física", "Programación"],
    availability: ["Mañanas", "Tardes", "Noches"],
  },
  {
    id: "6",
    name: "Prof. González",
    experience: "Intermedio",
    subjects: ["Historia", "Geografía"],
    availability: ["Tardes"],
  },
  {
    id: "7",
    name: "Prof. Sánchez",
    experience: "Avanzado",
    subjects: ["Química", "Biología"],
    availability: ["Mañanas", "Fines de semana"],
  },
  {
    id: "8",
    name: "Prof. Torres",
    experience: "Intermedio",
    subjects: ["Programación", "Bases de datos"],
    availability: ["Noches", "Fines de semana"],
  },
  {
    id: "9",
    name: "Prof. Flores",
    experience: "Principiante",
    subjects: ["Matemáticas", "Geometría"],
    availability: ["Tardes"],
  },
  {
    id: "10",
    name: "Prof. Morales",
    experience: "Avanzado",
    subjects: ["Inglés", "Francés", "Alemán"],
    availability: ["Mañanas", "Tardes"],
  },
]

export const ALL_SUBJECTS = [
  "Matemáticas",
  "Física",
  "Química",
  "Programación",
  "Inglés",
  "Historia",
  "Biología",
  "Literatura",
  "Estadística",
  "Algoritmos",
  "Geografía",
  "Bases de datos",
  "Geometría",
  "Francés",
  "Alemán",
]
