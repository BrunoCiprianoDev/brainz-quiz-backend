import { IQuestionRepository } from '@src/domain/interfaces/repositories/questionRepository';
import { ILevelUseCases } from '../../levelUseCases';
import { ISubjectUseCases } from '../../subjectUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IQuestionUseCases, QuestionUseCases } from '../../questionUseCases';
import { VALID_LEVEL_DATA, VALID_LEVEL_UUID } from '../levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA, VALID_SUBJECT_UUID } from '../subjectUseCasesTest/testConstantsSubject';
import { NotFoundError } from '@src/domain/util/errors';

describe('CreateQuestionUseCase Tests', () => {
  let mockedQuestionRepository: Partial<IQuestionRepository>;
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let questionUseCases: IQuestionUseCases;

  beforeAll(() => {
    mockedQuestionRepository = {
      create: jest.fn(),
    };

    mockedLevelUseCases = {
      findById: jest.fn(),
    };

    mockedSubjectUseCases = {
      findById: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    questionUseCases = new QuestionUseCases(
      mockedQuestionRepository as IQuestionRepository,
      mockedLevelUseCases as ILevelUseCases,
      mockedSubjectUseCases as ISubjectUseCases,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return question created successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue('da8882d6-d77a-4d18-928d-2f1ef8b6b8bd');
    jest.spyOn(mockedLevelUseCases, 'findById').mockResolvedValue(VALID_LEVEL_DATA);
    jest.spyOn(mockedSubjectUseCases, 'findById').mockResolvedValue(VALID_SUBJECT_DATA);
    jest.spyOn(mockedQuestionRepository, 'create').mockClear();

    /**
     * @Execution
     */
    const sut = await questionUseCases.create({
      description: 'AnyDescription',
      levelId: VALID_LEVEL_UUID,
      subjectId: VALID_SUBJECT_UUID,
    });

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd',
      description: 'AnyDescription',
      level: VALID_LEVEL_DATA,
      subject: VALID_SUBJECT_DATA,
    });
    expect(mockedLevelUseCases.findById).toHaveBeenCalledWith({ id: VALID_LEVEL_UUID });
    expect(mockedSubjectUseCases.findById).toHaveBeenCalledWith({ id: VALID_SUBJECT_UUID });
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(1);
  });

  test('Should return AppError', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue('da8882d6-d77a-4d18-928d-2f1ef8b6b8bd');
    jest.spyOn(mockedLevelUseCases, 'findById').mockRejectedValue(new NotFoundError('Any'));
    jest.spyOn(mockedSubjectUseCases, 'findById').mockResolvedValue(VALID_SUBJECT_DATA);
    jest.spyOn(mockedQuestionRepository, 'create').mockClear();

    /**
     * @Execution
     */
    await expect(
      questionUseCases.create({
        description: 'AnyDescription',
        levelId: VALID_LEVEL_UUID,
        subjectId: VALID_SUBJECT_UUID,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(mockedLevelUseCases.findById).toHaveBeenCalledWith({ id: VALID_LEVEL_UUID });
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockedSubjectUseCases.findById).toHaveBeenCalledTimes(0);
  });
});
