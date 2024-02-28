import { IUser, IUserPublicData, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Find All users functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let token: string;
  const listUsers: IUser[] = [];

  beforeAll(async () => {
    token = await new TokenGenerator().generateAuthToken({
      id: '__TEST__',
      role: Role.Admin
    })

    for (let cont = 0; cont < 25; cont++) {
      const idRandom = await new UuidGenerator().generate();
      const user = {
        id: idRandom,
        email: `email0${cont}@email.com`,
        password: `p@ssw0rdAN${cont}`,
        role: Role.Standard,
      };
      listUsers.push(user);
    }

    await dbClientPrisma.getInstance().user.createMany({
      data: listUsers
    });

  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should return a list content 20 users', async () => {

    const input = {
      page: 1,
      size: 20,
      contains: ''
    };

    const { body, status } = await global.testRequest.get(`/users/findAll?page=${input.page}&size=${input.size}&contains=${input.contains}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(20);
    body.forEach((user: IUserPublicData) => {
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).not.toHaveProperty('password');
    });

  });

  test('Should return a list content 12 users when size = 12', async () => {

    const input = {
      page: 1,
      size: 12,
      contains: ''
    };

    const { body, status } = await global.testRequest.get(`/users/findAll?page=${input.page}&size=${input.size}&contains=${input.contains}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(12);
    body.forEach((user: IUserPublicData) => {
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).not.toHaveProperty('password');
    });

  });

  test('Should return a list content 10 users when size = 10 and page = 2', async () => {

    const input = {
      page: 2,
      size: 10,
      contains: ''
    };

    const { body, status } = await global.testRequest.get(`/users/findAll?page=${input.page}&size=${input.size}&contains=${input.contains}`).set('Authorization', `Bearer ${token}`);


    expect(status).toBe(200);
    expect(body.length).toBe(10);
    body.forEach((user: IUserPublicData) => {
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).not.toHaveProperty('password');
    });
  });

  test('Should return a list with size = 5 when all parameters is empty', async () => {

    const { body, status } = await global.testRequest.get(`/users/findAll`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(5);
    body.forEach((user: IUserPublicData) => {
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).not.toHaveProperty('password');
    });
  });

  test('Should filter list by query', async () => {

    const input = {
      page: 1,
      size: 10,
      contains: `email03@email.com`,
    };

    const { body, status } = await global.testRequest.get(`/users/findAll?page=${input.page}&size=${input.size}&contains=${input.contains}`).set('Authorization', `Bearer ${token}`);


    expect(status).toBe(200);
    expect(body.length).toBe(1);
    expect(body[0]).toHaveProperty('email', input.contains);
    expect(body[0]).toHaveProperty('role');
    expect(body[0]).not.toHaveProperty('password');
  });


  test('Should return status code 400 when size > 20', async () => {

    const input = {
      page: 2,
      size: 21,
      contains: ''
    };

    const { body, status } = await global.testRequest.get(`/users/findAll?page=${input.page}&size=${input.size}&contains=${input.contains}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  test('Should return status code 403 when token is invalid', async () => {

    const input = {
      page: 2,
      size: 10,
      contains: ''
    };

    const { body, status } = await global.testRequest.get(`/users/findAll?page=${input.page}&size=${input.size}&contains=${input.contains}`).set('Authorization', `Bearer INVALID_TOKEN`);

    expect(status).toBe(403);
    expect(body).toHaveProperty('message');
  });

})