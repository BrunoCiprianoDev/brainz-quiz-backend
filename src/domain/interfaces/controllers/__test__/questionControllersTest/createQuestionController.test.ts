import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IQuestionControllers, QuestionControllers } from '../../questionControllers';
import { IQuestionUseCases } from '@src/domain/useCases/questionUseCases';
import { VALID_LEVEL_DATA } from '@src/domain/useCases/__test__/levelUseCasesTest/testConstantsLevel';
import { VALID_SUBJECT_DATA } from '@src/domain/useCases/__test__/subjectUseCasesTest/testConstantsSubject';

describe('CreateQuestionController tests', () => {
  let questionController: IQuestionControllers;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedQuestionUseCases = {
      create: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    questionController = new QuestionControllers(mockedQuestionUseCases as IQuestionUseCases);
  });

  test('Should return body when create question successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'create').mockResolvedValue({
      id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
      level: VALID_LEVEL_DATA,
      subject: VALID_SUBJECT_DATA,
      description: 'Any',
    });

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        levelId: VALID_LEVEL_DATA.id,
        subjectId: VALID_SUBJECT_DATA.id,
        description: 'Any',
      },
    });

    /**
     * @Execution
     */
    await questionController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: {
        id: '09ff07c4-767a-4e1d-8e08-c6edfbb013c8',
        level: VALID_LEVEL_DATA,
        subject: VALID_SUBJECT_DATA,
        description: 'Any',
      },
    });
    expect(mockedQuestionUseCases.create).toHaveBeenCalledWith({
      levelId: VALID_LEVEL_DATA.id,
      subjectId: VALID_SUBJECT_DATA.id,
      description: 'Any',
    });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'create').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedQuestionUseCases.create).toHaveBeenCalledWith({
      levelId: '',
      subjectId: '',
      description: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'create').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
