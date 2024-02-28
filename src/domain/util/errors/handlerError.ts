import { IResponse } from '../adapters/httpContext';
import { AppError, InternalServerError } from './appErrors';

export abstract class ErrorHandlerServices {
  protected handleError(error: unknown): never {
    if (error instanceof AppError) {
      throw error;
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
