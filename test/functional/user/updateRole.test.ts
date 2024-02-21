import { RoleEnum } from "@src/domain/entities/user";
import { TokenGenerator } from "@src/frameworks/express/ports/tokenGenerator";
import { DbClientPrisma } from "@src/infraestructure/prismaORM/ports/dbClientPrisma";

describe('UpdateRole functional tests', () => {

  let token: string;
  const dbClientPrisma = new DbClientPrisma();

  beforeAll(async () => {
    const tokenResponse = await new TokenGenerator().generateAuthToken({ id: 'any', role: RoleEnum.Admin });
    token = tokenResponse.token;
  })

  afterEach(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should update role user sucessfully', async () => {

    const currentUser = await dbClientPrisma.getInstance().user.create({
      data: {
        email: 'johnDoe@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      }
    })

    const input = {
      id: currentUser.id,
      role: 'PLAYER'
    }

    const { body, status } = await global.testRequest.patch('/users/role').set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(200);
    expect(body).toHaveProperty('email', 'johnDoe@email.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', "PLAYER");
  });

  test('Should return status code 400 when id is invalid sucessfully', async () => {

    const input = {
      id: 'id',
      role: 'PLAYER'
    }

    const { status } = await global.testRequest.patch('/users/role').set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(404);
  });

  test('Should return status code 400 when role is invalid sucessfully', async () => {

    const currentUser = await dbClientPrisma.getInstance().user.create({
      data: {
        email: 'johnDoe@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      }
    })

    const input = {
      id: currentUser.id,
      role: 'ANY'
    }

    const { status } = await global.testRequest.patch('/users/role').set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(400);
  });

});
