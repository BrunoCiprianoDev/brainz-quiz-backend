import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserController, UserController } from '../../userController';
import { RoleEnum } from '@src/domain/entities/role';
import { BadRequestError } from '@src/domain/util/errors/appErrors';

describe('UpdateAvatar tests', () => {
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

  test('Should return user when update avatar successfully', async () => {
    /**
     * @Setup
     */
    const userExpected = {
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Player,
      score: 0
    };

    jest.spyOn(mockedUserUseCases, 'updateAvatar').mockResolvedValue(userExpected);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: 'uuid',
        avatar: 'photo.png',
      },
    });

    /**
     * @Execution
     */
    await userController.updateAvatar(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpected,
    });

    expect(mockedUserUseCases.updateAvatar).toHaveBeenCalledWith({
      id: 'uuid',
      avatar: 'photo.png',
    });
  });

  test('Must treat attributes not provided with default values', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateAvatar').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.updateAvatar(mockedHttpContext);

    expect(mockedUserUseCases.updateAvatar).toHaveBeenCalledWith({
      id: '',
      avatar: '',
    });
  });

  test('Should return error message when AppError to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateAvatar').mockRejectedValue(new BadRequestError('Any string'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: 'uuid',
        avatar: 'photo.png',
      },
    });

    /**
     * @Execution
     */
    await userController.updateAvatar(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Any string' },
    });

    expect(mockedUserUseCases.updateAvatar).toHaveBeenCalledWith({
      id: 'uuid',
      avatar: 'photo.png',
    });
  });

  test('Should return statusCode 500 when unexpected error to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateAvatar').mockRejectedValue(new Error('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.updateAvatar(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
