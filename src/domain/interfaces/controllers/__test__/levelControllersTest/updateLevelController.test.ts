import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ILevelUseCases } from '@src/domain/useCases/levelUseCases';
import { ILevelControllers, LevelControllers } from '../../levelControllers';
import { VALID_LEVEL_DATA } from '@src/domain/useCases/__test__/levelUseCasesTest/testConstantsLevel';

describe('Update level controller tests', () => {
  let mockedLevelUseCases: Partial<ILevelUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let levelController: ILevelControllers;

  beforeAll(() => {
    mockedLevelUseCases = {
      update: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    levelController = new LevelControllers(mockedLevelUseCases as ILevelUseCases);
  });

  test('Should return body when update level successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'update').mockResolvedValue(VALID_LEVEL_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_LEVEL_DATA,
    });

    /**
     * @Execution
     */
    await levelController.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: VALID_LEVEL_DATA,
    });
    expect(mockedLevelUseCases.update).toHaveBeenCalledWith(VALID_LEVEL_DATA);
  });

  test('Should hadle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'update').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await levelController.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedLevelUseCases.update).toHaveBeenCalledWith({
      description: '',
      points: 0,
      isActive: true,
      id: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelUseCases, 'update').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_LEVEL_DATA,
    });

    /**
     * @Execution
     */
    await levelController.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
