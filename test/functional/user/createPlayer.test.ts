import { DbClientPrisma } from "@src/infraestructure/prismaORM/ports/dbClientPrisma";

describe('CreatePlayer functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();

  afterEach(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should create user sucessfully', async () => {

    const input = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
    };

    const { body, status } = await global.testRequest.post('/users').send(input);

    expect(status).toBe(201);
    expect(body).toHaveProperty('email', 'johnDoe@email.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', "PLAYER");
  });

  test('Should return 400 when email is exists', async () => {

    const userReference = {
      email: 'test@email.com',
      password: 'p@ssw0rd',
      role: 'PLAYER'
    }

    await dbClientPrisma.getInstance().user.create({ data: userReference })

    const { body, status } = await global.testRequest.post('/users').send({
      email: 'test@email.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssword',
      role: 'PLAYER'
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  })

  test('Should return 400 when password and confirmPassword not matches', async () => {

    const userReference = {
      email: 'test@email.com',
      password: 'p@ssw0rd',
      role: 'PLAYER'
    }

    await dbClientPrisma.getInstance().user.create({ data: userReference })

    const { body, status } = await global.testRequest.post('/users').send({
      email: 'test@email.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssword',
      role: 'PLAYER'
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  })
});
