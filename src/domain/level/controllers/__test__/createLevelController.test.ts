import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { ILevel } from '../../models/level';
import { ICreateLevelService } from '../../services/createLevelService';
import { CreateLevelController, ICreateLevelController } from '../createLevelController';

describe('Create Level controller', () => {
  let mockedCreateLevelService: jest.Mocked<ICreateLevelService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let createLevelController: ICreateLevelController;

  beforeAll(() => {
    mockedCreateLevelService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    createLevelController = new CreateLevelController(mockedCreateLevelService);
  });

  test('Should return Level created', async () => {
    const description = 'Level_DESCRIPTION';
    const levelExp = {
      id: '4ed12231-45dd-435f-875d-98588212dc72',
      description,
      points: 0,
      isDeleted: false,
    } as ILevel;

    jest.spyOn(mockedCreateLevelService, 'execute').mockResolvedValue(levelExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { description: description },
    });

    await createLevelController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 201, body: levelExp });
    expect(mockedCreateLevelService.execute).toHaveBeenCalledWith({ description, points: 0 });
  });

  test('Should handle empty values', async () => {
    jest.spyOn(mockedCreateLevelService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await createLevelController.execute(mockedHttpContext);

    expect(mockedCreateLevelService.execute).toHaveBeenCalledWith({ description: '', points: 0 });
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedCreateLevelService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await createLevelController.execute(mockedHttpContext);
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });
    expect(mockedCreateLevelService.execute).toHaveBeenCalledWith({ description: '', points: 0 });
  });
});
