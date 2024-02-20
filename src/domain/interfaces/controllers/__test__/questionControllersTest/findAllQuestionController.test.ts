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
      findAll: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    questionController = new QuestionControllers(mockedQuestionUseCases as IQuestionUseCases);
  });

  test('Should return body when findAll levels successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findAll').mockResolvedValue([
      {
        id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
        level: VALID_LEVEL_DATA,
        subject: VALID_SUBJECT_DATA,
        description: 'Any',
      },
    ]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
      query: {
        page: 1,
        size: 10,
        query: 'any',
      },
    });

    /**
     * @Execution
     */
    await questionController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: [
        {
          id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
          level: VALID_LEVEL_DATA,
          subject: VALID_SUBJECT_DATA,
          description: 'Any',
        },
      ],
    });
    expect(mockedQuestionUseCases.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      query: 'any',
    });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findAll').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await questionController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedQuestionUseCases.findAll).toHaveBeenCalledWith({
      page: 0,
      size: 0,
      query: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'findAll').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        page: 1,
        size: 10,
        query: 'any',
      },
    });

    /**
     * @Execution
     */
    await questionController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
