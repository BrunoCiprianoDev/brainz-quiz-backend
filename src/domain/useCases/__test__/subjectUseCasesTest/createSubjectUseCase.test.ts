import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { ISubjectRepository } from '@src/domain/interfaces/repositories/subjectRepository';
import { ISubjectUseCases, SubjectUseCases } from '../../subjectUseCases';
import { VALID_SUBJECT_CREATE_DATA, VALID_SUBJECT_UUID } from './testConstantsSubject';
import { NotFoundError } from '@src/domain/util/errors';

describe('CreateSubjectUseCase', () => {
  let mockedSubjectRepository: Partial<ISubjectRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let subjectUseCases: ISubjectUseCases;
  beforeAll(() => {
    mockedSubjectRepository = {
      create: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    subjectUseCases = new SubjectUseCases(
      mockedSubjectRepository as ISubjectRepository,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should create Subject successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectRepository, 'create').mockClear();
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(VALID_SUBJECT_UUID);

    /**
     * @Execution
     */
    const sut = await subjectUseCases.create(VALID_SUBJECT_CREATE_DATA);

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      ...VALID_SUBJECT_CREATE_DATA,
      id: VALID_SUBJECT_UUID,
      isActive: true,
    });
    expect(mockedSubjectRepository.create).toHaveBeenCalledWith({
      ...VALID_SUBJECT_CREATE_DATA,
      id: VALID_SUBJECT_UUID,
      isActive: true,
    });
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(1);
  });

  test('Should return AppError when a error occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectRepository, 'create').mockRejectedValue(new NotFoundError('Any'));

    /**
     * @Execution
     * @Assert
     */
    await expect(subjectUseCases.create(VALID_SUBJECT_CREATE_DATA)).rejects.toBeInstanceOf(NotFoundError);
  });
});
