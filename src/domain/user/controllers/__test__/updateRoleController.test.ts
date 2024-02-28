import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { Role } from '../../models/user';
import { IUpdateRoleService } from '../../services/updateRoleService';
import { IUpdateRoleController, UpdateRoleController } from '../updateRoleController';

describe('Update role user tests', () => {
  let mockedUpdateRole: jest.Mocked<IUpdateRoleService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let updateRoleController: IUpdateRoleController;

  beforeAll(() => {
    mockedUpdateRole = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    updateRoleController = new UpdateRoleController(mockedUpdateRole);
  });

  test('Should return a user updated', async () => {
    const input = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      role: Role.Standard,
    };

    const userExpectedWhenMockedServiceCalled = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johnDoe@email.com',
      role: Role.Standard,
    };

    jest.spyOn(mockedUpdateRole, 'execute').mockResolvedValue(userExpectedWhenMockedServiceCalled);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: input,
    });

    await updateRoleController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: userExpectedWhenMockedServiceCalled,
    });

    expect(mockedUpdateRole.execute).toHaveBeenCalledWith(input);
  });

  test('Should handle empty attributes', async () => {
    jest.spyOn(mockedUpdateRole, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updateRoleController.execute(mockedHttpContext);

    expect(mockedUpdateRole.execute).toHaveBeenCalledWith({ id: '', role: '' });
  });

  test('Should handle errors', async () => {
    const input = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      role: Role.Standard,
    };

    jest.spyOn(mockedUpdateRole, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: input,
    });

    await updateRoleController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });

    expect(mockedUpdateRole.execute).toHaveBeenCalledWith(input);
  });
});
