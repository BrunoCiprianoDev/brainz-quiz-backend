import { ICreateUserService } from '../../services/createUserService';
import { Role } from '../../models/user';
import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { CreateAdminController, ICreateAdminController } from '../createAdminController';

describe('Create ADMIN controller tests', () => {
  let mockedCreateUserService: jest.Mocked<ICreateUserService>;
  let createAdminController: ICreateAdminController;
  let mockedhttpContext: jest.Mocked<IHttpContext>;

  beforeAll(() => {
    mockedCreateUserService = {
      execute: jest.fn(),
    };

    mockedhttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    createAdminController = new CreateAdminController(mockedCreateUserService);
  });

  test('Should create user with ADMIN role successfully', async () => {
    const expectUuidGenerated = 'fefa7b41-0acd-451c-bea6-b113c6d5eae4';

    const validUser = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd123',
      confirmPassword: 'p@ssw0rd123',
    };

    jest.spyOn(mockedCreateUserService, 'execute').mockResolvedValue({
      id: expectUuidGenerated,
      email: validUser.email,
      role: Role.Admin,
    });

    (mockedhttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: validUser,
    });

    await createAdminController.execute(mockedhttpContext);

    expect(mockedhttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: {
        id: expectUuidGenerated,
        email: validUser.email,
        role: Role.Admin,
      },
    });

    expect(mockedCreateUserService.execute).toHaveBeenCalledWith({ ...validUser, role: Role.Admin });
  });

  test('Should handle empty attributes', async () => {
    jest.spyOn(mockedCreateUserService, 'execute').mockClear();

    (mockedhttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    await createAdminController.execute(mockedhttpContext);

    expect(mockedCreateUserService.execute).toHaveBeenCalledWith({
      email: '',
      password: '',
      confirmPassword: '',
      role: Role.Admin,
    });
  });

  test('Should handle error', async () => {
    const validUser = {
      email: 'johnDoe@email.com',
      password: 'p@ssw0rd123',
      confirmPassword: 'p@ssw0rd123',
    };

    jest.spyOn(mockedCreateUserService, 'execute').mockRejectedValue(new BadRequestError('ErrorDescription'));

    (mockedhttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: validUser,
    });

    await createAdminController.execute(mockedhttpContext);

    expect(mockedhttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: {
        message: 'ErrorDescription',
      },
    });

    expect(mockedCreateUserService.execute).toHaveBeenCalledWith({ ...validUser, role: Role.Admin });
  });
});
