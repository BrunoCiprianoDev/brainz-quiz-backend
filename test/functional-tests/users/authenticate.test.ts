import { IUser, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma"
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
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

  test('Should return valid token successfully', async () => {

    const { body, status } = await global.testRequest.post(`/users/auth`).send({
      email: userSavedTest.email,
      password: passwordStd
    });

    const token = body.token as string;


    const { id, role } = await new TokenGenerator().getPayloadAuthToken(token);

    expect(status).toBe(200);
    expect(userSavedTest.id).toEqual(id);
    expect(userSavedTest.role).toEqual(role);

  })

  test('Should return 403 when email is invalid', async () => {

    const { body, status } = await global.testRequest.post(`/users/auth`).send({
      email: '****',
      password: passwordStd
    });

    expect(status).toBe(403);
    expect(body).toHaveProperty('message');

  })

  test('Should return 403 when password is invalid', async () => {

    const { body, status } = await global.testRequest.post(`/users/auth`).send({
      email: userSavedTest.email,
      password: '****'
    });

    expect(status).toBe(403);
    expect(body).toHaveProperty('message');

  })

})