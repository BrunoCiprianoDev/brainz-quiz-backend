import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ERROR_MESSAGE_USER_FIND_ALL_PARAMS, IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IUserControllers, UserControllers } from '../../userControllers';
import { VALID_USER_PUBLIC_DATA } from '@src/domain/useCases/__test__/userUseCasesTest/testConstantsUserUseCases';
import { BadRequestError } from '@src/domain/util/errors';

describe('FindAll tests', () => {
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let userControllers: IUserControllers;

  beforeAll(() => {
    mockedUserUseCases = {
      findAll: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    userControllers = new UserControllers(mockedUserUseCases as IUserUseCases);
  });

  test('Should return statuscode 200 when User found list uses successfullly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'findAll').mockResolvedValue([VALID_USER_PUBLIC_DATA, VALID_USER_PUBLIC_DATA]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        page: 1,
        size: 10,
        query: 'anyString',
      },
    });

    /**
     * @Execution
     */
    await userControllers.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: [VALID_USER_PUBLIC_DATA, VALID_USER_PUBLIC_DATA],
    });
    expect(mockedUserUseCases.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      query: 'anyString',
    });
  });

  test('Should handle AppError and return the message', async () => {
    /**
     * @Setup
     */
    jest
      .spyOn(mockedUserUseCases, 'findAll')
      .mockRejectedValue(new BadRequestError(ERROR_MESSAGE_USER_FIND_ALL_PARAMS));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        page: 0,
        size: 0,
        query: 'anyString',
      },
    });

    /**
     * @Execution
     */
    await userControllers.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: ERROR_MESSAGE_USER_FIND_ALL_PARAMS },
    });
    expect(mockedUserUseCases.findAll).toHaveBeenCalledWith({
      page: 0,
      size: 0,
      query: 'anyString',
    });
  });

  test('Should handle attributes correctly', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'findAll').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await userControllers.findAll(mockedHttpContext);
    /**
     * @Assert
     */
    expect(mockedUserUseCases.findAll).toHaveBeenCalledWith({
      page: 0,
      size: 0,
      query: '',
    });
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'findAll').mockRejectedValue(new Error('Any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        page: 1,
        size: 10,
        query: 'anyString',
      },
    });

    /**
     * @Execution
     */
    await userControllers.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedUserUseCases.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      query: 'anyString',
    });
  });
});
