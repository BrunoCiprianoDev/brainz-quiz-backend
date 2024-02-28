import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { IGetTokenUpdatePasswordService } from '../../services/getTokenUpdatePasswordService';
import {
  GetTokenUpdatePasswordController,
  IGetTokenUpdatePasswordController,
} from '../getTokenUpdatePasswordController';

describe('Get token updated password controller tests', () => {
  let mockedGetTokenUpdatePasswordService: jest.Mocked<IGetTokenUpdatePasswordService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let getTokenUpdatePasswordController: IGetTokenUpdatePasswordController;

  beforeAll(() => {
    mockedGetTokenUpdatePasswordService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    getTokenUpdatePasswordController = new GetTokenUpdatePasswordController(mockedGetTokenUpdatePasswordService);
  });

  test('Should return status code 204 when email is valid', async () => {
    jest.spyOn(mockedGetTokenUpdatePasswordService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        email: 'johndoe@email.com',
      },
    });

    await getTokenUpdatePasswordController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 204,
      body: {},
    });

    expect(mockedGetTokenUpdatePasswordService.execute).toHaveBeenCalledWith('johndoe@email.com');
  });

  test('Should handle empty query', async () => {
    jest.spyOn(mockedGetTokenUpdatePasswordService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await getTokenUpdatePasswordController.execute(mockedHttpContext);

    expect(mockedGetTokenUpdatePasswordService.execute).toHaveBeenCalledWith('');
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedGetTokenUpdatePasswordService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await getTokenUpdatePasswordController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });

    expect(mockedGetTokenUpdatePasswordService.execute).toHaveBeenCalledWith('');
  });
});
