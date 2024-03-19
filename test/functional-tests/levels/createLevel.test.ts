import { Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Create level functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let token: string;

  beforeAll(async () => {

    const id = await new UuidGenerator().generate();
    token = await new TokenGenerator().generateAuthToken({
      id,
      role: Role.Admin
    })


  })

  afterEach(async () => {
    await dbClientPrisma.getInstance().level.deleteMany();
  })

  test('Should return level created successfully', async () => {

    const input = {
      description: '__DESCRIPTION__',
      points: 0,
    }

    const { body, status } = await global.testRequest.post(`/levels`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('description', input.description);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('isDeleted', false);

  })

  test('Should return BadRequestError when description is null', async () => {

    const input = {
      description: '',
      points: 0,
    }

    const { body, status } = await global.testRequest.post(`/levels`).set('Authorization', `Bearer ${token}`).send(input);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');

  })

})