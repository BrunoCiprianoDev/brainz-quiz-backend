import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IQuestionControllers, QuestionControllers } from '../../questionControllers';
import { IQuestionUseCases } from '@src/domain/useCases/questionUseCases';
import { VALID_LEVEL_DATA } from '@src/domain/useCases/__test__/levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA } from '@src/domain/useCases/__test__/subjectUseCasesTest/testConstantsSubject';

describe('FindQuestionByIdController tests', () => {
  let questionController: IQuestionControllers;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedQuestionUseCases = {
      findById: jest.fn(),
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
    jest.spyOn(mockedQuestionUseCases, 'findById').mockResolvedValue({
      id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
      level: VALID_LEVEL_DATA,
      subject: VALID_SUBJECT_DATA,
      description: 'Any',
    });

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: {
        id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
      },
    });

    /**
     * @Execution
     */
    await questionController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: {
        id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
        level: VALID_LEVEL_DATA,
        subject: VALID_SUBJECT_DATA,
        description: 'Any',
      },
    });
    expect(mockedQuestionUseCases.findById).toHaveBeenCalledWith({
      id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
    });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findById').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedQuestionUseCases.findById).toHaveBeenCalledWith({
      id: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findById').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
