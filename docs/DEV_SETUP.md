# Development Setup Guide

This guide will help you set up a local development environment for Keystone.

## Prerequisites

### Required

- **Node.js**: Version 20 or higher
  ```bash
  node --version  # Should be v20.x or higher
  ```

- **PNPM**: Package manager (version 8+)
  ```bash
  npm install -g pnpm@8.15.0
  ```

### Optional

- **Docker**: For testing production builds
- **VS Code**: Recommended IDE with suggested extensions

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/continuum-keystone.git
cd continuum-keystone
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install dependencies for all packages in the monorepo.

### 3. Set Up Environment

Create environment files:

```bash
# Root .env
cp .env.example .env

# API .env
cp apps/api/.env.example apps/api/.env
```

The default development values work out of the box. No changes needed for local development.

## Running the Development Server

### Start All Services

The easiest way to run everything:

```bash
pnpm dev
```

This starts:
- **Frontend** (SvelteKit): http://localhost:5173
- **Backend** (Fastify): http://localhost:3000

Both services have hot-reload enabled.

### Start Services Individually

If you prefer to run services separately:

```bash
# Terminal 1: API
cd apps/api
pnpm dev

# Terminal 2: Web
cd apps/web
pnpm dev
```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**
   - Edit files in `apps/` or `packages/`
   - Changes will hot-reload automatically

3. **Test your changes**
   ```bash
   # Type check
   pnpm typecheck

   # Lint
   pnpm lint

   # Unit tests
   pnpm test

   # E2E tests
   pnpm playwright
   ```

4. **Build to verify**
   ```bash
   pnpm build
   ```

### Project Structure

```
continuum-keystone/
├── apps/
│   ├── api/              # Backend application
│   │   ├── src/
│   │   │   ├── auth/     # Authentication
│   │   │   ├── db/       # Database
│   │   │   └── utils/    # Utilities
│   │   └── package.json
│   └── web/              # Frontend application
│       ├── src/
│       │   ├── lib/      # Utilities & stores
│       │   └── routes/   # Pages
│       └── package.json
├── packages/             # Shared packages
│   ├── schema/           # Entity schemas (Zod)
│   ├── crypto/           # Crypto utilities
│   └── ui/               # UI components
└── tests/                # E2E tests
```

### Adding Dependencies

```bash
# To root workspace
pnpm add -w <package>

# To specific app/package
pnpm add <package> --filter @keystone/api
pnpm add <package> --filter @keystone/web
```

## Testing

### Unit Tests (Vitest)

Run all unit tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:ui
```

Run tests for specific package:

```bash
pnpm --filter @keystone/api test
```

### E2E Tests (Playwright)

Run E2E tests:

```bash
pnpm playwright
```

Run with UI:

```bash
cd apps/web
pnpm test:ui
```

Debug a specific test:

```bash
npx playwright test tests/auth.spec.ts --debug
```

### Writing Tests

#### Unit Test Example

```typescript
// apps/api/src/utils/example.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from './example';

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe('expected');
  });
});
```

#### E2E Test Example

```typescript
// tests/feature.spec.ts
import { test, expect } from '@playwright/test';

test('user can do something', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Keystone');
});
```

## Code Quality

### Type Checking

```bash
# All packages
pnpm typecheck

# Specific package
pnpm --filter @keystone/api typecheck
```

### Linting

```bash
# All packages
pnpm lint

# Specific package
pnpm --filter @keystone/api lint
```

### Formatting

We use Prettier for code formatting:

```bash
# Check formatting
pnpm prettier --check .

# Fix formatting
pnpm prettier --write .
```

## Database

### Schema Changes

When you modify the database schema in `apps/api/src/db/schema.ts`:

1. Generate migration:
   ```bash
   cd apps/api
   pnpm db:generate
   ```

2. Run migration:
   ```bash
   pnpm db:migrate
   ```

### Reset Database

To start with a fresh database:

```bash
rm -rf apps/api/data/
# Restart the API server to recreate database
```

## Debugging

### Backend (API)

VS Code launch configuration (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["--filter", "@keystone/api", "dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Frontend (Web)

Use browser DevTools:
- Chrome: F12 or Cmd+Option+I
- Firefox: F12 or Cmd+Option+I

Svelte DevTools extension recommended for React-like debugging.

### Playwright Tests

Debug mode:

```bash
npx playwright test --debug
```

Or add `await page.pause()` in your test:

```typescript
test('my test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Opens inspector
});
```

## Common Issues

### Port Already in Use

If you see "port already in use" errors:

```bash
# Find process using port
lsof -i :3000  # or :5173

# Kill process
kill -9 <PID>
```

### PNPM Install Fails

```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### TypeScript Errors After Pulling

```bash
# Rebuild all packages
pnpm build

# Sync TypeScript
pnpm typecheck
```

## VS Code Setup

### Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Getting Help

- **Documentation**: Check other docs in `/docs`
- **Issues**: Open a GitHub issue
- **Code Comments**: Look for inline documentation

## Next Steps

After setup:
1. Create a test account at http://localhost:5173/register
2. Explore the codebase
3. Pick an issue to work on
4. Read `docs/architecture/SYSTEM.md` for architecture overview

Happy coding!
