import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import session from '@fastify/session';
import { authRoutes } from './auth/routes.js';
import { setupErrorHandler } from './utils/errors.js';
import { logger } from './utils/logger.js';

const fastify = Fastify({
  logger: false, // Using custom logger
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});

await fastify.register(cookie);

await fastify.register(session, {
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me-in-production',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  },
});

// Setup error handling
setupErrorHandler(fastify);

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
await fastify.register(authRoutes, { prefix: '/api' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    logger.info(`API server running on http://${host}:${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
