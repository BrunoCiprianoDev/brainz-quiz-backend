import { TokenGenerator } from "@src/frameworks/express/ports/tokenGenerator";
import { DbClientPrisma } from "@src/infraestructure/prismaORM/ports/dbClientPrisma";

describe('UpdatePassword functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();

  afterEach(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should update password user sucessfully', async () => {

    const currentUser = await dbClientPrisma.getInstance().user.create({
      data: {
        email: 'johnDoe@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      }
    })

    const { token } = await new TokenGenerator().generateTokenResetPass(currentUser);

    const input = {
      token: token,
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
    }

    const { body, status } = await global.testRequest.patch('/users/updatePassword').send(input);

    expect(status).toBe(200);
    expect(body).toHaveProperty('email', 'johnDoe@email.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', "ADMIN");
  });

  test('Should 404 when password and confirmPassword not maches', async () => {

    const currentUser = await dbClientPrisma.getInstance().user.create({
      data: {
        email: 'johnDoe@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      }
    })

    const { token } = await new TokenGenerator().generateTokenResetPass(currentUser);

    const input = {
      token: token,
      password: 'p@ssw0rd',
      confirmPassword: 'any',
    }

    const { status } = await global.testRequest.patch('/users/updatePassword').send(input);

    expect(status).toBe(400);
  });

  test('Should 404 when token is invalid not maches', async () => {

    const input = {
      token: 'any',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
    }

    const { status } = await global.testRequest.patch('/users/updatePassword').send(input);

    expect(status).toBe(400);
  });

});
