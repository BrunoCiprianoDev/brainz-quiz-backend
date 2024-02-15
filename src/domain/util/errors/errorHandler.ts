import { AppError, BadRequestError, InternalServerError } from './appErrors';
import { ValidationError } from './validationError';

export abstract class ErrorHandlerUseCases {
  protected handleError(error: unknown): never {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof ValidationError) {
      throw new BadRequestError(error.message);
    }

    throw new InternalServerError();
  }
}
