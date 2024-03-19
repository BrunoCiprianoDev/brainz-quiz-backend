import { IHttpContext } from '../../../util/adapters/httpContext';
import { ILevel } from '../../models/level';
import { IFindAllLevelsService } from '../../services/findAllLevelsService';
import { FindAllLevelsController, IFindAllLevelsController } from '../findAllLevelController';

describe('Find level by id controller', () => {
  let mockedFindAllLevelsService: jest.Mocked<IFindAllLevelsService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let findAllLevelsController: IFindAllLevelsController;

  beforeAll(() => {
    mockedFindAllLevelsService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    findAllLevelsController = new FindAllLevelsController(mockedFindAllLevelsService);
  });

  test('Should return level by id successfully', async () => {
    const description = 'level_DESCRIPTION';
    const levelExp = [
      {
        id: '4ed12231-45dd-435f-875d-98588212dc72',
        description,
        points: 0,
        isDeleted: false,
      },
    ] as ILevel[];

    jest.spyOn(mockedFindAllLevelsService, 'execute').mockResolvedValue(levelExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: { contains: '', page: 1, size: 2, isDeleted: 'false' },
    });

    await findAllLevelsController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 200, body: levelExp });
    expect(mockedFindAllLevelsService.execute).toHaveBeenCalledWith({
      contains: '',
      page: 1,
      size: 2,
      isDeleted: false,
    });
  });


  test('Should return level by id successfully (when isDeleted typeof boolean)', async () => {
    const description = 'level_DESCRIPTION';
    const levelExp = [
      {
        id: '4ed12231-45dd-435f-875d-98588212dc72',
        description,
        isDeleted: false,
      },
    ] as ILevel[];

    jest.spyOn(mockedFindAllLevelsService, 'execute').mockResolvedValue(levelExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: { contains: '', page: 1, size: 2, isDeleted: false },
    });

    await findAllLevelsController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 200, body: levelExp });
    expect(mockedFindAllLevelsService.execute).toHaveBeenCalledWith({
      contains: '',
      page: 1,
      size: 2,
      isDeleted: false,
    });
  });

  test('Should handle empty attribute', async () => {
    jest.spyOn(mockedFindAllLevelsService, 'execute').mockRejectedValue(new Error('ANY'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findAllLevelsController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedFindAllLevelsService.execute).toHaveBeenCalledWith({
      contains: '',
      page: 1,
      size: 5,
      isDeleted: false,
    });
  });
});
