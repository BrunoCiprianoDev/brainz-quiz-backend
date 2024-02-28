import { BadRequestError, NotFoundError } from '../../../util/errors/appErrors';
import { Role } from '../../models/user';
import { IUserRepository } from '../../repositories/userRepository';
import {
  ERROR_MESSAGE_INVALID_ROLE_TO_UPDATE,
  ERROR_MESSAGE_NOT_FOUND_USER_ID_FROM_UPDATE,
  ERROR_MESSAGE_NUMBER_OF_ADMINS,
  IUpdateRoleService,
  UpdateRoleService,
} from '../updateRoleService';

describe('Update user role tests', () => {
  let updateRoleService: IUpdateRoleService;
  let mockedUserRepository: Partial<IUserRepository>;

  beforeAll(() => {
    mockedUserRepository = {
      findById: jest.fn(),
      updateRole: jest.fn(),
      numberOfAdmins: jest.fn(),
    };

    updateRoleService = new UpdateRoleService(mockedUserRepository as IUserRepository);
  });

  test('Should return user with role updated', async () => {
    const input = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      role: Role.Standard,
    };
    const mockedUserRepositoryExpectedReturn = {
      id: input.id,
      email: 'johnDoe@email.com',
      role: Role.Disable,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(mockedUserRepositoryExpectedReturn);
    jest.spyOn(mockedUserRepository, 'numberOfAdmins').mockResolvedValue(2);
    jest.spyOn(mockedUserRepository, 'updateRole').mockClear();

    const sut = await updateRoleService.execute(input);

    expect(sut).toMatchObject({
      ...mockedUserRepositoryExpectedReturn,
      role: input.role,
    });

    expect(mockedUserRepository.findById).toHaveBeenCalledWith(input.id);

    expect(mockedUserRepository.updateRole).toHaveBeenCalledWith({
      id: input.id,
      role: input.role,
    });
  });

  test('Should return an error when trying to update a rule other than admin and exists only had 2 admins', async () => {
    const input = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      role: Role.Standard,
    };
    const mockedUserRepositoryExpectedReturn = {
      id: input.id,
      email: 'johnDoe@email.com',
      role: Role.Admin,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(mockedUserRepositoryExpectedReturn);
    jest.spyOn(mockedUserRepository, 'numberOfAdmins').mockResolvedValue(1);
    jest.spyOn(mockedUserRepository, 'updateRole').mockClear();

    await expect(updateRoleService.execute(input)).rejects.toEqual(new BadRequestError(ERROR_MESSAGE_NUMBER_OF_ADMINS));

    expect(mockedUserRepository.findById).toHaveBeenCalledWith(input.id);

    expect(mockedUserRepository.updateRole).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when Role is not valid', async () => {
    const input = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      role: '****',
    };
    jest.spyOn(mockedUserRepository, 'findById').mockClear();
    jest.spyOn(mockedUserRepository, 'numberOfAdmins').mockClear();
    jest.spyOn(mockedUserRepository, 'updateRole').mockClear();

    await expect(updateRoleService.execute(input)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_INVALID_ROLE_TO_UPDATE),
    );
    expect(mockedUserRepository.findById).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.updateRole).toHaveBeenCalledTimes(0);
  });

  test('Should return NotFoundError when not found user by id', async () => {
    const input = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      role: Role.Standard,
    };
    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(mockedUserRepository, 'numberOfAdmins').mockClear();
    jest.spyOn(mockedUserRepository, 'updateRole').mockClear();

    await expect(updateRoleService.execute(input)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER_ID_FROM_UPDATE),
    );
    expect(mockedUserRepository.findById).toHaveBeenCalledWith(input.id);
    expect(mockedUserRepository.updateRole).toHaveBeenCalledTimes(0);
  });
});
