import { DbClientPrisma } from '@src/infraestructure/prismaORM/ports/dbClientPrisma';
import loggerTests from '@test/config/logger-tests';
import request from 'supertest';

describe('CreateUser functional tests', () => {
  test('Should create user sucessfully', async () => {
    const dbClient = new DbClientPrisma().getInstance();
    const result = await dbClient.user.create({
      data: {
        email: 'cipriano990@gmail.com',
        password: 'p@ssw0rd',
        role: 'ADMIN',
      },
    });

    expect(result).toBeInstanceOf({
      email: 'cipriano990@gmail.com',
      password: 'p@ssw0rd',
      role: 'ADMIN',
    });

    /*const input = {
      email: 'cipriano990@gmail.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
    };

    const { body, status } = await global.testRequest.post('/users').send(input);

    expect(status).toBe(201);
    console.log(body);

    //expect().toEqual({ message: 'any' });*/
  });
});
