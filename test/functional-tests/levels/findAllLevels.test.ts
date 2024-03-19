import { ILevel } from "../../../src/domain/level/models/level";
import { Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Find all levels functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let token: string;

  beforeAll(async () => {

    const id = await new UuidGenerator().generate();
    token = await new TokenGenerator().generateAuthToken({
      id,
      role: Role.Admin
    })

    const listlevels: ILevel[] = [];
    for (let cont = 0; cont < 25; cont++) {
      const idRandom = await new UuidGenerator().generate();
      const level = {
        id: idRandom,
        description: `level0${cont}`,
        points: 10,
        isDeleted: cont < 15 ? false : true,
      };
      listlevels.push(level);
    }

    await dbClientPrisma.getInstance().level.createMany({ data: listlevels })

  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().level.deleteMany();
  })

  test('Should return level by id successfully', async () => {

    const { body, status } = await global.testRequest.get(`/levels/findAll?page=1&size=15&isDeleted=false`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(15);
    body.forEach((level: ILevel) => {
      expect(level).toHaveProperty('id');
      expect(level).toHaveProperty('description');
      expect(level).toHaveProperty('points');
      expect(level).toHaveProperty('isDeleted', false);
    });

  })

  test('Should return a list level with deletedlevels', async () => {

    const { body, status } = await global.testRequest.get(`/levels/findAll?page=1&size=15&isDeleted=true`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(10);
    body.forEach((level: ILevel) => {
      expect(level).toHaveProperty('id');
      expect(level).toHaveProperty('description');
      expect(level).toHaveProperty('points');
      expect(level).toHaveProperty('isDeleted', true);
    });

  })

  test('Should return a list level with size = 5 when all attributes is empty', async () => {

    const { body, status } = await global.testRequest.get(`/levels/findAll`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(5);
    body.forEach((level: ILevel) => {
      expect(level).toHaveProperty('id');
      expect(level).toHaveProperty('description');
      expect(level).toHaveProperty('points');
      expect(level).toHaveProperty('isDeleted', false);
    });

  })

  test('Should return filter result by contains', async () => {

    const { body, status } = await global.testRequest.get(`/levels/findAll?contains=level05`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(1);
    {
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('description', 'level05');
      expect(body[0]).toHaveProperty('points');
      expect(body[0]).toHaveProperty('isDeleted', false);
    }
  })
})