import { IQuestionRepository } from '@src/domain/interfaces/repositories/questionRepository';
import { ILevelUseCases } from '../../levelUseCases';
import { ISubjectUseCases } from '../../subjectUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IQuestionUseCases, QuestionUseCases } from '../../questionUseCases';
import { VALID_LEVEL_DATA } from '../levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA } from '../subjectUseCasesTest/testConstantsSubject';
import { NotFoundError } from '@src/domain/util/errors';

describe('DeleteQuestionsUseCase Tests', () => {
  let mockedQuestionRepository: Partial<IQuestionRepository>;
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let questionUseCases: IQuestionUseCases;

  beforeAll(() => {
    mockedQuestionRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
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

  test('Should delete question sucessfully', async () => {
    const input = { id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd' };

    const currentQuestionExpected = {
      id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd',
      description: 'AnyDescription',
      level: VALID_LEVEL_DATA,
      subject: VALID_SUBJECT_DATA,
    };

    jest.spyOn(mockedQuestionRepository, 'findById').mockResolvedValue(currentQuestionExpected);
    jest.spyOn(mockedQuestionRepository, 'delete').mockClear();

    await questionUseCases.delete(input);

    expect(mockedQuestionRepository.delete).toHaveBeenCalledWith(input);
    expect(mockedQuestionRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should handle NotFoundError', async () => {
    const input = { id: 'da8882d6-d77a-4d18-928d-2f1ef8b6b8bd' };

    jest.spyOn(mockedQuestionRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(mockedQuestionRepository, 'delete').mockClear();

    await expect(questionUseCases.delete(input)).rejects.toBeInstanceOf(NotFoundError);

    expect(mockedQuestionRepository.delete).toHaveBeenCalledTimes(0);
  });
});
