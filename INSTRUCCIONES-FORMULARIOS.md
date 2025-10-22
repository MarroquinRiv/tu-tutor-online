# Formularios de Perfil - Estudiantes y Tutores

## 📋 Instrucciones para Configurar la Base de Datos

### Paso 1: Ejecutar el SQL en Supabase

1. Ve a tu proyecto de Supabase: https://uzgbayfalkdilmbtrsjb.supabase.co
2. En el menú lateral, haz clic en **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido del archivo `supabase-profiles.sql`
5. Haz clic en **Run** para ejecutar el script

Este script creará:
- Tabla `student_profiles` para perfiles de estudiantes
- Tabla `tutor_profiles` para perfiles de tutores
- Row Level Security (RLS) habilitado
- Políticas de seguridad apropiadas

### Paso 2: Verificar las Tablas

Después de ejecutar el SQL, verifica que existan:

**Tabla `student_profiles`:**
- `id` (UUID)
- `user_id` (UUID, referencia a auth.users)
- `nivel_educativo` (VARCHAR)
- `edad` (INTEGER, opcional, 6-100)
- `areas_interes` (TEXT[], array)
- `objetivo_aprendizaje` (TEXT)
- `created_at` (TIMESTAMP)

**Tabla `tutor_profiles`:**
- `id` (UUID)
- `user_id` (UUID, referencia a auth.users)
- `nivel_experiencia` (VARCHAR)
- `temas_especializacion` (TEXT[], array)
- `disponibilidad_semanal` (TEXT[], array)
- `presentacion` (TEXT, máximo 300 caracteres)
- `created_at` (TIMESTAMP)

## 🎨 Componentes Creados

### Archivos Nuevos:

1. **`supabase-profiles.sql`** - Script SQL para crear las tablas
2. **`lib/profile-actions.ts`** - Acciones del servidor para guardar y obtener perfiles
3. **`app/dashboard/student-form/page.tsx`** - Formulario de estudiante
4. **`app/dashboard/tutor-form/page.tsx`** - Formulario de tutor
5. **`app/dashboard/student-dashboard/page.tsx`** - Dashboard de estudiante (temporal)
6. **`app/dashboard/tutor-dashboard/page.tsx`** - Dashboard de tutor (temporal)

### Archivos Modificados:

- **`app/dashboard/page.tsx`** - Ahora verifica si el usuario tiene perfil completado
- **`app/dashboard/select-role/page.tsx`** - Agregado botón de cambio de tema

## 📝 Formulario de Estudiante

### Campos:
- **Nivel Educativo** (Select, opcional)
  - Primaria
  - Secundaria
  - Preparatoria/Bachillerato
  - Universidad
  - Otro

- **Edad** (Input numérico, opcional)
  - Rango: 6-100 años

- **Áreas de Interés** (Checkboxes, mínimo 1)
  - Matemáticas
  - Ciencias
  - Lenguaje/Literatura
  - Historia
  - Idiomas
  - Programación
  - Arte

- **Objetivo de Aprendizaje** (Textarea, obligatorio)
  - Mínimo: 10 caracteres
  - Máximo: 500 caracteres

### Validación con Zod:
- Áreas de interés: al menos una seleccionada
- Objetivo: entre 10 y 500 caracteres
- Edad: si se ingresa, debe estar entre 6 y 100

## 📝 Formulario de Tutor

### Campos:
- **Nivel de Experiencia** (Select, obligatorio)
  - Principiante (0–1 año)
  - Intermedio (1–3 años)
  - Avanzado (3+ años)

- **Temas de Especialización** (Checkboxes, mínimo 1)
  - Matemáticas
  - Física
  - Química
  - Biología
  - Historia
  - Literatura
  - Inglés
  - Español
  - Programación (Python, JS, etc.)
  - Preparación para exámenes (SAT, PAES, etc.)
  - Tutoría emocional/académica

- **Disponibilidad Semanal** (Checkboxes, mínimo 1)
  - Mañanas
  - Tardes
  - Noches
  - Fines de semana

- **Breve Presentación** (Textarea, obligatorio)
  - Mínimo: 20 caracteres
  - Máximo: 300 caracteres
  - Contador de caracteres visible

### Validación con Zod:
- Nivel de experiencia: obligatorio
- Temas de especialización: al menos uno
- Disponibilidad: al menos un horario
- Presentación: entre 20 y 300 caracteres

## 🎯 Características de los Formularios

✅ **Componentes de shadcn/ui:** Form, FormField, Select, Checkbox, Textarea, Button, Card
✅ **Validación:** react-hook-form + zod
✅ **Estados de carga:** Botones y campos deshabilitados mientras se envía
✅ **Toast notifications:** Feedback visual de éxito/error
✅ **Responsive:** Diseño adaptable a móvil y escritorio
✅ **Botón de tema:** Cambio entre modo claro y oscuro
✅ **Protección:** Solo usuarios autenticados pueden acceder
✅ **Registro único:** No se puede cambiar una vez completado

## 🔄 Flujo de Usuario

### Usuario Nuevo:
1. Inicia sesión → `/dashboard`
2. No tiene rol → Redirige a `/dashboard/select-role`
3. Selecciona rol (tutor o estudiante)
4. Redirige al formulario correspondiente
5. Completa el formulario
6. Guarda en Supabase
7. Redirige al dashboard personalizado

### Usuario con Rol pero sin Perfil:
1. Inicia sesión → `/dashboard`
2. Tiene rol pero no perfil → Redirige al formulario
3. Completa el formulario
4. Redirige al dashboard

### Usuario con Perfil Completo:
1. Inicia sesión → `/dashboard`
2. Tiene rol y perfil → Redirige directamente al dashboard personalizado

## 🔒 Seguridad

- **RLS habilitado** en ambas tablas
- Usuarios solo pueden crear su propio perfil
- Usuarios solo pueden ver su propio perfil de estudiante
- **Los perfiles de tutores son públicos** (para que los estudiantes puedan buscarlos)
- Un usuario solo puede tener un perfil por tipo (UNIQUE constraint)

## 📦 Dependencias Instaladas

- `react-hook-form` - Manejo de formularios
- `@hookform/resolvers` - Integración con Zod
- `zod` - Validación de esquemas
- Componentes shadcn: `form`, `select`, `checkbox`, `textarea`

## 🚀 Próximos Pasos

1. **Ejecuta el SQL** en Supabase (`supabase-profiles.sql`)
2. **Prueba el flujo:**
   - Inicia sesión como nuevo usuario
   - Selecciona un rol
   - Completa el formulario
   - Verifica que se guarde en Supabase
3. **Diseña los dashboards personalizados** para estudiantes y tutores

## 📊 Estructura de Datos

### Arrays en PostgreSQL:
Los campos de tipo array (áreas de interés, temas, disponibilidad) se guardan como:
\`\`\`json
["Matemáticas", "Ciencias", "Programación"]
\`\`\`

Esto permite búsquedas eficientes y flexibilidad para agregar más opciones en el futuro.
