import { ISubject } from "../../../src/domain/subject/models/subject";
import { Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Find subject by id functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let subjectSaved: ISubject;
  let token: string;

  beforeAll(async () => {

    const id = await new UuidGenerator().generate();
    token = await new TokenGenerator().generateAuthToken({
      id,
      role: Role.Admin
    })

    subjectSaved = await dbClientPrisma.getInstance().subject.create({
      data: {
        id: await new UuidGenerator().generate(),
        description: '__TEST__',
        isDeleted: false
      }
    })

  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().subject.deleteMany();
  })

  test('Should return subject by id successfully', async () => {

    const input = subjectSaved.id;

    const { body, status } = await global.testRequest.get(`/subjects/findById?id=${input}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toMatchObject(subjectSaved);
  })


  test('Should return NotFoundError when not found subject by id', async () => {
    const input = '__ANY_UUID__';

    const { body, status } = await global.testRequest.get(`/subjects/findById?id=${input}`).set('Authorization', `Bearer ${token}`);


    expect(status).toBe(404);
    expect(body).toHaveProperty('message');

  })

})