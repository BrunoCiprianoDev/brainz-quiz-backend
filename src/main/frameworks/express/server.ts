import express, { Application } from 'express';
import * as http from 'http';
import cors from 'cors';
import routes from './routes';
import { IDbClient } from '../../infrastructure/adapters/dbServer';
import logger from '../../../shared/logger';

export interface IServer {
  start(): Promise<void>;
  close(): Promise<void>;
  getApp(): Application;
}

export class Server implements IServer {
  private server?: http.Server;
  private app: Application = express();

  public constructor(
    private port = 3000,
    private dbClient: IDbClient,
  ) {}

  public async start(): Promise<void> {
    await this.init();
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }

  public getApp(): Application {
    return this.app;
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

  private async init(): Promise<void> {
    await this.databaseSetup();
    this.app.use(express.json());
    this.setupRoutes();
    this.setupCors();
  }

  private async databaseSetup(): Promise<void> {
    try {
      await this.dbClient.connect();
      logger.info(`Database connection '${this.dbClient.constructor.name}' initialized successfully.`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`databaseSetup: ${error.message}`);
      }
      process.exit();
    }
  }

  private async databaseClose(): Promise<void> {
    try {
      await this.dbClient.connect();
      logger.info(`Database connection '${this.dbClient.constructor.name}' closed successfully.`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`database disconection closed: ${error.message}`);
      }
    }
  }

  private setupRoutes(): void {
    try {
      this.app.use(routes);
      logger.info('Routes initialized.');
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`setupRoutes: ${error.message}`);
      }
      process.exit();
    }
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
}
