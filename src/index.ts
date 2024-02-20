import { Server } from "./frameworks/express/server";
import { DbClientPrisma } from "./infraestructure/prismaORM/ports/dbClientPrisma";
import { loadEnvVariables } from "./shared/enviroment/loadEnvVariables";
import logger from "./shared/logger/logger";
import config from "config";

enum ExitStatus {
  Failure = 1,
  Sucess = 0,
}

(async (): Promise<void> => {
  try {
    await loadEnvVariables();
    const server = new Server(config.get('App.port'), new DbClientPrisma());
    await server.init();
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