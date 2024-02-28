import { IUser, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Auth user by credentials tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  const passwordStd = 'p@ssw0rd';
  let userSavedTest: IUser;


  beforeAll(async () => {
    const id = await new UuidGenerator().generate();
    const passwordHash = await new PasswordEncryptor().encryptor(passwordStd);
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

  test('Should return 204 when is valid email', async () => {

    const { body, status } = await global.testRequest.get(`/users/password/getTokenUpdatePassword?email=${userSavedTest.email}`);

    expect(status).toBe(204);
    expect(body).toMatchObject({})

  })

  test('Should return 404 when email is not valid', async () => {

    const { body, status } = await global.testRequest.get(`/users/password/getTokenUpdatePassword?email=****`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message')

  })
})