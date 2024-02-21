import { Application } from 'express';

export interface IServer {
  init(): Promise<void>;
  setupRoutes(): void;
  setupCors(): void;
  databaseSetup(): Promise<void>;
  databaseClose(): Promise<void>;
  start(): void;
  close(): Promise<void>;
  getApp(): Application;
}
