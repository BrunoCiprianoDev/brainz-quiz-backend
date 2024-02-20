import { config as dotenvConfig } from 'dotenv';
import config from 'config';
import logger from '@src/shared/logger/logger';

export async function loadEnvVariables(): Promise<void> {
  try {
    const NODE_ENV = process.env.NODE_ENV as string;
    if (NODE_ENV !== 'production') {
      dotenvConfig({ path: '.env' });
      const databaseUrl = config.get('database.url');
      const directUrl = config.get('database.directUrl');
      process.env.DATABASE_URL = `${databaseUrl}`;
      process.env.DATABASE_SCHEMA = `${directUrl}`;
    }
    logger.info(`Initialized development ${NODE_ENV} environment variables`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      throw Error(error.message);
    }
    logger.error('An error occurred when initializing environment variables');
    throw Error('An error occurred when initializing environment variables');
  }
}