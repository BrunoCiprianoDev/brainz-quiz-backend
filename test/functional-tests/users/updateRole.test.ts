import { IUser, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Update role tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  const passwordStd = 'p@ssw0rd';
  let token: string;
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

    token = await new TokenGenerator().generateAuthToken({ id: userSavedTest.id, role: Role.Admin })

  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
  })

  test('Should return user with updated role', async () => {

    const { body, status } = await global.testRequest.patch(`/users/role`).send({
      id: userSavedTest.id,
      role: 'ADMIN'
    }).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toMatchObject({
      email: userSavedTest.email,
      id: userSavedTest.id,
      role: 'ADMIN'
    });

  });


  test('Should return BadRequestError when role is invalid', async () => {

    const { body, status } = await global.testRequest.patch(`/users/role`).send({
      id: userSavedTest.id,
      role: '****'
    }).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message')

  });

  test('Should return BadRequestError when id is not found', async () => {

    const { body, status } = await global.testRequest.patch(`/users/role`).send({
      id: '****',
      role: Role.Admin
    }).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message')

  });


  test('Should return an error when trying to update a rule other than admin and exists only had 2 admins', async () => {

    const { body, status } = await global.testRequest.patch(`/users/role`).send({
      id: userSavedTest.id,
      role: Role.Standard
    }).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message')

  });


  test('Should return BadRequestError when token not contains ADMIN permission', async () => {

    const tokenStandardPermission = await new TokenGenerator().generateAuthToken({ id: '__TEST__', role: Role.Standard })

    const { body, status } = await global.testRequest.patch(`/users/role`).send({
      id: userSavedTest.id,
      role: Role.Standard
    }).set('Authorization', `Bearer ${tokenStandardPermission}`);

    expect(status).toBe(403);
    expect(body).toHaveProperty('message')

  });

})