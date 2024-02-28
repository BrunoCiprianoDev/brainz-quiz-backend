import supertest from 'supertest';
import loggerTests from './config/logger-tests';
import { DbClientPrisma } from '../src/main/infrastructure/prismaOrm/dbClientPrisma';
import { IServer, Server } from '../src/main/frameworks/express/server';

let server: IServer;

beforeAll(async () => {
  loggerTests.info('Test...');
  server = new Server(8080, new DbClientPrisma());
  await server.start();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
});