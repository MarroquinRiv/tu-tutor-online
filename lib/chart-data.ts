// Función para generar datos suaves con tendencia
function generateData(days: number, baseValue: number, variance: number) {
  const data = []
  let currentValue = baseValue
  
  for (let i = 0; i < days; i++) {
    // Pequeñas variaciones suaves
    const change = (Math.random() - 0.5) * variance
    currentValue = Math.max(0, currentValue + change)
    data.push(Math.round(currentValue))
  }
  
  return data
}

// Generar fechas hacia atrás desde hoy
function generateDates(days: number) {
  const dates = []
  const today = new Date(2025, 9, 22) // Oct 22, 2025
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date)
  }
  
  return dates
}

// Formatear fecha para el eje X
function formatDate(date: Date, isShort: boolean = false) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = date.getDate()
  return `${month} ${day}`
}

// Datos para 7 días
const values7Days = [8, 5, 12, 6, 10, 4, 9]
const dates7Days = generateDates(7)
export const CHART_DATA_7_DAYS = dates7Days.map((date, i) => ({
  date: formatDate(date),
  sessions: values7Days[i],
}))

// Datos para 30 días
const values30Days = generateData(30, 8, 4)
const dates30Days = generateDates(30)
export const CHART_DATA_30_DAYS = dates30Days.map((date, i) => ({
  date: formatDate(date),
  sessions: values30Days[i],
}))

// Datos para 90 días (3 meses)
const values90Days = generateData(90, 10, 5)
const dates90Days = generateDates(90)
export const CHART_DATA_90_DAYS = dates90Days.map((date, i) => ({
  date: formatDate(date),
  sessions: values90Days[i],
}))

export type TimeRange = '7d' | '30d' | '90d'

export interface ChartDataPoint {
  date: string
  sessions: number
}
