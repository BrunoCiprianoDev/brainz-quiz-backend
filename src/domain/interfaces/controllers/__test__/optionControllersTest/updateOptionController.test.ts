import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IOptionUseCases } from '@src/domain/useCases/optionUseCases';
import { IOptionControllers, OptionControllers } from '../../optionControllers';
import { IOption, IOptionCreateData } from '@src/domain/util/models/optionsModels';

describe('UpdateOptionController tests', () => {
  let mockedOptionUseCases: Partial<IOptionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let optionControllers: IOptionControllers;
  beforeAll(() => {
    mockedOptionUseCases = {
      update: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    optionControllers = new OptionControllers(mockedOptionUseCases as IOptionUseCases);
  });

  test('Shoud return option update successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
      questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
      description: 'Description01',
      isCorrect: true,
    } as IOption;

    jest.spyOn(mockedOptionUseCases, 'update').mockResolvedValue({
      id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
      questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
      description: 'Description02',
      isCorrect: false,
    });

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: input,
    });

    /**
     * @Execution
     */
    await optionControllers.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: {
        id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
        questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
        description: 'Description02',
        isCorrect: false,
      },
    });
    expect(mockedOptionUseCases.update).toHaveBeenCalledWith(input);
  });

  test('Shoud handle attributes for empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'update').mockClear();
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedOptionUseCases.update).toHaveBeenCalledWith({
      id: '',
      questionId: '',
      description: '',
      isCorrect: true,
    });
  });

  test('Shoud handle error when ocurrs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'update').mockRejectedValue(new Error('Any'));
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
