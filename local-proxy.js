/**
 * Local development reverse proxy.
 *
 * Listens on port 80 and routes traffic to the three Next.js dev servers
 * based purely on the `Host` header, so the team can drop port numbers
 * from local URLs and use real subdomains:
 *
 *   b2b-admin.localhost          → http://127.0.0.1:3003   (B2B admin)
 *   admin.<anything>.localhost   → http://127.0.0.1:3001   (B2C admins)
 *   kinetika.localhost           → http://127.0.0.1:3002   (B2C frontend)
 *   mbcasino.localhost           → http://127.0.0.1:3002   (B2C frontend)
 *   <anything else>              → 404 Not Found
 *
 * /etc/hosts must already point each of these names at 127.0.0.1.
 *
 * This file is intentionally a CommonJS script so it runs with a bare
 * `node local-proxy.js` — no transpiler step, no monorepo workspace
 * resolution, no surprise on `sudo` (which uses root's PATH and shell
 * config, not the user's).
 */

const http = require('http')
const httpProxy = require('http-proxy')

const PORT = 80

const TARGETS = {
  b2bAdmin: 'http://127.0.0.1:3003',
  b2cAdmin: 'http://127.0.0.1:3001',
  b2cFrontend: 'http://127.0.0.1:3002',
}

/**
 * `ws: true` enables WebSocket forwarding on the proxy instance, but the
 * upgrade handshake itself still has to be wired up on the HTTP server
 * (see the `upgrade` listener below). Without that wiring Next.js HMR /
 * fast refresh silently fails because the websocket never reaches the
 * dev server.
 *
 * `xfwd: true` adds `X-Forwarded-*` headers so each Next dev server
 * sees the original Host the browser asked for — required for the B2C
 * frontend's tenant proxy to resolve `kinetika.localhost` /
 * `mbcasino.localhost` correctly.
 */
const proxy = httpProxy.createProxyServer({
  ws: true,
  xfwd: true,
})

/**
 * Resolve the upstream target from a request's `Host` header.
 *
 * Returns `null` when the host doesn't match any known route. The Host
 * header may include a port (`kinetika.localhost:80`) so we strip it
 * before matching to keep the rules port-independent.
 */
function resolveTarget(hostHeader) {
  if (!hostHeader) return null

  const host = String(hostHeader).toLowerCase().split(':')[0]

  if (host === 'b2b-admin.localhost') {
    return TARGETS.b2bAdmin
  }

  if (host.startsWith('admin.')) {
    return TARGETS.b2cAdmin
  }

  if (host === 'kinetika.localhost' || host === 'mbcasino.localhost') {
    return TARGETS.b2cFrontend
  }

  return null
}

/**
 * Friendly 502 page rendered when the upstream Next dev server isn't
 * listening yet (the most common cause is "I just ran `pnpm proxy`
 * before `pnpm dev`"). We catch `ECONNREFUSED` specifically so genuine
 * upstream errors still get a generic message and we don't suppress
 * unexpected failure modes.
 */
function renderUpstreamDown(target, code) {
  const safeTarget = String(target).replace(/[<>&"']/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === '"' ? '&quot;' : '&#39;',
  )

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>502 — Upstream not reachable</title>
    <style>
      body { font: 16px/1.5 system-ui, sans-serif; max-width: 640px; margin: 6rem auto; padding: 0 1.5rem; color: #1f2937; }
      h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
      code { background: #f3f4f6; padding: .15rem .4rem; border-radius: .25rem; font-size: .95em; }
      .hint { color: #4b5563; margin-top: 1rem; }
    </style>
  </head>
  <body>
    <h1>502 — upstream not reachable</h1>
    <p>The local proxy received your request but the upstream dev server at <code>${safeTarget}</code> is not responding (<code>${code}</code>).</p>
    <p class="hint">Start it with <code>pnpm dev</code> in the relevant <code>apps/*</code> package, or run <code>pnpm dev:apps</code> at the repo root, then refresh.</p>
  </body>
</html>`
}

/**
 * Per-request error handler. `http-proxy` calls this for every transport
 * failure (connection refused, socket hang up, target timeout, etc.).
 * We must always finish the response — otherwise the browser hangs and,
 * worse, the proxy process can crash on `Cannot read properties of
 * undefined (...) ` if a later listener tries to write to a closed res.
 */
proxy.on('error', (err, req, res) => {
  const target = req && req._proxyTarget ? req._proxyTarget : '(unknown)'
  console.warn(`[proxy] upstream error for ${req && req.url} → ${target}: ${err.code || err.message}`)

  if (!res || res.headersSent) return

  if (typeof res.writeHead === 'function') {
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
      res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(renderUpstreamDown(target, err.code))
      return
    }

    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(`Bad gateway: ${err.code || err.message}`)
  }
})

const server = http.createServer((req, res) => {
  const target = resolveTarget(req.headers.host)

  if (!target) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(`404 Not Found: no route for host "${req.headers.host || ''}"\n`)
    return
  }

  /** Stash the resolved target so the shared `error` handler can name it
   *  in the 502 page without re-running the lookup. */
  req._proxyTarget = target

  proxy.web(req, res, { target })
})

/**
 * WebSocket upgrade forwarding (Next.js HMR / fast refresh).
 *
 * On `upgrade` we get a raw socket, not an `http.ServerResponse`, so the
 * proxy's `error` listener can't write an HTML 502 here — it would just
 * destroy the socket. We handle the upgrade-time failure separately to
 * keep the socket from leaking.
 */
server.on('upgrade', (req, socket, head) => {
  const target = resolveTarget(req.headers.host)

  if (!target) {
    socket.destroy()
    return
  }

  proxy.ws(req, socket, head, { target }, (err) => {
    if (err) {
      console.warn(`[proxy] websocket upstream error for ${req.url} → ${target}: ${err.code || err.message}`)
      socket.destroy()
    }
  })
})

/**
 * Top-level safety nets. `http-proxy` is normally well-behaved, but if a
 * truly unexpected error escapes (e.g. an upstream sends a malformed
 * frame), we log it and keep the proxy alive — losing the proxy mid-day
 * because one HMR socket misbehaved is a worse DX than logging noise.
 */
server.on('clientError', (err, socket) => {
  console.warn(`[proxy] client error: ${err.code || err.message}`)
  if (!socket.destroyed) socket.destroy()
})

process.on('uncaughtException', (err) => {
  console.error('[proxy] uncaught exception:', err)
})

server.listen(PORT, () => {
  console.log('[proxy] local reverse proxy listening on port 80')
  console.log('[proxy] reminder: port 80 is privileged on macOS/Linux —')
  console.log('[proxy]           run with `sudo` (e.g. `sudo pnpm proxy`).')
  console.log('[proxy] routes:')
  console.log('[proxy]   b2b-admin.localhost          → ' + TARGETS.b2bAdmin)
  console.log('[proxy]   admin.*.localhost            → ' + TARGETS.b2cAdmin)
  console.log('[proxy]   kinetika.localhost           → ' + TARGETS.b2cFrontend)
  console.log('[proxy]   mbcasino.localhost           → ' + TARGETS.b2cFrontend)
})

server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.error('[proxy] EACCES: cannot bind to port 80 without elevated privileges.')
    console.error('[proxy]        re-run as `sudo pnpm proxy` (or `sudo node local-proxy.js`).')
    process.exit(1)
  }

  if (err.code === 'EADDRINUSE') {
    console.error('[proxy] EADDRINUSE: port 80 is already in use.')
    console.error('[proxy]            find the holder with `sudo lsof -nP -iTCP:80 -sTCP:LISTEN`,')
    console.error('[proxy]            stop it, then retry.')
    process.exit(1)
  }

  console.error('[proxy] server error:', err)
  process.exit(1)
})
