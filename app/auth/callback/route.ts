import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  
  // Si no hay código, redirigir a login
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_error`)
    }

    // Verificar si el usuario tiene un rol asignado
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      // Si ya tiene rol, redirigir a su dashboard
      if (roleData?.role) {
        if (roleData.role === 'tutor') {
          return NextResponse.redirect(`${origin}/dashboard/tutor`)
        } else if (roleData.role === 'estudiante') {
          return NextResponse.redirect(`${origin}/dashboard/student`)
        }
      }
    }

    // Si no tiene rol, redirigir a selección de rol
    return NextResponse.redirect(`${origin}/dashboard/select-role`)
    
  } catch (error) {
    console.error('Unexpected error in callback:', error)
    return NextResponse.redirect(`${origin}/login?error=unexpected`)
  }
}
