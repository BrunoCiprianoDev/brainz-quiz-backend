import { ISubjectRepository } from '@src/domain/interfaces/repositories/subjectRepository';
import { ISubjectUseCases, SubjectUseCases } from '../../subjectUseCases';
import { BadRequestError, InternalServerError } from '@src/domain/util/errors/appErrors';

describe('Create subject tests', () => {
  let mockedSubjectRepository: Partial<ISubjectRepository>;
  let subjectUseCases: ISubjectUseCases;

  beforeAll(() => {
    mockedSubjectRepository = {
      create: jest.fn(),
      updateDescription: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findAllDeleted: jest.fn(),
      restore: jest.fn(),
      existsById: jest.fn(),
      delete: jest.fn(),
    };

    subjectUseCases = new SubjectUseCases(mockedSubjectRepository as ISubjectRepository);
  });

  test('Should return subject created successfully', async () => {
    /**
     * @Setup
     */
    const subjectExpected = {
      id: 'uuid',
      description: 'Subject',
      isDeleted: false,
    };

    jest.spyOn(mockedSubjectRepository, 'create').mockResolvedValue(subjectExpected);

    /**
     * @Assert and @Execution
     */
    const sut = await subjectUseCases.create({ description: 'Subject' });

    expect(sut).toEqual(subjectExpected);
  });

  test('Should return BadRequestError when name is empty(invalid)', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectRepository, 'create').mockClear();

    /**
     * @Assert and @Execution
     */
    await expect(subjectUseCases.create({ description: '' })).rejects.toBeInstanceOf(BadRequestError);

    expect(mockedSubjectRepository.create).toHaveBeenCalledTimes(0);
  });

  test('Shold return InternalServerError when a unexpected ocurr', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectRepository, 'create').mockRejectedValue(new Error('Any string'));

    /**
     * @Assert and @Execution
     */
    await expect(subjectUseCases.create({ description: 'example' })).rejects.toBeInstanceOf(InternalServerError);
  });
});
