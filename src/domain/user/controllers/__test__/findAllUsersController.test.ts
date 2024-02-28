import { IFindAllUsersService } from '../../services/findAllUsersService';
import { FindAllUsersController, IFindAllUsersController } from '../findAllUsersController';
import { Role } from '../../models/user';
import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';

describe('Find all users controller tests', () => {
  let mockedFindAllUsersService: jest.Mocked<IFindAllUsersService>;
  let findAllUsersController: IFindAllUsersController;
  let mockedHttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedFindAllUsersService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    findAllUsersController = new FindAllUsersController(mockedFindAllUsersService);
  });

  test('Should return a list users when params is valid', async () => {
    const input = {
      contains: 'AnyString',
      page: 1,
      size: 20,
    };

    const validUser01 = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johnDoe@email.com',
      role: Role.Standard,
    };

    const validUser02 = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae2',
      email: 'email@email.com',
      role: Role.Admin,
    };

    jest.spyOn(mockedFindAllUsersService, 'execute').mockResolvedValue([validUser01, validUser02]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: input,
    });

    await findAllUsersController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: [validUser01, validUser02],
    });

    expect(mockedFindAllUsersService.execute).toHaveBeenCalledWith(input);
  });

  test('Should handle empty params', async () => {
    jest.spyOn(mockedFindAllUsersService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {},
    });

    await findAllUsersController.execute(mockedHttpContext);

    expect(mockedFindAllUsersService.execute).toHaveBeenCalledWith({
      contains: '',
      size: 5,
      page: 1,
    });
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedFindAllUsersService, 'execute').mockRejectedValue(new BadRequestError('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findAllUsersController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: {
        message: 'Any message',
      },
    });
  });
});
