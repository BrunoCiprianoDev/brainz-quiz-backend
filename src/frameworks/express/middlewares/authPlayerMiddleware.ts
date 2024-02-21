import { AppError, ForbiddenError } from '@src/domain/util/errors';
import { NextFunction, Request, Response } from 'express';
import { TokenGenerator } from '../ports/tokenGenerator';

export async function authPlayerMiddleware(request: Request, response: Response, nextFunction: NextFunction) {
  try {
    const authToken = request.headers.authorization as string;

    if (!authToken || authToken.trim() === '') {
      return response.status(403).json({ message: 'Token not found' });
    }
    const [, token] = authToken.split(' ');
    const { role } = await new TokenGenerator().getPayloadAuthToken(token);
    if (role !== 'PLAYER' && role !== 'ADMIN')
      throw new ForbiddenError('Access denied. User does not have the required role for this action');
    return nextFunction();
  } catch (error) {
    if (error instanceof AppError) {
      return response.status(403).json({ message: error.message });
    }
    if (error instanceof Error) {
      return response.status(403).json({ message: error.message });
    }
    return response.status(500).json({ message: 'Unexpected error occurred' });
  }
}
