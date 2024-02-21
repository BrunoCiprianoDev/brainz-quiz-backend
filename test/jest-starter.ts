import loggerTests from './config/logger-tests';
import { Server } from '@src/frameworks/express/server';
import config from 'config';
import { DbClientPrisma } from '@src/infraestructure/prismaORM/ports/dbClientPrisma';
import supertest from 'supertest';
import { IServer } from '@src/infraestructure/adapters/server';

let server: IServer;

jest.setTimeout(20000);

beforeAll(async () => {
  loggerTests.info('Test..');
  server = new Server(8080, new DbClientPrisma());
  await server.init();
  server.start();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
});
