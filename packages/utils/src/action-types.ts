export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string }

export type LoginActionState = { error?: string }
