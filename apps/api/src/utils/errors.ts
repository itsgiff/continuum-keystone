export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function setupErrorHandler(fastify: any) {
  fastify.setErrorHandler((error: any, _request: any, reply: any) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Log error
    if (statusCode >= 500) {
      console.error('Server error:', error);
    }

    // Handle Zod validation errors
    if (error.code === 'VALIDATION_ERROR' || error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.validation,
      });
    }

    // Handle app errors
    reply.status(statusCode).send({
      error: error.name || 'Error',
      message,
      ...(error.code && { code: error.code }),
    });
  });
}
