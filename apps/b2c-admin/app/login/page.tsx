import { headers } from 'next/headers'
import { getOperatorLogoSrc, getOperatorSlug, resolveOperatorFromHost } from '@/lib/operator-host'
import { LoginForm } from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host')
  const operator = await resolveOperatorFromHost(host)
  const operatorSlug = operator ? getOperatorSlug(operator.domain) : null
  const operatorLogoSrc = operator ? getOperatorLogoSrc(operator.domain) : null

  const { error } = await searchParams

  // Unknown operator — show a clear dead-end instead of a broken login form
  if (!operator) {
    return (
      <div className="flex min-h-full items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-xl shadow-black/40">
          <div className="mb-4 space-y-1">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
              Operator Not Found
            </h1>
            <p className="text-sm text-zinc-500">
              No operator is registered for this domain. Contact your platform administrator.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-xl shadow-black/40">
        <div className="mb-8 space-y-1">
          <img
            src={operatorLogoSrc!}
            alt={`${operator.name} logo`}
            className="h-8 w-auto max-w-[140px] object-contain"
            data-operator-slug={operatorSlug!}
          />
          <p className="text-sm text-zinc-500">Sign in with your operator admin account.</p>
          {error === 'wrong_operator' && (
            <p className="mt-2 rounded border border-amber-900/80 bg-amber-950/50 px-3 py-2 text-sm text-amber-300">
              Your session is for a different operator. Please sign in again.
            </p>
          )}
        </div>
        <LoginForm
          operatorName={operator.name}
          operatorDomain={operator.domain}
        />
      </div>
    </div>
  )
}
