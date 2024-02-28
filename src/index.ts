import logger from './shared/logger';
import { Server } from './main/frameworks/express/server';
import { DbClientPrisma } from './main/infrastructure/prismaOrm/dbClientPrisma';

const API_PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : undefined;

enum ExitStatus {
  Failure = 1,
  Sucess = 0,
}

(async (): Promise<void> => {
  try {
    const server = new Server(API_PORT, new DbClientPrisma());
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    for (const exitSignal of exitSignals) {
      process.on(exitSignal, async () => {
        try {
          await server.close();
          logger.info(`App exited with success`);
          process.exit(ExitStatus.Sucess);
        } catch (error) {
          logger.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      });
    }
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
