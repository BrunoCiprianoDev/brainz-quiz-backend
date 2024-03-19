import { ILevel } from "../../../src/domain/level/models/level";
import { Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Find level by id functional tests', () => {

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

  afterAll(async () => {
    await dbClientPrisma.getInstance().level.deleteMany();
  })

  test('Should return level by id successfully', async () => {

    const input = levelSaved.id;

    const { body, status } = await global.testRequest.get(`/levels/findById?id=${input}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toMatchObject(levelSaved);
  })


  test('Should return NotFoundError when not found level by id', async () => {
    const input = '__ANY_UUID__';

    const { body, status } = await global.testRequest.get(`/levels/findById?id=${input}`).set('Authorization', `Bearer ${token}`);


    expect(status).toBe(404);
    expect(body).toHaveProperty('message');

  })

})