import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') || '/dashboard/select-role'
  const origin = requestUrl.origin

  // Si no hay token_hash, redirigir a login
  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`)
  }

  try {
    const supabase = await createClient()
    
    // Verificar el OTP
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (error) {
      console.error('Error verifying OTP:', error)
      return NextResponse.redirect(`${origin}/login?error=verification_failed`)
    }

    // Email verificado exitosamente, redirigir a selección de rol
    return NextResponse.redirect(`${origin}${next}`)
    
  } catch (error) {
    console.error('Unexpected error in email confirmation:', error)
    return NextResponse.redirect(`${origin}/login?error=unexpected`)
  }
}
