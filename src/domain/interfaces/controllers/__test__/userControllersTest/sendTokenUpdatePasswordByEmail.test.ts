import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ERROR_MESSAGE_USER_NOT_FOUND_BY_ID, IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserControllers, UserControllers } from '../../userControllers';
import { VALID_USER_EMAIL } from '@src/domain/useCases/__test__/userUseCasesTest/testConstantsUserUseCases';
import { BadRequestError } from '@src/domain/util/errors';

describe('SendTokenUpdatePasswordByEmail tests', () => {
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userControllers: IUserControllers;

  beforeAll(() => {
    mockedUserUseCases = {
      sendTokenUpdatePasswordByEmail: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userControllers = new UserControllers(mockedUserUseCases as IUserUseCases);
  });

  test('Should return token successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'sendTokenUpdatePasswordByEmail').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        email: VALID_USER_EMAIL,
      },
      body: {},
    });

    /**
     * @Execution
     */
    await userControllers.sendTokenUpdatePasswordByEmail(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 204,
      body: {},
    });
    expect(mockedUserUseCases.sendTokenUpdatePasswordByEmail).toHaveBeenCalledWith({
      email: VALID_USER_EMAIL,
    });
  });

  test('Should handle AppError and return the message', async () => {
    /**
     * @Setup
     */
    jest
      .spyOn(mockedUserUseCases, 'sendTokenUpdatePasswordByEmail')
      .mockRejectedValue(new BadRequestError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        email: VALID_USER_EMAIL,
      },
      body: {},
    });

    /**
     * @Execution
     */
    await userControllers.sendTokenUpdatePasswordByEmail(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: ERROR_MESSAGE_USER_NOT_FOUND_BY_ID },
    });
    expect(mockedUserUseCases.sendTokenUpdatePasswordByEmail).toHaveBeenCalledWith({
      email: VALID_USER_EMAIL,
    });
  });

  test('Should handle attributes correctly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'sendTokenUpdatePasswordByEmail').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userControllers.sendTokenUpdatePasswordByEmail(mockedHttpContext);
    /**
     * @Assert
     */
    expect(mockedUserUseCases.sendTokenUpdatePasswordByEmail).toHaveBeenCalledWith({
      email: '',
    });
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'sendTokenUpdatePasswordByEmail').mockRejectedValue(new Error('Any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        email: VALID_USER_EMAIL,
      },
      body: {},
    });

    /**
     * @Execution
     */
    await userControllers.sendTokenUpdatePasswordByEmail(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedUserUseCases.sendTokenUpdatePasswordByEmail).toHaveBeenCalledWith({
      email: VALID_USER_EMAIL,
    });
  });
});
