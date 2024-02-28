import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";

describe('Create STANDARD functional tests', () => {

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
    expect(body).toHaveProperty('role', "STANDARD");
  });

  test('Should return 400 when password and confirmPassword not matches', async () => {

    const userReference = {
      email: 'test@email.com',
      password: 'p@ssw0rd',
      role: 'STANDARD'
    }

    await dbClientPrisma.getInstance().user.create({ data: userReference })

    const { body, status } = await global.testRequest.post('/users').send({
      email: 'test@email.com',
      password: 'p@ssw0rd',
      confirmPassword: '',
      role: 'STANDARD'
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return 400 when email is exists', async () => {

    const userReference = {
      email: 'test@email.com',
      password: 'p@ssw0rd',
      role: 'STANDARD'
    }

    await dbClientPrisma.getInstance().user.create({ data: userReference })

    const { body, status } = await global.testRequest.post('/users').send({
      email: 'test@email.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssword',
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return 400 when email is invalid', async () => {

    const { body, status } = await global.testRequest.post('/users').send({
      email: 'anyString',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssword',
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return 400 when password is invalid', async () => {

    const { body, status } = await global.testRequest.post('/users').send({
      email: 'john Doe',
      password: 'pass',
      confirmPassword: 'pass',
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });


  test('Should return 400 when invalid attributes', async () => {

    const { body, status } = await global.testRequest.post('/users').send({});

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });
});