import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserController, UserController } from '../../userController';
import { RoleEnum } from '@src/domain/entities/role';
import { BadRequestError } from '@src/domain/util/errors/appErrors';

describe('UpdateName tests', () => {
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userController: IUserController;

  beforeAll(() => {
    mockedUserUseCases = {
      updateName: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userController = new UserController(mockedUserUseCases as IUserUseCases);
  });

  test('Should return user when update name successfully', async () => {
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
      score: 0,
    };

    jest.spyOn(mockedUserUseCases, 'updateName').mockResolvedValue(userExpected);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: 'uuid',
        name: 'John Doe',
      },
    });

    /**
     * @Execution
     */
    await userController.updateName(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpected,
    });

    expect(mockedUserUseCases.updateName).toHaveBeenCalledWith({
      id: 'uuid',
      name: 'John Doe',
    });
  });

  test('Must treat attributes not provided with default values', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateName').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.updateName(mockedHttpContext);

    expect(mockedUserUseCases.updateName).toHaveBeenCalledWith({
      id: '',
      name: '',
    });
  });

  test('Should return error message when AppError to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateName').mockRejectedValue(new BadRequestError('Any string'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: 'uuid',
        name: 'John Doe',
      },
    });

    /**
     * @Execution
     */
    await userController.updateName(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Any string' },
    });

    expect(mockedUserUseCases.updateName).toHaveBeenCalledWith({
      id: 'uuid',
      name: 'John Doe',
    });
  });

  test('Should return statusCode 500 when unexpected error to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateName').mockRejectedValue(new Error('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.updateName(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
