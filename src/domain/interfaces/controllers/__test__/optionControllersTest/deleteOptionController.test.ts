import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IOptionUseCases } from '@src/domain/useCases/optionUseCases';
import { IOptionControllers, OptionControllers } from '../../optionControllers';
import { IOption, IOptionCreateData } from '@src/domain/util/models/optionsModels';

describe('Delete tests', () => {
  let mockedOptionUseCases: Partial<IOptionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let optionControllers: IOptionControllers;
  beforeAll(() => {
    mockedOptionUseCases = {
      delete: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    optionControllers = new OptionControllers(mockedOptionUseCases as IOptionUseCases);
  });

  test('Shoud deleted option by id successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
    };

    jest.spyOn(mockedOptionUseCases, 'delete').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: input,
    });

    /**
     * @Execution
     */
    await optionControllers.delete(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 204,
      body: {},
    });
    expect(mockedOptionUseCases.delete).toHaveBeenCalledWith(input);
  });

  test('Shoud handle attributes for empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'delete').mockClear();
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.delete(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedOptionUseCases.delete).toHaveBeenCalledWith({
      id: '',
    });
  });

  test('Shoud handle error when ocurrs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'delete').mockRejectedValue(new Error('Any'));
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.delete(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
