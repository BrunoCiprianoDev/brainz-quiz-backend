import { IUser, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Get update password token tests', () => {

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
      role: Role.Admin
    };

    await dbClientPrisma.getInstance().user.create({
      data: userSavedTest
    })

  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should return update password successfully', async () => {

    const tokenUpdatePassword = await new TokenGenerator().generateTokenResetPass({
      id: userSavedTest.id,
      email: userSavedTest.email,
      role: userSavedTest.role
    })

    const { body, status } = await global.testRequest.patch(`/users/password`).send({
      token: tokenUpdatePassword,
      password: 'newPassword',
      confirmPassword: 'newPassword'
    });

    expect(status).toBe(204);
    expect(body).toMatchObject({})

    const userUpdated = await dbClientPrisma.getInstance().user.findUnique({ where: { id: userSavedTest.id } })
    const sut = await new PasswordEncryptor().passwordCompare({ password: 'newPassword', passwordEncrypt: userUpdated?.password ?? '' });

    expect(sut).toEqual(true);

  })

  test('Should return BadRequestError when password and confirmPassword not matches', async () => {

    const tokenUpdatePassword = await new TokenGenerator().generateTokenResetPass({
      id: userSavedTest.id,
      email: userSavedTest.email,
      role: userSavedTest.role
    })

    const { body, status } = await global.testRequest.patch(`/users/password`).send({
      token: tokenUpdatePassword,
      password: 'newPassword',
      confirmPassword: '****'
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  })

  test('Should return BadRequestError when password is not valid', async () => {

    const tokenUpdatePassword = await new TokenGenerator().generateTokenResetPass({
      id: userSavedTest.id,
      email: userSavedTest.email,
      role: userSavedTest.role
    })

    const { body, status } = await global.testRequest.patch(`/users/password`).send({
      token: tokenUpdatePassword,
      password: '****',
      confirmPassword: '****'
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  })

  test('Should return BadRequestError when token is invalid', async () => {

    const { body, status } = await global.testRequest.patch(`/users/password`).send({
      token: 'INVALID_TOKEN',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd'
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  })

})