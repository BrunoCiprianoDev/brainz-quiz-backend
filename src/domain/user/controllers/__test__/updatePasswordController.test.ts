import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { IUpdatePasswordService } from '../../services/updatePasswordService';
import { IUpdatePasswordController, UpdatePasswordController } from '../updatePasswordController';

describe('Update password controller tests', () => {
  let mockedUpdatePasswordService: jest.Mocked<IUpdatePasswordService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let updatePasswordController: IUpdatePasswordController;

  beforeAll(() => {
    mockedUpdatePasswordService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    updatePasswordController = new UpdatePasswordController(mockedUpdatePasswordService);
  });

  test('Should return status 204 when update user successfully', async () => {
    const input = {
      token: 'TOKEN_FORGOT_PASS',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
    };

    jest.spyOn(mockedUpdatePasswordService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: input,
    });

    await updatePasswordController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 204,
      body: {},
    });

    expect(mockedUpdatePasswordService.execute).toHaveBeenCalledWith(input);
  });

  test('Should return handle empty attributes', async () => {
    jest.spyOn(mockedUpdatePasswordService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updatePasswordController.execute(mockedHttpContext);

    expect(mockedUpdatePasswordService.execute).toHaveBeenCalledWith({
      token: '',
      password: '',
      confirmPassword: '',
    });
  });

  test('Should return handle errors', async () => {
    jest.spyOn(mockedUpdatePasswordService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updatePasswordController.execute(mockedHttpContext);

    expect(mockedUpdatePasswordService.execute).toHaveBeenCalledWith({
      token: '',
      password: '',
      confirmPassword: '',
    });

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });
  });
});
