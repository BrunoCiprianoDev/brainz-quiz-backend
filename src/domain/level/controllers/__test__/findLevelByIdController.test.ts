import { IHttpContext } from '../../../util/adapters/httpContext';
import { NotFoundError } from '../../../util/errors/appErrors';
import { ILevel } from '../../models/level';
import { IFindLevelByIdService } from '../../services/findLevelByIdService';
import { FindLevelByIdController, IFindLevelByIdController } from '../findLevelByIdController';

describe('Find level by id controller', () => {
  let mockedFindLevelByIdService: jest.Mocked<IFindLevelByIdService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let findLevelByIdController: IFindLevelByIdController;

  beforeAll(() => {
    mockedFindLevelByIdService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    findLevelByIdController = new FindLevelByIdController(mockedFindLevelByIdService);
  })

  test('Should return level by id successfully', async () => {
    const description = 'level_DESCRIPTION';
    const levelExp = {
      id: '4ed12231-45dd-435f-875d-98588212dc72',
      description,
      points: 0,
      isDeleted: false,
    } as ILevel;

    jest.spyOn(mockedFindLevelByIdService, 'execute').mockResolvedValue(levelExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: { id: levelExp.id },
    });

    await findLevelByIdController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 200, body: levelExp });
    expect(mockedFindLevelByIdService.execute).toHaveBeenCalledWith(levelExp.id);
  });

  test('Should handle empty attribute', async () => {
    jest.spyOn(mockedFindLevelByIdService, 'execute').mockRejectedValue(new NotFoundError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findLevelByIdController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 404, body: { message: 'Error message' } });
    expect(mockedFindLevelByIdService.execute).toHaveBeenCalledWith('');
  });
});
