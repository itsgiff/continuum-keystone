# Keystone System Architecture (v0.1)

This document describes the high-level architecture of Keystone v0.1, focusing on the authentication foundation and project structure.

## Overview

Keystone is a self-hosted digital estate management system built as a modern monorepo with clear separation between frontend, backend, and shared packages.

### Core Principles

1. **Self-hosted First**: All data stays on your infrastructure
2. **Security by Default**: Modern encryption, secure sessions, password hashing
3. **Simple Deployment**: Docker Compose for easy setup
4. **Extensible**: Clean architecture for future features

## Technology Stack

### Frontend

- **SvelteKit**: Modern reactive framework with SSR
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety throughout

### Backend

- **Fastify**: Fast, low-overhead HTTP framework
- **Drizzle ORM**: Type-safe database access
- **SQLite**: Embedded database, perfect for self-hosting
- **argon2id**: Password hashing algorithm

### Infrastructure

- **PNPM**: Fast, efficient package manager
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline

## Architecture Diagram

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SvelteKit     │  Port 5173 (dev) / 3001 (prod)
│   Frontend      │
└────────┬────────┘
         │ HTTP + Session Cookies
         ▼
┌─────────────────┐
│   Fastify API   │  Port 3000
│   Backend       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SQLite DB     │  ./data/keystone.db
│   (via Drizzle) │
└─────────────────┘
```

## Project Structure

```
continuum-keystone/
├── apps/
│   ├── api/              # Backend Fastify application
│   │   └── src/
│   │       ├── auth/     # Authentication logic
│   │       ├── db/       # Database schema & migrations
│   │       └── utils/    # Shared utilities
│   └── web/              # Frontend SvelteKit application
│       └── src/
│           ├── lib/      # Client utilities
│           └── routes/   # Pages and API routes
├── packages/
│   ├── schema/           # Shared entity definitions (Zod)
│   ├── crypto/           # Encryption utilities (skeleton)
│   └── ui/               # Shared Svelte components
└── docs/                 # Documentation
```

## Authentication Flow

### Registration

1. User submits email, password, name
2. Backend validates password strength (minimum 8 chars, uppercase, lowercase, number)
3. Password is hashed with argon2id
4. User record created in database
5. User is auto-logged in
6. Redirected to dashboard

### Login

1. User submits email and password
2. Backend looks up user by email
3. Password verified with argon2.verify()
4. Session created in database
5. Session cookie set (HTTPOnly, Secure in prod)
6. User data returned to frontend

### Session Management

Sessions are managed via `@fastify/session`:

- **Storage**: In-memory by default (can be upgraded to Redis)
- **Duration**: 7 days
- **Security**: HTTPOnly cookies, Secure flag in production
- **Validation**: Middleware checks session on protected routes

### Logout

1. Session deleted from database
2. Session cookie cleared
3. User redirected to login

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- nanoid
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,   -- argon2id hash
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,   -- Unix timestamp
  updated_at INTEGER NOT NULL
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Estates Table (Placeholder)

```sql
CREATE TABLE estates (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

## Security

### Password Security

- **Algorithm**: argon2id (resistant to GPU cracking)
- **Parameters**:
  - Memory cost: 19456 KB
  - Time cost: 2 iterations
  - Parallelism: 1
- **Validation**: Enforced minimum complexity

### Session Security

- **HTTPOnly**: Prevents XSS attacks
- **Secure**: HTTPS-only in production
- **SameSite**: Prevents CSRF
- **Expiration**: 7-day maximum lifetime

### CORS

Configured to only allow requests from the frontend origin:
- Development: `http://localhost:5173`
- Production: Configurable via environment

## API Endpoints

### Authentication

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login with credentials | No |
| POST | `/api/auth/logout` | End session | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Health Check

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/health` | Service health status | No |

## Future Architecture

### Planned Enhancements (Post v0.1)

1. **Redis Session Store**: For distributed deployments
2. **Multi-tenancy**: Support for organizations
3. **API Versioning**: `/api/v1`, `/api/v2`, etc.
4. **File Storage**: S3-compatible object storage
5. **Real-time Updates**: WebSocket support
6. **Audit Logging**: Track all changes
7. **Backup Service**: Automated encrypted backups

### Module Expansion

Future versions will add:
- Asset management (devices, equipment)
- Software license tracking
- Service account management
- Warranty tracking
- Runbook system
- Export pipeline with Ed25519 signing
- File attachments with versioning

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start all services in dev mode
pnpm dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Testing

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Unit tests (Vitest)
pnpm test

# E2E tests (Playwright)
pnpm playwright
```

### Building

```bash
# Build all packages
pnpm build

# Full verification (install, typecheck, lint, test, build)
pnpm build:all
```

## Deployment

### Docker Compose

Production deployment uses Docker Compose:

```bash
docker-compose up -d
```

This creates:
- `keystone-api`: Backend service
- `keystone-web`: Frontend service
- `data` volume: Persistent SQLite database

### Environment Configuration

Critical environment variables:
- `SESSION_SECRET`: Must be set to secure random value
- `NODE_ENV`: Set to `production`
- `DATABASE_URL`: Path to SQLite database

See `docs/deployment/SELF_HOSTED.md` for detailed deployment instructions.

## Performance Considerations

### Current Performance

- **SQLite**: Excellent for single-instance deployments, handles 100k+ records
- **Fastify**: ~30k req/sec baseline
- **SvelteKit**: Compiled components, minimal runtime overhead

### Optimization Strategies

1. **Database Indexes**: Added on frequently queried fields
2. **Session Caching**: In-memory sessions by default
3. **Static Asset Serving**: Via SvelteKit's adapter
4. **Connection Pooling**: Better-sqlite3's synchronous mode

### Scaling Path

When self-hosting outgrows single instance:
1. Add Redis for sessions
2. Move to PostgreSQL for better concurrency
3. Deploy API behind load balancer
4. Use CDN for static assets

## Monitoring and Observability

### Health Checks

Both services expose health endpoints:
- API: `GET /health`
- Web: Root path health check

### Logging

Simple console logging:
- `[INFO]`: Normal operations
- `[WARN]`: Potential issues
- `[ERROR]`: Failures

Future: Structured logging with correlation IDs

## Contributing

See main README for contribution guidelines.
