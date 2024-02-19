import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ILevelUseCases } from '@src/domain/useCases/levelUseCases';
import { ILevelControllers, LevelControllers } from '../../levelControllers';
import { VALID_LEVEL_DATA } from '@src/domain/useCases/__test__/levelUseCasesTest/testConstantsLevel';

describe('FindAll Leves controller tests', () => {
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let levelController: ILevelControllers;

  beforeAll(() => {
    mockedLevelUseCases = {
      findAll: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    levelController = new LevelControllers(mockedLevelUseCases as ILevelUseCases);
  });

  test('Should return body when findAll levels successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'findAll').mockResolvedValue([VALID_LEVEL_DATA]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
      query: {
        page: 1,
        size: 10,
        query: 'any',
        isActive: true,
      },
    });

    /**
     * @Execution
     */
    await levelController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: [VALID_LEVEL_DATA],
    });
    expect(mockedLevelUseCases.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      query: 'any',
      isActive: true,
    });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'findAll').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await levelController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedLevelUseCases.findAll).toHaveBeenCalledWith({
      page: 0,
      size: 0,
      query: '',
      isActive: true,
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'findAll').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        page: 1,
        size: 10,
        query: 'any',
        isActive: true,
      },
    });

    /**
     * @Execution
     */
    await levelController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
