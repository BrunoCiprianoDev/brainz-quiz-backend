import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ERROR_MESSAGE_USER_PASSWORD_INVALID, IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserControllers, UserControllers } from '../../userControllers';
import {
  VALID_TOKEN,
  VALID_USER_EMAIL,
  VALID_USER_PASSWORD,
} from '@src/domain/useCases/__test__/userUseCasesTest/testConstantsUserUseCases';
import { ForbiddenError } from '@src/domain/util/errors';

describe('Authenticate tests', () => {
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userControllers: IUserControllers;

  beforeAll(() => {
    mockedUserUseCases = {
      authenticate: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userControllers = new UserControllers(mockedUserUseCases as IUserUseCases);
  });

  test('Should return statuscode 200 and tokenPayload successfullly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'authenticate').mockResolvedValue({ token: VALID_TOKEN });

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        email: VALID_USER_EMAIL,
        password: VALID_USER_PASSWORD,
      },
    });

    /**
     * @Execution
     */
    await userControllers.authenticate(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: { token: VALID_TOKEN }
    });
    expect(mockedUserUseCases.authenticate).toHaveBeenCalledWith({
      email: VALID_USER_EMAIL,
      password: VALID_USER_PASSWORD,
    });
  });

  test('Should handle AppError and return the message', async () => {
    /**
     * @Setup
     */
    jest
      .spyOn(mockedUserUseCases, 'authenticate')
      .mockRejectedValue(new ForbiddenError(ERROR_MESSAGE_USER_PASSWORD_INVALID));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        email: VALID_USER_EMAIL,
        password: VALID_USER_PASSWORD,
      },
    });

    /**
     * @Execution
     */
    await userControllers.authenticate(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 403,
      body: { message: ERROR_MESSAGE_USER_PASSWORD_INVALID },
    });
    expect(mockedUserUseCases.authenticate).toHaveBeenCalledWith({
      email: VALID_USER_EMAIL,
      password: VALID_USER_PASSWORD,
    });
  });

  test('Should handle attributes correctly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'authenticate').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userControllers.authenticate(mockedHttpContext);
    /**
     * @Assert
     */
    expect(mockedUserUseCases.authenticate).toHaveBeenCalledWith({
      email: '',
      password: '',
    });
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'authenticate').mockRejectedValue(new Error('Any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        email: VALID_USER_EMAIL,
        password: VALID_USER_PASSWORD,
      },
    });

    /**
     * @Execution
     */
    await userControllers.authenticate(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedUserUseCases.authenticate).toHaveBeenCalledWith({
      email: VALID_USER_EMAIL,
      password: VALID_USER_PASSWORD,
    });
  });
});
