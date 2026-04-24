'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { isNextRedirect } from '@igaming/utils'
import type { LoginActionState } from '@igaming/utils'

export type { LoginActionState } from '@igaming/utils'

export async function loginAction(
  _prev: LoginActionState | undefined,
  formData: FormData,
): Promise<LoginActionState> {
  const rawEmail = formData.get('email')
  const rawPassword = formData.get('password')
  if (typeof rawEmail !== 'string' || typeof rawPassword !== 'string') {
    return { error: 'Email and password are required.' }
  }

  const email = rawEmail.trim().toLowerCase()
  if (!email || !rawPassword) {
    return { error: 'Email and password are required.' }
  }

  try {
    await signIn('credentials', {
      email,
      password: rawPassword,
      redirectTo: '/',
    })
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error
    }
    if (error instanceof AuthError && error.type === 'CredentialsSignin') {
      return { error: 'Invalid credentials or access denied.' }
    }
    return { error: 'Sign-in failed. Please try again.' }
  }

  return {}
}
