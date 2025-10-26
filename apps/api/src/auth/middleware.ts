import { FastifyRequest, FastifyReply } from 'fastify';
import { db, schema } from '../db/index.js';
import { eq, and, gt } from 'drizzle-orm';

declare module 'fastify' {
  interface Session {
    userId?: string;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.status(401).send({ error: 'Unauthorized', message: 'Authentication required' });
  }

  // Verify session still exists and is valid
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(schema.sessions.userId, userId),
      gt(schema.sessions.expiresAt, new Date())
    ),
  });

  if (!session) {
    request.session.destroy();
    return reply.status(401).send({ error: 'Unauthorized', message: 'Session expired' });
  }

  // Session is valid
  return;
}
