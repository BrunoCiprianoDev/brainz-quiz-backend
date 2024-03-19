import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { ILevel } from '../../models/level';
import { IUpdateLevelService } from '../../services/updateLevelService';
import { IUpdateLevelController, UpdateLevelController } from '../updateLevelController';

describe('Update level tests', () => {
  let mockedUpdateLevelService: jest.Mocked<IUpdateLevelService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let updateLevelController: IUpdateLevelController;

  beforeAll(() => {
    mockedUpdateLevelService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    updateLevelController = new UpdateLevelController(mockedUpdateLevelService);
  });

  test('Should return level updated', async () => {
    const description = 'level_DESCRIPTION';
    const levelExp = {
      id: '4ed12231-45dd-435f-875d-98588212dc72',
      description,
      points: 0,
      isDeleted: false,
    } as ILevel;

    jest.spyOn(mockedUpdateLevelService, 'execute').mockResolvedValue(levelExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: levelExp,
    });

    await updateLevelController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 200, body: levelExp });
    expect(mockedUpdateLevelService.execute).toHaveBeenCalledWith(levelExp);
  });

  test('Should handle empty values', async () => {
    jest.spyOn(mockedUpdateLevelService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updateLevelController.execute(mockedHttpContext);

    expect(mockedUpdateLevelService.execute).toHaveBeenCalledWith({
      id: '',
      description: '',
      points: 0,
      isDeleted: false,
    });
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedUpdateLevelService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updateLevelController.execute(mockedHttpContext);
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });
    expect(mockedUpdateLevelService.execute).toHaveBeenCalledWith({
      id: '',
      description: '',
      points: 0,
      isDeleted: false,
    });
  });
});
