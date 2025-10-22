"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  CHART_DATA_7_DAYS, 
  CHART_DATA_30_DAYS, 
  CHART_DATA_90_DAYS,
  type TimeRange,
  type ChartDataPoint 
} from "@/lib/chart-data"

// Datos ficticios para métricas
const MOCK_STATS = {
  newStudentsThisWeek: 5,
  completedSessionsThisWeek: 8,
  earningsThisMonth: 1280,
}

// Datos ficticios para próximas citas
const upcomingAppointments = [
  {
    id: "1",
    student_name: "Ana López",
    subject: "Matemáticas",
    date_time: new Date(2025, 9, 23, 10, 0).toISOString(),
    duration: 1,
    total_price: 20,
    status: "programada",
  },
  {
    id: "2",
    student_name: "Carlos Ramírez",
    subject: "Programación",
    date_time: new Date(2025, 9, 23, 15, 30).toISOString(),
    duration: 1.5,
    total_price: 30,
    status: "programada",
  },
  {
    id: "3",
    student_name: "María González",
    subject: "Inglés",
    date_time: new Date(2025, 9, 24, 11, 0).toISOString(),
    duration: 1,
    total_price: 20,
    status: "programada",
  },
]

const TIME_RANGES = [
  { value: '7d' as TimeRange, label: 'Last 7 days', data: CHART_DATA_7_DAYS },
  { value: '30d' as TimeRange, label: 'Last 30 days', data: CHART_DATA_30_DAYS },
  { value: '90d' as TimeRange, label: 'Last 3 months', data: CHART_DATA_90_DAYS },
]

export default function TutorDashboardPage() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('30d')
  
  const currentRangeData = TIME_RANGES.find(r => r.value === selectedRange)
  const chartData = currentRangeData?.data || CHART_DATA_30_DAYS
  const rangeLabel = currentRangeData?.label.toLowerCase() || 'last 30 days'

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      programada: "default",
      completada: "secondary",
      cancelada: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de tutor
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.newStudentsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sesiones Completadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.completedSessionsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${MOCK_STATS.earningsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Area Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sesiones Completadas</CardTitle>
              <CardDescription className="mt-1">
                Total for the {rangeLabel}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range.value}
                  variant={selectedRange === range.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange(range.value)}
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted" 
                vertical={false}
              />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                interval={selectedRange === '90d' ? 14 : selectedRange === '30d' ? 4 : 0}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Fecha
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.date}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Sesiones
                            </span>
                            <span className="font-bold">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorSessions)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Citas</CardTitle>
          <CardDescription>
            Tus próximas sesiones programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {appointment.student_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.student_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(new Date(appointment.date_time), "PPp", { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.duration}h - ${appointment.total_price}
                    </p>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
