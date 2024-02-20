import { IQuestionRepository } from '@src/domain/interfaces/repositories/questionRepository';
import { ILevelUseCases } from '../../levelUseCases';
import { ISubjectUseCases } from '../../subjectUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IQuestionUseCases, QuestionUseCases } from '../../questionUseCases';
import { VALID_LEVEL_DATA } from '../levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA } from '../subjectUseCasesTest/testConstantsSubject';
import { BadRequestError } from '@src/domain/util/errors';

describe('FindAllQuestionsUseCase Tests', () => {
  let mockedQuestionRepository: Partial<IQuestionRepository>;
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let questionUseCases: IQuestionUseCases;

  beforeAll(() => {
    mockedQuestionRepository = {
      findAll: jest.fn(),
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

  test('Should return a question by params successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      page: 1,
      size: 1,
      query: '',
    };

    const currentQuestionExpected = [
      {
        id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd',
        description: 'AnyDescription',
        level: VALID_LEVEL_DATA,
        subject: VALID_SUBJECT_DATA,
      },
    ];

    jest.spyOn(mockedQuestionRepository, 'findAll').mockResolvedValue(currentQuestionExpected);

    const sut = await questionUseCases.findAll(input);

    expect(sut).toEqual(currentQuestionExpected);
  });

  test('Should return BadRequestError when invalid params', async () => {
    /**
     * @Setup
     */
    const input = {
      page: 0,
      size: 1,
      query: '',
    };

    await expect(questionUseCases.findAll(input)).rejects.toBeInstanceOf(BadRequestError);
  });
});
