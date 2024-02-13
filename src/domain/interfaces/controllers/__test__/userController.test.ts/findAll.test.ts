import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserController, UserController } from '../../userController';
import { RoleEnum } from '@src/domain/entities/role';

describe('FindAll tests', () => {
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


  test('Should return a list user successfully', async () => {
    /**
     * @Setup
     */
    const userExpected = [{
      id: 'uuid1',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Admin,
    },
    {
      id: 'uuid2',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Player,
    }];

    jest.spyOn(mockedUserUseCases, 'findAll').mockResolvedValue(userExpected);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        query: 'anyString',
        page: 1,
        size: 10
      }
    });

    /**
     * @Execution
     */
    await userController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpected,
    });

    expect(mockedUserUseCases.findAll).toHaveBeenCalledWith({
      query: 'anyString',
      page: 1,
      size: 10
    });
  });

  test('Must treat attributes not provided with default values', async () => {
    /**
     * @Setup
     */
    const userExpected = [{
      id: 'uuid1',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Admin,
    },
    {
      id: 'uuid2',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Player,
    }];

    jest.spyOn(mockedUserUseCases, 'findAll').mockResolvedValue(userExpected);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await userController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpected,
    });

    expect(mockedUserUseCases.findAll).toHaveBeenCalledWith({
      query: '',
      page: 0,
      size: 0
    });
  });

  test('Should return statusCode 500 when unexpected error to occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'findAll').mockRejectedValue(new Error('Any message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await userController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
})