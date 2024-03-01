import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { ICreateProfileService } from '../../service/createProfileService';
import { CreateProfileController, ICreateProfileController } from '../createProfileController';

describe('Create PROFILE controller tests', () => {
  let mockedCreateProfileService: jest.Mocked<ICreateProfileService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let createProfileController: ICreateProfileController;

  beforeAll(() => {
    mockedCreateProfileService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    createProfileController = new CreateProfileController(mockedCreateProfileService);
  });

  test('Should return Profile created', async () => {
    const userId = 'be795b88-2dca-4797-aa8d-cf420cdfd3fb';
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    const mockedProfileExp = {
      id,
      userId,
      name: 'John Doe',
      score: 200,
    };

    jest.spyOn(mockedCreateProfileService, 'execute').mockResolvedValue(mockedProfileExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { userId, name: 'John Doe' },
    });

    await createProfileController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: mockedProfileExp,
    });
  });

  test('Should handle empty attributes', async () => {
    jest.spyOn(mockedCreateProfileService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    await createProfileController.execute(mockedHttpContext);

    expect(mockedCreateProfileService.execute).toHaveBeenCalledWith({
      userId: '',
      name: '',
    });
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedCreateProfileService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await createProfileController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });
  });
});
