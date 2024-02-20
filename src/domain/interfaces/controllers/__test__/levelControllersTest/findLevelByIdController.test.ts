import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ILevelUseCases } from '@src/domain/useCases/levelUseCases';
import { ILevelControllers, LevelControllers } from '../../levelControllers';
import { VALID_LEVEL_DATA, VALID_LEVEL_UUID } from '@src/domain/useCases/__test__/levelUseCasesTest/testConstantsLevel';

describe('Find level by ID controller tests', () => {
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let levelController: ILevelControllers;

  beforeAll(() => {
    mockedLevelUseCases = {
      findById: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    levelController = new LevelControllers(mockedLevelUseCases as ILevelUseCases);
  });

  test('Should return body when find a level successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'findById').mockResolvedValue(VALID_LEVEL_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
      params: { id: VALID_LEVEL_UUID },
    });

    /**
     * @Execution
     */
    await levelController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: VALID_LEVEL_DATA,
    });
    expect(mockedLevelUseCases.findById).toHaveBeenCalledWith({ id: VALID_LEVEL_UUID });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'findById').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await levelController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedLevelUseCases.findById).toHaveBeenCalledWith({
      id: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'findById').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: VALID_LEVEL_UUID,
    });

    /**
     * @Execution
     */
    await levelController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
