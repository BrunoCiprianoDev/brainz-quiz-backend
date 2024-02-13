import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserController, UserController } from '../../userController';
import { RoleEnum } from '@src/domain/entities/role';
import { BadRequestError } from '@src/domain/util/errors/appErrors';

describe('CreateAdmin tests', () => {
  let mockedUserUseCases: jest.Mocked<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userController: IUserController;

  beforeAll(() => {
    mockedUserUseCases = {
      create: jest.fn(),
      updateRole: jest.fn(),
      updateName: jest.fn(),
      updateAvatar: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userController = new UserController(mockedUserUseCases);
  });

  test('Should return admin created successfully', async () => {
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
    };

    jest.spyOn(mockedUserUseCases, 'create').mockResolvedValue(userExpected);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: 'passEncrypt',
      },
    });

    /**
     * @Execution
     */
    await userController.createAdmin(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: userExpected,
    });

    expect(mockedUserUseCases.create).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: 'ADMIN',
    });
  });

  test('Must treat attributes not provided with default values', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'create').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.createAdmin(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedUserUseCases.create).toHaveBeenCalledWith({
      name: '',
      email: '',
      avatar: '',
      password: '',
      role: 'ADMIN',
    });
  });

  test('Should return error message when AppError to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'create').mockRejectedValue(new BadRequestError('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.createAdmin(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Any message' },
    });
  });

  test('Should return statusCode 500 when unexpected error to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'create').mockRejectedValue(new Error('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.createAdmin(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
