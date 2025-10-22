# Configuración de la Base de Datos - Roles de Usuario

## 📋 Instrucciones para Supabase

### Paso 1: Ejecutar el SQL en Supabase

1. Ve a tu proyecto de Supabase: https://uzgbayfalkdilmbtrsjb.supabase.co
2. En el menú lateral, haz clic en **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido del archivo `supabase-user-roles.sql`
5. Haz clic en **Run** para ejecutar el script

### Paso 2: Verificar que todo se creó correctamente

Después de ejecutar el SQL, verifica que:

1. **Tabla creada**: Ve a **Database** → **Tables** y confirma que existe `user_roles`
2. **Columnas correctas**: La tabla debe tener:
   - `id` (UUID, primary key)
   - `user_id` (UUID, referencia a auth.users)
   - `role` (varchar, solo permite 'tutor' o 'estudiante')
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. **RLS habilitado**: En la tabla, verifica que Row Level Security esté activado
4. **Políticas creadas**: Deberías ver 3 políticas:
   - "Users can view their own role"
   - "Users can insert their own role"
   - "Users can update their own role"

### Paso 3: Probar la funcionalidad

1. Inicia sesión en la aplicación
2. Serás redirigido automáticamente a `/dashboard/select-role`
3. Selecciona un rol (Tutor o Estudiante)
4. Verifica que se guarde correctamente en Supabase:
   - Ve a **Database** → **Tables** → `user_roles`
   - Deberías ver tu registro con el rol seleccionado

## 🔍 Estructura de la Tabla

\`\`\`sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50) CHECK (role IN ('tutor', 'estudiante')),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
\`\`\`

## 🔒 Seguridad

- **Row Level Security (RLS)** está habilitado
- Los usuarios solo pueden ver y modificar su propio rol
- El campo `role` solo acepta los valores 'tutor' o 'estudiante'
- Cada usuario puede tener solo un rol (constraint UNIQUE en user_id)

## 🚀 Funcionamiento de la Aplicación

### Flujo de Usuario Nuevo:
1. Usuario se registra/inicia sesión
2. Es redirigido a `/dashboard`
3. `/dashboard` verifica si tiene un rol asignado
4. Si no tiene rol → redirige a `/dashboard/select-role`
5. Usuario selecciona rol (tutor o estudiante)
6. Se guarda en la tabla `user_roles`
7. Usuario es redirigido a su formulario correspondiente

### Flujo de Usuario Existente:
1. Usuario inicia sesión
2. Es redirigido a `/dashboard`
3. `/dashboard` verifica su rol
4. Redirige automáticamente según su rol:
   - Tutor → `/dashboard/tutor-form`
   - Estudiante → `/dashboard/student-form`

## 🛠️ Archivos Creados

- `supabase-user-roles.sql` - Script SQL para crear la tabla y configuración
- `lib/role-actions.ts` - Acciones del servidor para manejar roles
- `app/dashboard/select-role/page.tsx` - Página de selección de rol
- `app/dashboard/tutor-form/page.tsx` - Página temporal para tutores
- `app/dashboard/student-form/page.tsx` - Página temporal para estudiantes
- `app/dashboard/page.tsx` - Actualizado para redirigir según el rol

## 📝 Notas Adicionales

- Los GIFs están en `/public/student.gif` y `/public/teacher.gif`
- La página es completamente responsive
- Incluye efectos hover en las cards
- Muestra un spinner mientras se guarda el rol
- Usa toast notifications para feedback al usuario
