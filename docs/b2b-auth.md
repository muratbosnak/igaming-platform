# Feature: B2B Admin Authentication

## Tech Stack
* App: `apps/b2b-admin`
* Auth: Auth.js (NextAuth v5) - `next-auth@beta`
* Hashing: `bcryptjs`
* Database: `@igaming/database` (Prisma workspace package)

## Requirements
1. **Credentials Provider:** Implement a custom login using email and password.
2. **Validation:** On login submission, query the `BackofficeUser` table via Prisma.
3. **God Mode Check:** Ensure the user has `isSuperAdmin: true`. If not, deny access to the B2B portal.
4. **Session Strategy:** Use JWT. Store `id`, `email`, and `isSuperAdmin` in the JWT token and expose them to the client session.
5. **Middleware:** Protect all routes inside `apps/b2b-admin/app/(dashboard)` to ensure only authenticated Super Admins can access them. Redirect unauthenticated users to `/login`.

## Execution Rules
1. Install `next-auth@beta`, `bcryptjs`, and `@types/bcryptjs` inside `apps/b2b-admin`.
2. Ensure `apps/b2b-admin/package.json` correctly links to the local database workspace (`"@igaming/database": "workspace:*"`).
3. Setup the Auth.js configuration file (`auth.ts`).
4. Build a basic Tailwind CSS `/login` page with a Server Action to handle the sign-in mechanism.
5. Do not build complex UI yet; prioritize the authentication wiring, database connection, and route protection.