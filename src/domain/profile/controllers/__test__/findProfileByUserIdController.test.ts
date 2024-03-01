import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { IFindProfileByUserIdService } from '../../service/findProfileByUserIdService';
import { FindProfileByUserIdController, IFindProfileByUserIdController } from '../findProfileByUserIdController';

describe('Find Profile by User Id Controller tests', () => {
  let mockedFindProfileByUserIdService: jest.Mocked<IFindProfileByUserIdService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let findProfileByUserIdController: IFindProfileByUserIdController;

  beforeAll(() => {
    mockedFindProfileByUserIdService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    findProfileByUserIdController = new FindProfileByUserIdController(mockedFindProfileByUserIdService);
  });

  test('Should return profile by userId', async () => {
    const userId = 'be795b88-2dca-4797-aa8d-cf420cdfd3fb';
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    const mockedProfileExp = {
      id,
      userId,
      name: 'John Doe',
      score: 200,
    };

    jest.spyOn(mockedFindProfileByUserIdService, 'execute').mockResolvedValue(mockedProfileExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: { userId },
    });

    await findProfileByUserIdController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: mockedProfileExp,
    });
    expect(mockedFindProfileByUserIdService.execute).toHaveBeenCalledWith(userId);
  });

  test('Should handle errors attributes', async () => {
    jest.spyOn(mockedFindProfileByUserIdService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findProfileByUserIdController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });

    expect(mockedFindProfileByUserIdService.execute).toHaveBeenCalledWith('');
  });

  test('Should handle empty attributes', async () => {
    jest.spyOn(mockedFindProfileByUserIdService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findProfileByUserIdController.execute(mockedHttpContext);

    expect(mockedFindProfileByUserIdService.execute).toHaveBeenCalledWith('');
  });
});
