import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserController, UserController } from '../../userController';
import { RoleEnum } from '@src/domain/entities/role';
import { NotFoundError } from '@src/domain/util/errors/appErrors';

describe('FindById tests', () => {
  let mockedUserUseCases: jest.Mocked<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userController: IUserController;

  beforeAll(() => {
    mockedUserUseCases = {
      create: jest.fn(),
      updateRole: jest.fn(),
      updateName: jest.fn(),
      updateAvatar: jest.fn(),
      updateScore: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userController = new UserController(mockedUserUseCases);
  });

  test('Should return a user by id successfully', async () => {
    /**
     * @Setup
     */
    const userExpected = {
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Admin,
      score: 0,
    };

    jest.spyOn(mockedUserUseCases, 'findById').mockResolvedValue(userExpected);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: { id: 'uuid' },
    });

    /**
     * @Execution
     */
    await userController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpected,
    });

    expect(mockedUserUseCases.findById).toHaveBeenCalledWith({
      id: 'uuid',
    });
  });

  test('Must treat attributes not provided with default values', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'create').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await userController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedUserUseCases.findById).toHaveBeenCalledWith({
      id: '',
    });
  });

  test('Should return error message when AppError to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'findById').mockRejectedValue(new NotFoundError('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 404,
      body: { message: 'Any message' },
    });
  });

  test('Should return statusCode 500 when unexpected error to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'findById').mockRejectedValue(new Error('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
