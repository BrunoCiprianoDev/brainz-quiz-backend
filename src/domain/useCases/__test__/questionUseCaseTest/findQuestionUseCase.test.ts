import { IQuestionRepository } from '@src/domain/interfaces/repositories/questionRepository';
import { ILevelUseCases } from '../../levelUseCases';
import { ISubjectUseCases } from '../../subjectUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IQuestionUseCases, QuestionUseCases } from '../../questionUseCases';
import { VALID_LEVEL_DATA, VALID_LEVEL_UUID } from '../levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA, VALID_SUBJECT_UUID } from '../subjectUseCasesTest/testConstantsSubject';
import { NotFoundError } from '@src/domain/util/errors';

describe('FindQuestionUseCase Tests', () => {
  let mockedQuestionRepository: Partial<IQuestionRepository>;
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let questionUseCases: IQuestionUseCases;

  beforeAll(() => {
    mockedQuestionRepository = {
      findQuestion: jest.fn(),
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

  test('Should find Question by levelId and subjectId successfully', async () => {
    const input = {
      levelId: VALID_LEVEL_UUID,
      subjectId: VALID_SUBJECT_UUID,
    };
    const currentQuestionExpected = {
      id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd',
      description: 'AnyDescription',
      level: VALID_LEVEL_DATA,
      subject: VALID_SUBJECT_DATA,
    };

    jest.spyOn(mockedQuestionRepository, 'findQuestion').mockResolvedValue(currentQuestionExpected);

    const sut = await questionUseCases.findQuestion(input);

    expect(sut).toEqual(currentQuestionExpected);
  });

  test('Should handle error', async () => {
    const input = {
      levelId: VALID_LEVEL_UUID,
      subjectId: VALID_SUBJECT_UUID,
    };

    jest.spyOn(mockedQuestionRepository, 'findQuestion').mockResolvedValue(null);

    await expect(questionUseCases.findQuestion(input)).rejects.toBeInstanceOf(NotFoundError);
  });
});
