import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ERROR_MESSAGE_USER_NOT_FOUND_BY_ID, IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserControllers, UserControllers } from '../../userControllers';
import {
  VALID_USER_PASSWORD,
  VALID_USER_PUBLIC_DATA,
  VALID_USER_UUID,
} from '@src/domain/useCases/__test__/userUseCasesTest/testConstantsUserUseCases';
import { BadRequestError } from '@src/domain/util/errors';

describe('UpdateUserPassword tests', () => {
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userControllers: IUserControllers;

  beforeAll(() => {
    mockedUserUseCases = {
      updatePassword: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userControllers = new UserControllers(mockedUserUseCases as IUserUseCases);
  });

  test('Should return statuscode 200 when User password updated successfullly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updatePassword').mockResolvedValue(VALID_USER_PUBLIC_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: VALID_USER_UUID,
        password: VALID_USER_PASSWORD,
      },
    });

    /**
     * @Execution
     */
    await userControllers.updatePassword(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: VALID_USER_PUBLIC_DATA,
    });
    expect(mockedUserUseCases.updatePassword).toHaveBeenCalledWith({
      id: VALID_USER_UUID,
      password: VALID_USER_PASSWORD,
    });
  });

  test('Should handle AppError and return the message', async () => {
    /**
     * @Setup
     */
    jest
      .spyOn(mockedUserUseCases, 'updatePassword')
      .mockRejectedValue(new BadRequestError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: VALID_USER_UUID,
        password: VALID_USER_PASSWORD,
      },
    });

    /**
     * @Execution
     */
    await userControllers.updatePassword(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: ERROR_MESSAGE_USER_NOT_FOUND_BY_ID },
    });
    expect(mockedUserUseCases.updatePassword).toHaveBeenCalledWith({
      id: VALID_USER_UUID,
      password: VALID_USER_PASSWORD,
    });
  });

  test('Should handle attributes correctly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updatePassword').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userControllers.updatePassword(mockedHttpContext);
    /**
     * @Assert
     */
    expect(mockedUserUseCases.updatePassword).toHaveBeenCalledWith({
      id: '',
      password: '',
    });
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'updatePassword').mockRejectedValue(new Error('Any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {
        id: VALID_USER_UUID,
        password: VALID_USER_PASSWORD,
      },
    });

    /**
     * @Execution
     */
    await userControllers.updatePassword(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedUserUseCases.updatePassword).toHaveBeenCalledWith({
      id: VALID_USER_UUID,
      password: VALID_USER_PASSWORD,
    });
  });
});
