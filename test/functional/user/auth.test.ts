import { PasswordEncryptor } from "@src/frameworks/express/ports/passwordEncryptor";
import { TokenGenerator } from "@src/frameworks/express/ports/tokenGenerator";
import { DbClientPrisma } from "@src/infraestructure/prismaORM/ports/dbClientPrisma";

describe('Auth functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();

  afterEach(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should return user by id sucessfully', async () => {

    const password = 'p@ssw0rd'
    const passwordEncrypted = await new PasswordEncryptor().encryptor({ password });

    const currentUser = await dbClientPrisma.getInstance().user.create({
      data: {
        email: 'johnDoe@email.com',
        password: passwordEncrypted,
        role: 'ADMIN'
      }
    })

    const { body, status } = await global.testRequest.post(`/users/auth`).send({ email: currentUser.email, password });

    const token = body.token;
    const { id, role } = await new TokenGenerator().getPayloadAuthToken(token);

    expect(status).toBe(200);
    expect(id).toEqual(currentUser.id);
    expect(role).toEqual(currentUser.role);
  });

  test('Should return status code 403 when credentials is invalid sucessfully', async () => {

    const input = {
      email: 'email@email.com',
      password: 'pass'
    }

    const { status } = await global.testRequest.post(`/users/auth`).send(input);

    expect(status).toBe(403);
  });

});
