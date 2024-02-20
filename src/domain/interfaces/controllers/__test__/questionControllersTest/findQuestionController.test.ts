import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IQuestionControllers, QuestionControllers } from '../../questionControllers';
import { IQuestionUseCases } from '@src/domain/useCases/questionUseCases';
import { VALID_LEVEL_DATA } from '@src/domain/useCases/__test__/levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA } from '@src/domain/useCases/__test__/subjectUseCasesTest/testConstantsSubject';

describe('FindQuestionController tests', () => {
  let questionController: IQuestionControllers;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedQuestionUseCases = {
      findQuestion: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    questionController = new QuestionControllers(mockedQuestionUseCases as IQuestionUseCases);
  });

  test('Should return body when find question by id successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findQuestion').mockResolvedValue({
      question: {
        id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
        level: VALID_LEVEL_DATA,
        subject: VALID_SUBJECT_DATA,
        description: 'Any',
      },
      options: [],
    });

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        levelId: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
        subjectId: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
      },
    });

    /**
     * @Execution
     */
    await questionController.findQuestion(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: {
        question: {
          id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
          level: VALID_LEVEL_DATA,
          subject: VALID_SUBJECT_DATA,
          description: 'Any',
        },
        options: [],
      },
    });
    expect(mockedQuestionUseCases.findQuestion).toHaveBeenCalledWith({
      levelId: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
      subjectId: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
    });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findQuestion').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.findQuestion(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedQuestionUseCases.findQuestion).toHaveBeenCalledWith({
      levelId: '',
      subjectId: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findQuestion').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.findQuestion(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
