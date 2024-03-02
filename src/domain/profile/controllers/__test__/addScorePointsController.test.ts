import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { IAddScorePointsService } from '../../service/addScorePointsService';
import { AddScorePointsController, IAddScorePointsController } from '../addScorePointsController';

describe('Add score points controller tests', () => {
  let mockedAddScorePointsService: jest.Mocked<IAddScorePointsService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let addScorePointsController: IAddScorePointsController;

  beforeAll(() => {
    mockedAddScorePointsService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    addScorePointsController = new AddScorePointsController(mockedAddScorePointsService);
  });

  test('Should return profile with score updated profile', async () => {
    const userId = 'be795b88-2dca-4797-aa8d-cf420cdfd3fb';
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    const mockedProfileExp = {
      id,
      userId,
      name: 'John Doe',
      score: 200,
    };

    jest.spyOn(mockedAddScorePointsService, 'execute').mockResolvedValue(mockedProfileExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: mockedProfileExp,
    });

    await addScorePointsController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: mockedProfileExp,
    });
  });

  test('Should handle empty attributes', async () => {
    jest.spyOn(mockedAddScorePointsService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await addScorePointsController.execute(mockedHttpContext);

    expect(mockedAddScorePointsService.execute).toHaveBeenCalledWith({
      id: '',
      points: 0,
    });
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedAddScorePointsService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    await addScorePointsController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });

    expect(mockedAddScorePointsService.execute).toHaveBeenCalledWith({
      id: '',
      points: 0,
    });
  });
});
