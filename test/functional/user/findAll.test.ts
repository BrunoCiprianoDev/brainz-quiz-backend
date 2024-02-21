import { RoleEnum } from "@src/domain/entities/user";
import { TokenGenerator } from "@src/frameworks/express/ports/tokenGenerator";
import { DbClientPrisma } from "@src/infraestructure/prismaORM/ports/dbClientPrisma";

describe('FindAll functional tests', () => {

  let token: string;
  const dbClientPrisma = new DbClientPrisma();

  beforeAll(async () => {
    const tokenResponse = await new TokenGenerator().generateAuthToken({ id: 'any', role: RoleEnum.Admin });
    token = tokenResponse.token;
  })

  afterEach(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should return all user sucessfully', async () => {

    await dbClientPrisma.getInstance().user.createMany({
      data: [{
        email: 'nameOne@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      },
      {
        email: 'nameTwo@email.com',
        password: 'p@ssw0rd',
        role: 'PLAYER'
      }]
    })

    const { body, status } = await global.testRequest.get(`/users/findAll?query=&size=2&page=1`).set('Authorization', `Bearer ${token}`).send();

    expect(status).toBe(200);
    expect(body.length).toBe(2);
  });

  test('Should filter user by query sucessfully', async () => {

    await dbClientPrisma.getInstance().user.createMany({
      data: [{
        email: 'nameOne@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      },
      {
        email: 'nameTwo@email.com',
        password: 'p@ssw0rd',
        role: 'PLAYER'
      }]
    })

    const { body, status } = await global.testRequest.get(`/users/findAll?query=One&size=2&page=1`).set('Authorization', `Bearer ${token}`).send();

    expect(status).toBe(200);
    expect(body.length).toBe(1);
    expect(body[0].email).toEqual('nameOne@email.com');
  });

  test('Should return list length equals size sucessfully', async () => {

    await dbClientPrisma.getInstance().user.createMany({
      data: [{
        email: 'nameOne@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      },
      {
        email: 'nameTwo@email.com',
        password: 'p@ssw0rd',
        role: 'PLAYER'
      },
      {
        email: 'nameThree@email.com',
        password: 'p@ssw0rd',
        role: 'PLAYER'
      }]
    })

    const { body, status } = await global.testRequest.get(`/users/findAll?query=&size=2&page=1`).set('Authorization', `Bearer ${token}`).send();

    expect(status).toBe(200);
    expect(body.length).toBe(2);
  });

  test('Should return status code 400 erro when invalid params', async () => {

    await dbClientPrisma.getInstance().user.createMany({
      data: [{
        email: 'nameOne@email.com',
        password: 'p@ssw0rd',
        role: 'ADMIN'
      },
      {
        email: 'nameTwo@email.com',
        password: 'p@ssw0rd',
        role: 'PLAYER'
      }]
    })

    const { status } = await global.testRequest.get(`/users/findAll?query=&size=20&page=0`).set('Authorization', `Bearer ${token}`).send();

    expect(status).toBe(400);
  });
});
