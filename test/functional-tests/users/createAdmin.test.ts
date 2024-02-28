import { Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";

describe('Create ADMIN functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let token: string;


  beforeAll(async () => {
    token = await new TokenGenerator().generateAuthToken({
      id: '__TEST__',
      role: Role.Admin
    })
  })

  afterEach(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should create user sucessfully', async () => {

    const input = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
    };

    const { body, status } = await global.testRequest.post('/users/admin').set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(201);
    expect(body).toHaveProperty('email', 'johnDoe@email.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', "ADMIN");
  });

  test('Should return 400 when password and confirmPassword not matches', async () => {

    const userReference = {
      email: 'test@email.com',
      password: 'p@ssw0rd',
      role: 'ADMIN'
    }

    await dbClientPrisma.getInstance().user.create({ data: userReference })

    const { body, status } = await global.testRequest.post('/users/admin').set('Authorization', `Bearer ${token}`).send({
      email: 'test@email.com',
      password: 'p@ssw0rd',
      confirmPassword: '',
      role: 'ADMIN'
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return 400 when email is exists', async () => {

    const userReference = {
      email: 'test@email.com',
      password: 'p@ssw0rd',
      role: 'ADMIN'
    }

    await dbClientPrisma.getInstance().user.create({ data: userReference })

    const { body, status } = await global.testRequest.post('/users/admin').set('Authorization', `Bearer ${token}`).send({
      email: 'test@email.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssword',
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return 400 when email is invalid', async () => {

    const { body, status } = await global.testRequest.post('/users/admin').set('Authorization', `Bearer ${token}`).send({
      email: 'anyString',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssword',
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return 400 when password is invalid', async () => {

    const { body, status } = await global.testRequest.post('/users/admin').set('Authorization', `Bearer ${token}`).send({
      email: 'john Doe',
      password: 'pass',
      confirmPassword: 'pass',
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });


  test('Should return 400 when invalid attributes', async () => {

    const { body, status } = await global.testRequest.post('/users/admin').set('Authorization', `Bearer ${token}`).send({});

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return 403 when invalid TOKEN', async () => {

    const { body, status } = await global.testRequest.post('/users/admin').set('Authorization', `Bearer INVALID_TOKEN`).send({});

    expect(status).toBe(403);
    expect(body).toHaveProperty('message');
  });

});