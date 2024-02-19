import { IQuestionRepository } from '@src/domain/interfaces/repositories/questionRepository';
import { ILevelUseCases } from '../../levelUseCases';
import { ISubjectUseCases } from '../../subjectUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IQuestionUseCases, QuestionUseCases } from '../../questionUseCases';
import { VALID_LEVEL_DATA, VALID_LEVEL_UUID } from '../levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA, VALID_SUBJECT_UUID } from '../subjectUseCasesTest/testConstantsSubject';
import { NotFoundError } from '@src/domain/util/errors';

describe('UpdateQuestionUseCase Tests', () => {
  let mockedQuestionRepository: Partial<IQuestionRepository>;
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let questionUseCases: IQuestionUseCases;

  beforeAll(() => {
    mockedQuestionRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    mockedLevelUseCases = {
      findById: jest.fn(),
    };

    mockedSubjectUseCases = {
      findById: jest.fn(),
    };

    questionUseCases = new QuestionUseCases(
      mockedQuestionRepository as IQuestionRepository,
      mockedLevelUseCases as ILevelUseCases,
      mockedSubjectUseCases as ISubjectUseCases,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return question updated sucessfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd',
      description: 'AnyDescription',
      levelId: VALID_LEVEL_UUID,
      subjectId: VALID_SUBJECT_UUID,
    };

    const currentQuestionExpected = {
      id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd',
      description: 'AnyDescription',
      level: VALID_LEVEL_DATA,
      subject: VALID_SUBJECT_DATA,
    };

    jest.spyOn(mockedLevelUseCases, 'findById').mockResolvedValue(VALID_LEVEL_DATA);
    jest.spyOn(mockedSubjectUseCases, 'findById').mockResolvedValue(VALID_SUBJECT_DATA);
    jest.spyOn(mockedQuestionRepository, 'findById').mockResolvedValue(currentQuestionExpected);
    jest.spyOn(mockedQuestionRepository, 'update').mockClear();

    /**
     * @Execution
     */
    const sut = await questionUseCases.update(input);

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
    expect(mockedQuestionRepository.update).toHaveBeenCalledWith(currentQuestionExpected);
  });

  test('Should handle Error', async () => {
    /**
     * @Setup
     */
    const input = {
      id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd',
      description: 'AnyDescription',
      levelId: VALID_LEVEL_UUID,
      subjectId: VALID_SUBJECT_UUID,
    };

    jest.spyOn(mockedLevelUseCases, 'findById').mockClear();
    jest.spyOn(mockedSubjectUseCases, 'findById').mockClear();
    jest.spyOn(mockedQuestionRepository, 'findById').mockRejectedValue(new NotFoundError('ANY'));
    jest.spyOn(mockedQuestionRepository, 'update').mockClear();

    /**
     * @Execution
     */
    await expect(questionUseCases.update(input)).rejects.toBeInstanceOf(NotFoundError);

    expect(mockedLevelUseCases.findById).toHaveBeenCalledTimes(0);
    expect(mockedSubjectUseCases.findById).toHaveBeenCalledTimes(0);
    expect(mockedQuestionRepository.update).toHaveBeenCalledTimes(0);
    expect(mockedQuestionRepository.findById).toHaveBeenCalledWith({ id: input.id });
  });
});
