'use client'

import { useActionState } from 'react'
import { loginAction, type LoginActionState } from './actions'

interface LoginFormProps {
  operatorName: string
  operatorDomain: string
}

const initialState: LoginActionState = {}

export function LoginForm({ operatorName, operatorDomain }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      {state.error ? (
        <p className="rounded border border-red-900/80 bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      {/* Hidden field — set server-side from the Host header; not user-editable */}
      <input type="hidden" name="operatorDomain" value={operatorDomain} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-indigo-500/0 transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-indigo-500/0 transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Signing in…' : `Sign in to ${operatorName}`}
      </button>
    </form>
  )
}
