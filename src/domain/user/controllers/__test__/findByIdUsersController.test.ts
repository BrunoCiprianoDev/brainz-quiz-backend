import { IHttpContext } from '../../../util/adapters/httpContext';
import { NotFoundError } from '../../../util/errors/appErrors';
import { Role } from '../../models/user';
import { IFindUserByIdService } from '../../services/findUserByIdService';
import { FindByIdUsersController, IFindByIdUsersController } from '../findByIdUsersController';

describe('Find users by ID controller tests', () => {
  let mockedFindByIdService: jest.Mocked<IFindUserByIdService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let findByIdUsersController: IFindByIdUsersController;

  beforeAll(() => {
    mockedFindByIdService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    findByIdUsersController = new FindByIdUsersController(mockedFindByIdService);
  });

  test('Should return a users when found by id', async () => {
    const input = 'fefa7b41-0acd-451c-bea6-b113c6d5eae4';

    const userExpectedWhenMockedServiceCalled = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johnDoe@email.com',
      role: Role.Standard,
    };

    jest.spyOn(mockedFindByIdService, 'execute').mockResolvedValue(userExpectedWhenMockedServiceCalled);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        id: input,
      },
    });

    await findByIdUsersController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpectedWhenMockedServiceCalled,
    });

    expect(mockedFindByIdService.execute).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundException when not found user by id', async () => {
    const input = 'fefa7b41-0acd-451c-bea6-b113c6d5eae4';

    jest.spyOn(mockedFindByIdService, 'execute').mockRejectedValue(new NotFoundError('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        id: input,
      },
    });

    await findByIdUsersController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 404,
      body: { message: 'Any message' },
    });

    expect(mockedFindByIdService.execute).toHaveBeenCalledWith(input);
  });

  test('Should handle input empty values', async () => {
    jest.spyOn(mockedFindByIdService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findByIdUsersController.execute(mockedHttpContext);

    expect(mockedFindByIdService.execute).toHaveBeenCalledWith('');
  });
});
