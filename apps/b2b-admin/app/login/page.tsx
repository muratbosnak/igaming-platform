import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-xl shadow-black/40">
        <div className="mb-8 space-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">B2B Admin</h1>
          <p className="text-sm text-zinc-500">Sign in with a super admin account.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
