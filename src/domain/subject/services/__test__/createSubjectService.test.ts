import { IuuidGenerator } from '../../../util/adapters/uuidGenerator';
import { BadRequestError } from '../../../util/errors/appErrors';
import { ISubjectRepository } from '../../repositories/subjectRepository';
import { CreateSubjectService, ICreateSubjectService } from '../createSubjectService';

describe('Create subject service tests', () => {
  let uuidGenerator: Partial<IuuidGenerator>;
  let subjectRepository: Partial<ISubjectRepository>;
  let createSubjectService: ICreateSubjectService;

  beforeAll(async () => {
    subjectRepository = {
      create: jest.fn(),
    };

    uuidGenerator = {
      generate: jest.fn(),
    };

    createSubjectService = new CreateSubjectService(
      uuidGenerator as IuuidGenerator,
      subjectRepository as ISubjectRepository,
    );
  });

  test('Should return Subject created successfully', async () => {
    const input = 'SUBJECT_STRING';

    jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('9111c6f9-758f-4e95-ba52-91fed7e46f38');
    jest.spyOn(subjectRepository, 'create').mockClear();

    const sut = await createSubjectService.execute(input);

    expect(sut).toMatchObject({
      id: '9111c6f9-758f-4e95-ba52-91fed7e46f38',
      description: input,
      isDeleted: false,
    });
    expect(subjectRepository.create).toHaveBeenCalledWith({
      id: '9111c6f9-758f-4e95-ba52-91fed7e46f38',
      description: input,
      isDeleted: false,
    });
  });

  test('Should return BadRequestError when description is invalid', async () => {
    const input = '';

    jest.spyOn(uuidGenerator, 'generate').mockClear();
    jest.spyOn(subjectRepository, 'create').mockClear();

    await expect(createSubjectService.execute(input)).rejects.toBeInstanceOf(BadRequestError);
    expect(uuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(subjectRepository.create).toHaveBeenCalledTimes(0);
  });
});
