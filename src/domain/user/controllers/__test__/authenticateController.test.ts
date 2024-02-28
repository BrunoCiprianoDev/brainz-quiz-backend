import { IHttpContext } from '../../../util/adapters/httpContext';
import { ForbiddenError } from '../../../util/errors/appErrors';
import { IAuthenticateService } from '../../services/authenticateService';
import { AuthenticateController, IAuthenticateController } from '../authenticateController';

describe('Authenticate controller tests', () => {
  let mockedAuthenticateService: jest.Mocked<IAuthenticateService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let authenticateController: IAuthenticateController;

  beforeAll(() => {
    mockedAuthenticateService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    authenticateController = new AuthenticateController(mockedAuthenticateService);
  });

  test('Should return token when credentials is valid', async () => {
    const tokenExpected = '993b58c1-cdb6-4814-be90-2dea91bd25fd';
    const email = 'johnDoe@email.com';
    const password = 'p@ssword';

    jest.spyOn(mockedAuthenticateService, 'execute').mockResolvedValue({
      token: tokenExpected,
    });

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { email, password },
    });

    await authenticateController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: { token: tokenExpected },
    });

    expect(mockedAuthenticateService.execute).toHaveBeenCalledWith({
      email,
      password,
    });
  });

  test('Should handle empty values', async () => {
    const tokenExpected = '993b58c1-cdb6-4814-be90-2dea91bd25fd';

    jest.spyOn(mockedAuthenticateService, 'execute').mockResolvedValue({
      token: tokenExpected,
    });

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await authenticateController.execute(mockedHttpContext);

    expect(mockedAuthenticateService.execute).toHaveBeenCalledWith({
      email: '',
      password: '',
    });
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedAuthenticateService, 'execute').mockRejectedValue(new ForbiddenError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await authenticateController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 403,
      body: { message: 'Error message' },
    });

    expect(mockedAuthenticateService.execute).toHaveBeenCalledWith({
      email: '',
      password: '',
    });
  });
});
