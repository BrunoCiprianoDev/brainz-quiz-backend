import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS, IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserControllers, UserControllers } from '../../userControllers';
import {
  VALID_USER_CREATE_DATA,
  VALID_USER_PUBLIC_DATA,
} from '@src/domain/useCases/__test__/userUseCasesTest/testConstantsUserUseCases';
import { RoleEnum } from '@src/domain/entities/user';
import { BadRequestError } from '@src/domain/util/errors';

describe('CreatePlayer tests', () => {
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userControllers: IUserControllers;

  beforeAll(() => {
    mockedUserUseCases = {
      create: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userControllers = new UserControllers(mockedUserUseCases as IUserUseCases);
  });

  test('Should return statuscode 201 when Admin created successfullly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'create').mockResolvedValue(VALID_USER_PUBLIC_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { ...VALID_USER_CREATE_DATA },
    });

    /**
     * @Execution
     */
    await userControllers.createPlayer(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: VALID_USER_PUBLIC_DATA,
    });
    expect(mockedUserUseCases.create).toHaveBeenCalledWith({ ...VALID_USER_CREATE_DATA, role: RoleEnum.Player });
  });

  test('Should handle AppError and return the message', async () => {
    /**
     * @Setup
     */
    jest
      .spyOn(mockedUserUseCases, 'create')
      .mockRejectedValue(new BadRequestError(ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { ...VALID_USER_CREATE_DATA },
    });

    /**
     * @Execution
     */
    await userControllers.createPlayer(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS },
    });
    expect(mockedUserUseCases.create).toHaveBeenCalledWith({ ...VALID_USER_CREATE_DATA, role: RoleEnum.Player });
  });

  test('Should handle attributes correctly', async () => {
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
    await userControllers.createPlayer(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedUserUseCases.create).toHaveBeenCalledWith({
      email: '',
      password: '',
      confirmPassword: '',
      role: RoleEnum.Player,
    });
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'create').mockRejectedValue(new Error('Any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { ...VALID_USER_CREATE_DATA },
    });

    /**
     * @Execution
     */
    await userControllers.createPlayer(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedUserUseCases.create).toHaveBeenCalledWith({ ...VALID_USER_CREATE_DATA, role: RoleEnum.Player });
  });
});
