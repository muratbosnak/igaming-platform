# Database Architecture: B2B/B2C Admin Authentication

## Tech Stack
* **Database:** PostgreSQL 16
* **ORM:** Prisma
* **Workspace:** Turborepo `packages/database`

## The "Workspace Switcher" Admin Schema

We are building the administrative core of a B2B2C iGaming platform. We use a Many-to-Many architecture to allow a single human identity to manage multiple casino brands without creating duplicate accounts.

### 1. `Operator` (The Casino Brand)
* `id`: UUID (Primary Key)
* `name`: String (e.g., "MB Casino", "Kinetika")
* `domain`: String (Unique)
* `createdAt`: DateTime (Default: now)
* `updatedAt`: DateTime (Updated automatically)

### 2. `BackofficeUser` (The Human Identity)
* `id`: UUID (Primary Key)
* `email`: String (Unique)
* `passwordHash`: String
* `isSuperAdmin`: Boolean (Default: false. If true, this is the B2B platform owner).
* `createdById`: UUID (Nullable. Foreign Key -> BackofficeUser.id. Tracks who invited this user).
* `createdAt`: DateTime (Default: now)
* `updatedAt`: DateTime (Updated automatically)

### 3. `UserOperatorAccess` (The Authorization Junction)
* `id`: UUID (Primary Key)
* `userId`: UUID (Foreign Key -> BackofficeUser.id)
* `operatorId`: UUID (Foreign Key -> Operator.id)
* `role`: Enum (`ADMIN`, `MARKETING`, `CUSTOMER_SUPPORT`)
* `createdAt`: DateTime (Default: now)
* `updatedAt`: DateTime (Updated automatically)
* **Constraint:** Unique compound index on `[userId, operatorId]` (A user can only have one access record per operator).

## Execution Rules
1. Initialize a standard Turborepo package at `packages/database` with a `package.json`.
2. Set up the `schema.prisma` file reflecting these exact models, types, and relations.
3. Ensure the self-referencing relation on `BackofficeUser` for `createdById` is explicitly named to avoid Prisma relation ambiguity.
4. Create an `index.ts` file that exports a singleton instance of the Prisma Client.
5. Do not run any migration commands yet; just generate the files.