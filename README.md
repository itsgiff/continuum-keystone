# Keystone v0.1

A self-hosted digital estate management system for organizing and securing your digital life.

## Features

- **Session-based Authentication**: Secure login with argon2id password hashing
- **Multi-user Support**: Multiple users can manage their own digital estates
- **Self-hosted**: Full control over your data, runs on your infrastructure
- **Modern Stack**: SvelteKit frontend + Fastify backend + SQLite database

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development servers (frontend + backend)
pnpm dev

# Frontend: http://localhost:5173
# API: http://localhost:3000
```

### Production (Docker)

```bash
# Copy environment variables
cp .env.example .env

# Edit .env and set SESSION_SECRET to a secure random value
# Generate with: openssl rand -base64 32

# Start services
docker-compose up

# Frontend: http://localhost:3001
# API: http://localhost:3000
```

## Project Structure

```
continuum-keystone/
├── apps/
│   ├── api/          # Fastify backend
│   └── web/          # SvelteKit frontend
├── packages/
│   ├── schema/       # Shared entity definitions
│   ├── crypto/       # Encryption utilities
│   └── ui/           # Shared Svelte components
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

## Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm playwright

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Full build verification
pnpm build:all
```

## Documentation

- [Self-Hosting Guide](docs/deployment/SELF_HOSTED.md)
- [System Architecture](docs/architecture/SYSTEM.md)
- [Development Setup](docs/DEV_SETUP.md)

## Tech Stack

- **Frontend**: SvelteKit, Tailwind CSS, TypeScript
- **Backend**: Fastify, Drizzle ORM, SQLite
- **Auth**: Session cookies, argon2id
- **Testing**: Vitest, Playwright
- **DevOps**: Docker, GitHub Actions

## Roadmap

- ✅ v0.1: Auth foundation + project setup
- 🔲 v0.2: Asset management (devices, software, services)
- 🔲 v0.3: Warranty & runbook tracking
- 🔲 v0.4: Export pipeline with Ed25519 signing
- 🔲 v0.5: File attachments & versioning

## License

MIT
