import { IProfile } from "../../../src/domain/profile/models/profile";
import { IUser, Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { PasswordEncryptor } from "../../../src/shared/passwordEncryptor";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Update profile functional tests', () => {

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

  test('Should return a profile with updated name', async () => {

    const input = {
      id: profileSavedTest.id,
      name: 'NEW_PROFILE_NAME'
    };

    const { body, status } = await global.testRequest.patch(`/profiles/update/name`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', input.name);
    expect(body).toHaveProperty('userId', profileSavedTest.userId);
    expect(body).toHaveProperty('score');
  })

  test('Should return 404 when not found profile by id', async () => {


    const input = {
      id: '****',
      name: 'NEW_PROFILE_NAME'
    };

    const { body, status } = await global.testRequest.patch(`/profiles/update/name`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message',);
  })

})

