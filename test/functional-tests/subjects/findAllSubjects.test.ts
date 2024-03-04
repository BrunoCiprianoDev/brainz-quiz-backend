import { ISubject } from "../../../src/domain/subject/models/subject";
import { Role } from "../../../src/domain/user/models/user";
import { DbClientPrisma } from "../../../src/main/infrastructure/prismaOrm/dbClientPrisma";
import { TokenGenerator } from "../../../src/shared/tokenGenerator";
import { UuidGenerator } from "../../../src/shared/uuidGenerator";

describe('Find all subjects functional tests', () => {

  const dbClientPrisma = new DbClientPrisma();
  let token: string;

  beforeAll(async () => {

    const id = await new UuidGenerator().generate();
    token = await new TokenGenerator().generateAuthToken({
      id,
      role: Role.Admin
    })

    const listSubjects: ISubject[] = [];
    for (let cont = 0; cont < 25; cont++) {
      const idRandom = await new UuidGenerator().generate();
      const subject = {
        id: idRandom,
        description: `subject0${cont}`,
        isDeleted: cont < 15 ? false : true,
      };
      listSubjects.push(subject);
    }

    await dbClientPrisma.getInstance().subject.createMany({ data: listSubjects })

  })

  afterAll(async () => {
    await dbClientPrisma.getInstance().subject.deleteMany();
  })

  test('Should return subject by id successfully', async () => {

    const { body, status } = await global.testRequest.get(`/subjects/findAll?page=1&size=15&isDeleted=false`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(15);
    body.forEach((subject: ISubject) => {
      expect(subject).toHaveProperty('id');
      expect(subject).toHaveProperty('description');
      expect(subject).toHaveProperty('isDeleted', false);
    });

  })

  test('Should return a list subject with deletedSubjects', async () => {

    const { body, status } = await global.testRequest.get(`/subjects/findAll?page=1&size=15&isDeleted=true`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(10);
    body.forEach((subject: ISubject) => {
      expect(subject).toHaveProperty('id');
      expect(subject).toHaveProperty('description');
      expect(subject).toHaveProperty('isDeleted', true);
    });

  })

  test('Should return a list subject with size = 5 when all attributes is empty', async () => {

    const { body, status } = await global.testRequest.get(`/subjects/findAll`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(5);
    body.forEach((subject: ISubject) => {
      expect(subject).toHaveProperty('id');
      expect(subject).toHaveProperty('description');
      expect(subject).toHaveProperty('isDeleted', false);
    });

  })

  test('Should return filter result by contains', async () => {

    const { body, status } = await global.testRequest.get(`/subjects/findAll?contains=subject05`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body.length).toBe(1);
    {
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('description', 'subject05');
      expect(body[0]).toHaveProperty('isDeleted', false);
    }
  })
})