# Flow Ledger Core

The core REST API service for the Flow Ledger platform. Built with [NestJS](https://nestjs.com), TypeScript, and a strict code quality pipeline.

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | `>=24` (see `.nvmrc`) |
| pnpm | latest |

> Using [nvm](https://github.com/nvm-sh/nvm)? Run `nvm use` in the project root to automatically switch to the correct Node version.

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the database

```bash
pnpm docker:core-db:up
```

This starts a PostgreSQL 17 container (`flow-ledger-core-db`) using the settings in `docker-compose.yml`.

Default connection details (overridable via `.env`):

| Variable | Default |
|----------|---------|
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | `postgres` |
| `POSTGRES_DB` | `flow_ledger_core_db` |
| `POSTGRES_PORT` | `5432` |

Copy `.env.example` to `.env` and adjust as needed.

### 3. Apply database migrations

```bash
pnpm db:migration:apply
```

### 4. Run in development mode

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`.

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start the server |
| `pnpm start:dev` | Start in watch mode |
| `pnpm start:debug` | Start with debugger attached |
| `pnpm start:prod` | Run compiled production build |
| `pnpm build` | Compile the project |
| `pnpm lint` | Lint and auto-fix with Biome |
| `pnpm format` | Format with Biome |
| `pnpm organize` | Lint + format + import sorting (full check) |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cov` | Run tests with coverage |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm docker:core-db:up` | Start the Postgres container |
| `pnpm docker:core-db:down` | Stop and remove the Postgres container + volume |
| `pnpm db:migration:generate <name>` | Generate a new migration SQL file without applying it |
| `pnpm db:migration:apply` | Apply all pending migrations to the database |
| `pnpm db:schema:generate` | Regenerate the Prisma client from the schema |

---

## Database

The database is PostgreSQL 17, running via Docker. Schema and migrations are managed with [Prisma](https://www.prisma.io).

- Schema: `database/schema.prisma`
- Migrations: `database/migrations/`
- Prisma config: `prisma.config.ts`

### Migration workflow

```bash
# 1. Generate a new migration file (does NOT apply it)
pnpm db:migration:generate <name>

# 2. Review the generated SQL in database/migrations/

# 3. Apply pending migrations
pnpm db:migration:apply

# 4. Regenerate the Prisma client after schema changes
pnpm db:schema:generate
```

> `db:migration:generate` uses `--create-only`, so it never touches the database automatically.
> Always review the SQL before applying.

---

## Architecture

This is a RESTful API service built on NestJS. Modules are organized under `src/modules/`, each encapsulating its own controller, service, and module file.

```
src/
├── main.ts               # Application entry point
├── app.module.ts         # Root module
└── modules/
    └── system/           # Health / system module
```

---

## Code Quality

### Linter & Formatter — Biome

This project uses [Biome](https://biomejs.dev) as the single tool for linting, formatting, and import organisation. ESLint and Prettier are not used.

```bash
# Lint and fix
pnpm lint

# Format
pnpm format

# Full check (lint + format + imports)
pnpm organize
```

Biome is configured in `biome.json`. Key settings:

- Indent: 2 spaces
- Line width: 160
- Line endings: LF
- Respects `.gitignore` via VCS integration

### Commit Messages — Conventional Commits

Commit messages are enforced by [commitlint](https://commitlint.js.org) using the `@commitlint/config-conventional` preset.

Format: `<type>(<scope>): <subject>`

```
feat(auth): add jwt token validation
fix(ledger): correct balance calculation on rollback
chore: update dependencies
```

Subject must be **lower-case**. Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `revert`.

---

## Git Hooks

Hooks are managed by [Husky](https://typicode.github.io/husky). They are installed automatically on `pnpm install` via the `prepare` script.

| Hook | Action |
|------|--------|
| `pre-commit` | Runs `biome check --error-on-warnings` — blocks commit if lint/format errors exist |
| `commit-msg` | Runs `commitlint` — enforces Conventional Commits format |
| `pre-push` | Runs `biome check --error-on-warnings` — blocks push if checks fail |

> To skip hooks in an emergency: `git commit --no-verify` (use sparingly).

---

## VS Code Setup

### Recommended Extensions

When prompted by VS Code, install the recommended extensions from `.vscode/extensions.json`:

| Extension | Purpose |
|-----------|---------|
| `biomejs.biome` | Biome linter and formatter integration |
| `streetsidesoftware.code-spell-checker` | In-editor spell checking |

Biome will automatically format and lint on save when the extension is active. There is no need for Prettier or ESLint extensions.

---

## Testing

```bash
# unit tests
pnpm test

# unit tests in watch mode
pnpm test:watch

# e2e tests
pnpm test:e2e

# coverage report
pnpm test:cov
```

---

## License

UNLICENSED — private and proprietary.
