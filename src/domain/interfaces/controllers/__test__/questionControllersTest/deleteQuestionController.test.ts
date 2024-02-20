import { IQuestionUseCases } from '@src/domain/useCases/questionUseCases';
import { IQuestionControllers, QuestionControllers } from '../../questionControllers';
import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';

describe('DeleteController tests', () => {
  let questionController: IQuestionControllers;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedQuestionUseCases = {
      delete: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    questionController = new QuestionControllers(mockedQuestionUseCases as IQuestionUseCases);
  });

  test('Shoud deleted question by id successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
    };

    jest.spyOn(mockedQuestionUseCases, 'delete').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: input,
    });

    /**
     * @Execution
     */
    await questionController.delete(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 204,
      body: {},
    });
    expect(mockedQuestionUseCases.delete).toHaveBeenCalledWith(input);
  });

  test('Shoud handle attributes for empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'delete').mockClear();
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.delete(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedQuestionUseCases.delete).toHaveBeenCalledWith({
      id: '',
    });
  });

  test('Shoud handle error when ocurrs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedQuestionUseCases, 'delete').mockRejectedValue(new Error('Any'));
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await questionController.delete(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
