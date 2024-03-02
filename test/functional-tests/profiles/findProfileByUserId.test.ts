import { IProfile } from "../../../src/domain/profile/models/profile";
import { ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_USER_ID } from "../../../src/domain/profile/service/findProfileByUserIdService";
import { IUser, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Find profile by user id functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let token: string;
  let userSavedTest: IUser;
  let profileSavedTest: IProfile;


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

    profileSavedTest = await dbClientPrisma.getInstance().profile.create({
      data: {
        id: await new UuidGenerator().generate(),
        name: 'Super User',
        userId: id,
        score: 0
      }
    })

  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().user.deleteMany();
    await dbClientPrisma.getInstance().profile.deleteMany();
  })

  test('Should return a profile by user id', async () => {

    const input = userSavedTest.id;

    const { body, status } = await global.testRequest.get(`/profiles/findByUserId?userId=${input}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', profileSavedTest.name);
    expect(body).toHaveProperty('userId', profileSavedTest.userId);
    expect(body).toHaveProperty('score', 0);
  })

  test('Should return 404 when not found user by id', async () => {

    const input = '***';

    const { body, status } = await global.testRequest.get(`/profiles/findByUserId?userId=${input}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_USER_ID);
  })
})

