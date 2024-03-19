import { ILevel } from "../../../src/domain/level/models/level";
import { Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Update level functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let levelSaved: ILevel;
  let token: string;

  beforeAll(async () => {

    const id = await new UuidGenerator().generate();
    token = await new TokenGenerator().generateAuthToken({
      id,
      role: Role.Admin
    })

    levelSaved = await dbClientPrisma.getInstance().level.create({
      data: {
        id: await new UuidGenerator().generate(),
        description: '__TEST__',
        points: 10,
        isDeleted: false
      }
    })

  })

  afterEach(async () => {
    await dbClientPrisma.getInstance().profile.deleteMany();
  })

  test('Should return level updated successfully', async () => {

    const input = {
      ...levelSaved,
      description: '__NEW_DESCRIPTION__'
    }

    const { body, status } = await global.testRequest.put(`/levels`).set('Authorization', `Bearer ${token}`).send(input);


    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('description', input.description);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('isDeleted', false);

  })


  test('Should return BadRequestError when description is null', async () => {

    const input = {
      id: '__ANY_UUID__',
      isDeleted: false,
      description: '__ANY_DESCRIPTION__'
    }

    const { body, status } = await global.testRequest.put(`/levels`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message');

  })

  test('Should return BadRequestError when description is null', async () => {

    const input = {
      ...levelSaved,
      description: ''
    }

    const { body, status } = await global.testRequest.post(`/levels`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');

  })

})