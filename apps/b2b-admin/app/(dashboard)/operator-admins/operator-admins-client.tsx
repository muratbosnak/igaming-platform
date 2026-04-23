'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import {
  createOperatorAdminAction,
  toggleOperatorAdminStatusAction,
  updateOperatorAdminAction,
  type ActionResult,
} from './actions'

const ROLE_OPTIONS = ['ADMIN', 'MARKETING', 'CUSTOMER_SUPPORT'] as const
type BackofficeRoleValue = (typeof ROLE_OPTIONS)[number]

type Operator = { id: string; name: string }

type Admin = {
  id: string
  email: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: { email: string } | null
  updatedBy: { email: string } | null
  operatorAccess: {
    operatorId: string
    role: BackofficeRoleValue
    isActive: boolean
    operator: { name: string }
  }[]
}

// ─── Toast helper ─────────────────────────────────────────────────────────────

function useActionToast(result: ActionResult | undefined, onSuccess?: () => void) {
  const prevRef = useRef<ActionResult | undefined>(undefined)
  useEffect(() => {
    if (!result || result === prevRef.current) return
    prevRef.current = result
    if (result.ok) {
      toast.success(result.message)
      onSuccess?.()
    } else {
      toast.error(result.message)
    }
  }, [result, onSuccess])
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Create modal ─────────────────────────────────────────────────────────────

function CreateAdminModal({ operators, onClose }: { operators: Operator[]; onClose: () => void }) {
  const [result, formAction, pending] = useActionState(createOperatorAdminAction, undefined)
  useActionToast(result, onClose)

  return (
    <Modal title="Add operator admin" onClose={onClose}>
      <form action={formAction} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
          <input
            required
            type="email"
            name="email"
            placeholder="admin@example.com"
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Initial password (min 12 chars)</label>
          <input
            required
            type="password"
            name="password"
            placeholder="••••••••••••"
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Role</label>
          <select
            required
            name="role"
            defaultValue="ADMIN"
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Operator</label>
          <select
            required
            name="operatorIds"
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          >
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>{operator.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors disabled:opacity-60"
          >
            {pending ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditAdminModal({
  admin,
  operators,
  onClose,
}: {
  admin: Admin
  operators: Operator[]
  onClose: () => void
}) {
  const [result, formAction, pending] = useActionState(updateOperatorAdminAction, undefined)
  useActionToast(result, onClose)

  return (
    <Modal title={`Edit — ${admin.email}`} onClose={onClose}>
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="userId" value={admin.id} />
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
          <input
            required
            type="email"
            name="email"
            defaultValue={admin.email}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Role</label>
          <select
            name="role"
            defaultValue={admin.operatorAccess[0]?.role ?? 'ADMIN'}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Operator</label>
          <select
            name="operatorIds"
            defaultValue={admin.operatorAccess[0]?.operatorId ?? ''}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          >
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>{operator.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            New password <span className="text-zinc-600">(leave blank to keep current)</span>
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="••••••••••••"
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Toggle status row action ─────────────────────────────────────────────────

function ToggleStatusButton({ admin }: { admin: Admin }) {
  const [result, formAction, pending] = useActionState(toggleOperatorAdminStatusAction, undefined)
  useActionToast(result)

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={admin.id} />
      <input type="hidden" name="isActive" value={String(!admin.isActive)} />
      <button
        type="submit"
        disabled={pending}
        className={`rounded border px-2 py-1 text-xs transition-colors disabled:opacity-60 ${
          admin.isActive
            ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            : 'border-emerald-800 text-emerald-400 hover:bg-emerald-950'
        }`}
      >
        {pending ? '…' : admin.isActive ? 'Deactivate' : 'Activate'}
      </button>
    </form>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  admins: Admin[]
  operators: Operator[]
  filters: {
    email: string
    operatorId: string
    role?: BackofficeRoleValue
    status: 'all' | 'active' | 'passive'
  }
}

export function OperatorAdminsClient({ admins, operators, filters }: Props) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null)

  return (
    <>
      {/* Filters */}
      <section className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-100">Filters</h2>
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            + Add Admin
          </button>
        </div>
        <form className="grid grid-cols-1 gap-3 md:grid-cols-5" method="get">
          <input
            name="email"
            defaultValue={filters.email}
            placeholder="Search email"
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          />
          <select
            name="operatorId"
            defaultValue={filters.operatorId}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          >
            <option value="">All operators</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>{operator.name}</option>
            ))}
          </select>
          <select
            name="role"
            defaultValue={filters.role ?? ''}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          >
            <option value="">All roles</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={filters.status}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-700"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="passive">Passive</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            Apply filters
          </button>
        </form>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40">
        <table className="w-full table-auto text-sm">
          <thead className="bg-zinc-900/70 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Operator / Role</th>
              <th className="px-3 py-2 text-left">Created by</th>
              <th className="px-3 py-2 text-left">Last updated by</th>
              <th className="px-3 py-2 text-left">Updated at</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t border-zinc-800 align-middle">
                <td className="px-3 py-3 text-zinc-100">{admin.email}</td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      admin.isActive
                        ? 'border-emerald-800 bg-emerald-950 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {admin.isActive ? 'Active' : 'Passive'}
                  </span>
                </td>
                <td className="px-3 py-3 text-zinc-300">
                  <div className="space-y-0.5">
                    {admin.operatorAccess.map((access) => (
                      <p key={`${admin.id}-${access.operatorId}`} className="text-xs">
                        {access.operator.name} — {access.role}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-zinc-500">
                  {admin.createdBy?.email ?? '—'}
                </td>
                <td className="px-3 py-3 text-xs text-zinc-500">
                  {admin.updatedBy?.email ?? '—'}
                </td>
                <td className="px-3 py-3 text-xs text-zinc-500">
                  {admin.updatedAt.toLocaleDateString('en-GB')}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditAdmin(admin)}
                      className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      Edit
                    </button>
                    <ToggleStatusButton admin={admin} />
                  </div>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-zinc-500">
                  No operator admins found for current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modals */}
      {createOpen && (
        <CreateAdminModal
          operators={operators}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editAdmin && (
        <EditAdminModal
          admin={editAdmin}
          operators={operators}
          onClose={() => setEditAdmin(null)}
        />
      )}
    </>
  )
}
