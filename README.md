# 📚 Tu Tutor Online

Plataforma web moderna para conectar estudiantes con tutores, facilitando la gestión de sesiones educativas y el seguimiento del progreso académico.

## 🚀 Características Principales

### Sistema de Roles Dual
- **Dashboard de Estudiantes** - Interfaz con tema morado para gestionar sesiones y buscar tutores
- **Dashboard de Tutores** - Interfaz con tema azul para administrar estudiantes y citas
- Autenticación segura y selección de rol al registro

### Gestión de Citas
- Creación y programación de sesiones educativas
- Sistema de estados (programada, completada, cancelada)
- Calendario interactivo con selección de fechas y horarios
- Enlaces para reuniones virtuales (Zoom, Google Meet)

### Búsqueda de Tutores
- Filtrado por materias y especialización
- Visualización de disponibilidad y experiencia
- Sistema de agendamiento directo desde el perfil del tutor

### Análisis y Reportes
- Gráficas interactivas de horas de estudio (7 días, 30 días, 90 días)
- Métricas de progreso y actividad
- Exportación de reportes en PDF
- Visualización de estadísticas en tiempo real

### Perfiles Personalizados
- Perfiles de estudiante (nivel educativo, áreas de interés, objetivos)
- Perfiles de tutor (experiencia, especialización, disponibilidad)
- Gestión de información personal

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 16](https://nextjs.org/) con App Router y Turbopack
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Autenticación:** [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Base de Datos:** [Supabase PostgreSQL](https://supabase.com/)
- **Formularios:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Gráficas:** [Recharts](https://recharts.org/)
- **PDF:** [jsPDF](https://github.com/parallax/jsPDF) + jsPDF-AutoTable
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Temas:** [next-themes](https://github.com/pacocoursey/next-themes)

## 📋 Requisitos Previos

- Node.js 20 o superior
- npm, yarn, pnpm o bun
- Cuenta de Supabase (para autenticación y base de datos)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/MarroquinRiv/tu-tutor-online.git
   cd tu-tutor-online/my-next-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Configurar la base de datos**
   
   Ejecuta las siguientes tablas en tu proyecto de Supabase:

   ```sql
   -- Tabla de roles de usuario
   CREATE TABLE user_roles (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     role TEXT NOT NULL CHECK (role IN ('tutor', 'estudiante')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id)
   );

   -- Tabla de perfiles de estudiantes
   CREATE TABLE student_profiles (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     nivel_educativo TEXT,
     edad INTEGER,
     areas_interes TEXT[],
     objetivo_aprendizaje TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id)
   );

   -- Tabla de perfiles de tutores
   CREATE TABLE tutor_profiles (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     nivel_experiencia TEXT NOT NULL,
     temas_especializacion TEXT[],
     disponibilidad_semanal TEXT[],
     presentacion TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id)
   );
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   
   Navega a [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
my-next-app/
├── app/                          # App Router de Next.js
│   ├── dashboard/                # Rutas del dashboard
│   │   ├── student/              # Dashboard de estudiantes (tema morado)
│   │   │   ├── appointments/     # Gestión de citas
│   │   │   ├── search-tutors/    # Búsqueda de tutores
│   │   │   └── page.tsx          # Dashboard principal
│   │   ├── tutor/                # Dashboard de tutores (tema azul)
│   │   │   ├── appointments/     # Gestión de citas
│   │   │   ├── students/         # Lista de estudiantes
│   │   │   └── page.tsx          # Dashboard principal
│   │   ├── select-role/          # Selección de rol
│   │   ├── student-form/         # Formulario de perfil estudiante
│   │   ├── tutor-form/           # Formulario de perfil tutor
│   │   └── page.tsx              # Página de redirección
│   ├── auth/                     # Autenticación
│   │   └── confirm/              # Confirmación de email
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes de shadcn/ui
│   ├── student-sidebar.tsx       # Sidebar del estudiante
│   ├── student-header.tsx        # Header del estudiante
│   ├── tutor-sidebar.tsx         # Sidebar del tutor
│   └── theme-toggle.tsx          # Switch de tema claro/oscuro
├── lib/                          # Utilidades y configuración
│   ├── mock-tutors.ts            # Datos de prueba de tutores
│   ├── student-chart-data.ts     # Datos para gráficas
│   ├── role-actions.ts           # Acciones de roles
│   ├── profile-actions.ts        # Acciones de perfiles
│   └── utils.ts                  # Utilidades generales
├── utils/                        # Configuración de servicios
│   └── supabase/                 # Cliente de Supabase
└── public/                       # Archivos estáticos
```

## 🎨 Temas y Diseño

### Modo Claro/Oscuro
La aplicación soporta cambio dinámico entre tema claro y oscuro mediante `next-themes`, manteniendo la preferencia del usuario.

### Identidad Visual por Rol
- **Estudiantes:** Tema morado (`purple-600`) para una experiencia visual distintiva
- **Tutores:** Tema azul (`blue-600`) para diferenciación clara de interfaces

## 🔐 Autenticación y Seguridad

- Autenticación mediante Supabase Auth (email/password)
- Verificación de email obligatoria
- Rutas protegidas con middleware
- Validación de roles en cada página
- Server Components para verificación segura de sesiones

## 📊 Funcionalidades Destacadas

### Para Estudiantes
- Dashboard con métricas de progreso
- Búsqueda y filtrado de tutores por materia
- Agendamiento de sesiones
- Exportación de reportes de citas en PDF
- Visualización de horas de estudio con gráficas interactivas

### Para Tutores
- Dashboard con estadísticas de estudiantes
- Gestión de citas y horarios
- Lista de estudiantes activos
- Exportación de reportes de sesiones
- Calendario de disponibilidad

## 🚀 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter
```

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en Vercel
3. Vercel detectará automáticamente Next.js y desplegará

### Otros Servicios
La aplicación puede desplegarse en cualquier servicio que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker

## 📝 Notas de Desarrollo

- Las citas se almacenan actualmente en `localStorage` para desarrollo
- Los datos de tutores son mock data para demostración
- La aplicación usa Turbopack para compilación más rápida en desarrollo

## 🔄 Próximas Características

- [ ] Integración con calendar API para sincronización
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre estudiantes y tutores
- [ ] Sistema de calificaciones y reseñas
- [ ] Panel administrativo
- [ ] Pagos integrados

---

Desarrollado con ❤️ usando Next.js y Supabase
