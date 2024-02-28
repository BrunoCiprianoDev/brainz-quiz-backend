import { IUser, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma"
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Find user by id', () => {

  const dbClientPrisma = new DbClientPrisma();
  let token: string;
  let userSavedTest: IUser;

  beforeAll(async () => {

    const id = await new UuidGenerator().generate();
    token = await new TokenGenerator().generateAuthToken({
      id,
      role: Role.Standard
    })

    const passwordHash = await new PasswordEncryptor().encryptor('p@ssw0rd');
    userSavedTest = {
      id,
      email: 'johnDoe@email.com',
      password: passwordHash,
      role: Role.Standard
    };

    await dbClientPrisma.getInstance().user.create({
      data: userSavedTest
    })

  })
  afterAll(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should return user by id successfully when token container STANDARD permission', async () => {

    const { body, status } = await global.testRequest.get(`/users/findById?id=${userSavedTest.id}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty('email', 'johnDoe@email.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', Role.Standard);
  })

  test('Should return user successfully when token contains ADMIN permission', async () => {
    const tokenAdmin = await new TokenGenerator().generateAuthToken({
      id: userSavedTest.id,
      role: Role.Admin
    })

    const { body, status } = await global.testRequest.get(`/users/findById?id=${userSavedTest.id}`).set('Authorization', `Bearer ${tokenAdmin}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty('email', 'johnDoe@email.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', Role.Standard);
  })


  test('Should return Forbidden when token is invalid', async () => {

    const { body, status } = await global.testRequest.get(`/users/findById?id=${userSavedTest.id}`).set('Authorization', `Bearer INVALID_TOKEN`);

    expect(status).toBe(403);
    expect(body).toHaveProperty('message');
  })

  test('Should return NotFoundError when not found user with input id ', async () => {

    const { body, status } = await global.testRequest.get(`/users/findById?id=UUID`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message');
  })
  test('Should return NotFoundError when attribute ID not found ', async () => {

    const { body, status } = await global.testRequest.get(`/users/findById`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message');
  })

})