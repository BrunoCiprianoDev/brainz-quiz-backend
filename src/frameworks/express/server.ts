import { IDbClient } from '@src/infraestructure/adapters/dbClient';
import express, { Application } from 'express';
import * as http from 'http';
import cors from 'cors';
import '../../shared/moduleAlias/moduleAlias';
import logger from '@src/shared/logger/logger';
import routes from './routes';
import { IServer } from '@src/infraestructure/adapters/server';

export class Server implements IServer {
  private server?: http.Server;
  private app: Application = express();

  public constructor(
    private port = 3000,
    private dbClient: IDbClient,
  ) {}

  public async init(): Promise<void> {
    await this.databaseSetup();
    this.setupCors();
    this.app.use(express.json());
    this.setupRoutes();
  }

  public setupRoutes(): void {
    this.app.use(routes);
    logger.info('Initialized routes');
  }

  public setupCors(): void {
    this.app.use(
      cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
      }),
    );
    logger.info('Initialized cors');
  }

  public async databaseSetup(): Promise<void> {
    try {
      await this.dbClient.connect();
      logger.info(`Database connection '${this.dbClient.constructor.name}' successfully initialized.`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`databaseSetup: ${error.message}`);
      } else {
        logger.error(`databaseSetup: ${error}`);
      }
      process.exit();
    }
  }

  public async databaseClose(): Promise<void> {
    await this.dbClient.disconnect();
    logger.info('Database connection closed');
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }

  public async close(): Promise<void> {
    await this.databaseClose();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close(err => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public getApp(): Application {
    return this.app;
  }
}
