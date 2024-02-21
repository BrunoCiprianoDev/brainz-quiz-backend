import logger from '@src/shared/logger/logger';
import util from 'util';
import { exec } from 'child_process';

export async function loadEnvVariables(): Promise<void> {
  try {
    const NODE_ENV = process.env.NODE_ENV as string;
    if (NODE_ENV !== 'production') {
      const execSync = util.promisify(exec);
      await execSync(`prisma migrate deploy`);
    }
    logger.info(`Initialized ${NODE_ENV} environment variables`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      throw Error(error.message);
    }
    logger.error('An error occurred when initializing environment variables');
    throw Error('An error occurred when initializing environment variables');
  }
}
