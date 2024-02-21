import { RoleEnum } from "@src/domain/entities/user";
import { TokenGenerator } from "@src/frameworks/express/ports/tokenGenerator";
import { DbClientPrisma } from "@src/infraestructure/prismaORM/ports/dbClientPrisma";

describe('FindById functional tests', () => {

  let token: string;
  const dbClientPrisma = new DbClientPrisma();

  beforeAll(async () => {
    const tokenResponse = await new TokenGenerator().generateAuthToken({ id: 'any', role: RoleEnum.Admin });
    token = tokenResponse.token;
  })

  afterEach(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should return user by id sucessfully', async () => {

    const currentUser = await dbClientPrisma.getInstance().user.create({
      data: {
        email: 'johnDoe@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      }
    })

    const input = {
      id: currentUser.id,
      role: 'ADMIN'
    }

    const { body, status } = await global.testRequest.get(`/users/findById/${input.id}`).set('Authorization', `Bearer ${token}`).send();

    expect(status).toBe(200);
    expect(body).toHaveProperty('email', 'johnDoe@email.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', "ADMIN");
  });

  test('Should return status code 400 when id is invalid sucessfully', async () => {

    const input = {
      id: 'id',
      role: 'PLAYER'
    }

    const { status } = await global.testRequest.get(`/users/findById/${input.id}`).set('Authorization', `Bearer ${token}`).send();

    expect(status).toBe(404);
  });

});
