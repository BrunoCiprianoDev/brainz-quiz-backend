import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IOptionUseCases } from '@src/domain/useCases/optionUseCases';
import { IOptionControllers, OptionControllers } from '../../optionControllers';
import { IOption, IOptionCreateData } from '@src/domain/util/models/optionsModels';

describe('FindAllByQuestionId tests', () => {
  let mockedOptionUseCases: Partial<IOptionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let optionControllers: IOptionControllers;
  beforeAll(() => {
    mockedOptionUseCases = {
      findAllByQuestionId: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    optionControllers = new OptionControllers(mockedOptionUseCases as IOptionUseCases);
  });

  test('Shoud return option findAllOptionsByQuestionId successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
    };

    jest.spyOn(mockedOptionUseCases, 'findAllByQuestionId').mockResolvedValue([
      {
        id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
        questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
        description: 'Description01',
        isCorrect: true,
      },
    ]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: input,
    });

    /**
     * @Execution
     */
    await optionControllers.findAllByQuestionId(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: [
        {
          id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
          questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
          description: 'Description01',
          isCorrect: true,
        },
      ],
    });
    expect(mockedOptionUseCases.findAllByQuestionId).toHaveBeenCalledWith(input);
  });

  test('Shoud handle attributes for empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'findAllByQuestionId').mockClear();
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.findAllByQuestionId(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedOptionUseCases.findAllByQuestionId).toHaveBeenCalledWith({
      questionId: '',
    });
  });

  test('Shoud handle error when ocurrs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'findAllByQuestionId').mockRejectedValue(new Error('Any'));
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.findAllByQuestionId(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
