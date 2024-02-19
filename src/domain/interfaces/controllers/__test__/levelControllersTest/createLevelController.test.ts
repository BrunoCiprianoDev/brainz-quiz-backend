import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ILevelUseCases } from '@src/domain/useCases/levelUseCases';
import { ILevelControllers, LevelControllers } from '../../levelControllers';
import {
  VALID_LEVEL_CREATE_DATA,
  VALID_LEVEL_DATA,
} from '@src/domain/useCases/__test__/levelUseCasesTest/testConstantsLevel';

describe('Create level controller tests', () => {
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let levelController: ILevelControllers;

  beforeAll(() => {
    mockedLevelUseCases = {
      create: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    levelController = new LevelControllers(mockedLevelUseCases as ILevelUseCases);
  });

  test('Should return body when create level successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'create').mockResolvedValue(VALID_LEVEL_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_LEVEL_CREATE_DATA,
    });

    /**
     * @Execution
     */
    await levelController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: VALID_LEVEL_DATA,
    });
    expect(mockedLevelUseCases.create).toHaveBeenCalledWith(VALID_LEVEL_CREATE_DATA);
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'create').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await levelController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedLevelUseCases.create).toHaveBeenCalledWith({
      description: '',
      points: 0,
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'create').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_LEVEL_CREATE_DATA,
    });

    /**
     * @Execution
     */
    await levelController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
