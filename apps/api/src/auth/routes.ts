import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, validatePassword } from './password.js';
import { requireAuth } from './middleware.js';
import { AppError } from '../utils/errors.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/auth/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    // Validate password
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.error || 'Invalid password', 400);
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, body.email),
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password and create user
    const passwordHash = await hashPassword(body.password);
    const userId = nanoid();
    const now = new Date();

    await db.insert(schema.users).values({
      id: userId,
      email: body.email,
      passwordHash,
      name: body.name,
      createdAt: now,
      updatedAt: now,
    });

    reply.status(201).send({
      userId,
      email: body.email,
      message: 'User registered successfully',
    });
  });

  // Login
  fastify.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, body.email),
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const valid = await verifyPassword(user.passwordHash, body.password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Create session
    const sessionId = nanoid();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(schema.sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt,
      createdAt: new Date(),
    });

    // Set session
    request.session.userId = user.id;

    reply.send({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  });

  // Logout
  fastify.post('/auth/logout', async (request, reply) => {
    const userId = request.session.userId;

    if (userId) {
      // Delete session from database
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
    }

    // Destroy session - must use callback pattern
    request.session.destroy((err) => {
      if (err) {
        reply.status(500).send({ message: 'Failed to logout' });
      } else {
        reply.send({ message: 'Logged out successfully' });
      }
    });
  });

  // Get current user
  fastify.get('/auth/me', { preHandler: requireAuth }, async (request, reply) => {
    const userId = request.session.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      columns: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    reply.send(user);
  });
}
