import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { DbClientPrisma } from '../dbClientPrisma';
import logger from '../../../../shared/logger';

export default abstract class BaseRepositoryPrisma {
  constructor(protected dbClientInstance = new DbClientPrisma().getInstance()) {}

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      if (error instanceof PrismaClientKnownRequestError) {
        logger.error(error.message);
        throw new Error(error.message);
      }
      if (error instanceof PrismaClientUnknownRequestError) {
        logger.error(error.message);
        throw new Error(error.message);
      }
      if (error instanceof PrismaClientValidationError) {
        logger.error(error.message);
        throw new Error(error.message);
      }
    }
    logger.error('Something unexpeted happened to the database');
    throw new Error('Something unexpeted happened to the database');
  }
}
