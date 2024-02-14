import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserController, UserController } from '../../userController';
import { RoleEnum } from '@src/domain/entities/role';
import { BadRequestError } from '@src/domain/util/errors/appErrors';

describe('UpdateScore tests', () => {
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userController: IUserController;

  beforeAll(() => {
    mockedUserUseCases = {
      updateScore: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userController = new UserController(mockedUserUseCases as IUserUseCases);
  });

  test('Should return user when update score successfully', async () => {
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

    jest.spyOn(mockedUserUseCases, 'updateScore').mockResolvedValue(userExpected);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: 'uuid',
        score: 100,
      },
    });

    /**
     * @Execution
     */
    await userController.updateScore(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpected,
    });

    expect(mockedUserUseCases.updateScore).toHaveBeenCalledWith({
      id: 'uuid',
      score: 100,
    });
  });

  test('Must treat attributes not provided with default values', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateScore').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.updateScore(mockedHttpContext);

    expect(mockedUserUseCases.updateScore).toHaveBeenCalledWith({
      id: '',
      score: -1,
    });
  });

  test('Should return error message when AppError to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateScore').mockRejectedValue(new BadRequestError('Any string'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: 'uuid',
        score: 100,
      },
    });

    /**
     * @Execution
     */
    await userController.updateScore(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Any string' },
    });

    expect(mockedUserUseCases.updateScore).toHaveBeenCalledWith({
      id: 'uuid',
      score: 100,
    });
  });

  test('Should return statusCode 500 when unexpected error to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updateScore').mockRejectedValue(new Error('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userController.updateScore(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
