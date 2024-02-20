import { IResponse } from '@src/domain/interfaces/adapters/httpContext';
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

export abstract class ErrorHandlerControllers {
  protected handleClientErrors(error: unknown): IResponse {
    if (error instanceof AppError) {
      return {
        statusCode: error.code,
        body: {
          message: error.message,
        },
      };
    }
    return {
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    };
  }
}
