import { ERROR_MESSAGE_THIS_USER_ALREADY_HAS_PROFILE } from "../../../src/domain/profile/service/createProfileService";
import { IUser, Role } from "../../../src/domain/user/models/user";
import { ERROR_MESSAGE_NOT_FOUND_USER_BY_ID } from "../../../src/domain/user/services/findUserByIdService";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Create profile functional tests', () => {

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

  afterEach(async () => {
    await dbClientPrisma.getInstance().profile.deleteMany();
  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
    await dbClientPrisma.getInstance().profile.deleteMany();
  })

  test('Should return Profile created', async () => {

    const input = {
      name: 'John Doe',
      userId: userSavedTest.id
    }

    const { body, status } = await global.testRequest.post(`/profiles`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', input.name);
    expect(body).toHaveProperty('userId', input.userId);
    expect(body).toHaveProperty('score', 0);

  });

  test('Should return 404 when not found userId', async () => {

    const input = {
      name: 'John Doe',
      userId: '****'
    }

    const { body, status } = await global.testRequest.post(`/profiles`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', ERROR_MESSAGE_NOT_FOUND_USER_BY_ID);
  });


  test('Should return 400 when user already has profile', async () => {


    const userId = await new UuidGenerator().generate();
    const passwordHash = await new PasswordEncryptor().encryptor('p@ssw0rd');
    userSavedTest = {
      id: userId,
      email: 'superUserTEST@email.com',
      password: passwordHash,
      role: Role.Standard
    };

    await dbClientPrisma.getInstance().user.create({
      data: userSavedTest
    })

    await dbClientPrisma.getInstance().profile.create({
      data: {
        id: await new UuidGenerator().generate(),
        name: 'Super User',
        userId: userId,
        score: 0
      }
    })

    const input = {
      userId: userId,
      name: 'New Profile'
    }

    const { body, status } = await global.testRequest.post(`/profiles`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', ERROR_MESSAGE_THIS_USER_ALREADY_HAS_PROFILE);
  });

  test('Should return 404 when all attribute is empty', async () => {

    const input = {}

    const { body, status } = await global.testRequest.post(`/profiles`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', ERROR_MESSAGE_NOT_FOUND_USER_BY_ID);
  });



})