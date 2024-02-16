import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, ERROR_MESSAGE_USER_NOT_FOUND_BY_ID, UserUseCases } from '../../userUseCases';
import { BadRequestError, InternalServerError, NotFoundError } from '@src/domain/util/errors';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { INVALID_ENUM_MESSAGE } from '@src/domain/util/constraints';
import {
  INVALID_USER_ROLE,
  VALID_USER_DATA,
  VALID_USER_PUBLIC_DATA,
  VALID_USER_ROLE,
  VALID_USER_UUID,
} from './testConstantsUserUseCases';
import { RoleEnum } from '@src/domain/entities/user';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';

describe('UpdateRoleUseCase tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      update: jest.fn(),
      findById: jest.fn(),
      existsById: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
    );
  });

  test('Should update user role successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
      role: RoleEnum.Admin,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     */
    const sut = await userUserUseCases.updateRole(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject({ ...VALID_USER_PUBLIC_DATA, role: input.role });
    expect(sut).not.toHaveProperty('password');
    expect(mockedUserRepository.findById).toHaveBeenCalledWith({ id: input.id });
    expect(mockedUserRepository.update).toHaveBeenCalledWith({ ...VALID_USER_DATA, role: input.role });
  });

  test('Should return NotFoundError when not finding user by id', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
      role: VALID_USER_ROLE,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.updateRole(input)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID),
    );
    expect(mockedUserRepository.findById).toHaveBeenCalledWith({ id: input.id });
    expect(mockedUserRepository.update).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when Role is invalid', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
      role: INVALID_USER_ROLE,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.updateRole(input)).rejects.toEqual(
      new BadRequestError(`${INVALID_ENUM_MESSAGE} role`),
    );
    expect(mockedUserRepository.findById).toHaveBeenCalledWith({ id: input.id });
    expect(mockedUserRepository.update).toHaveBeenCalledTimes(0);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
      role: VALID_USER_ROLE,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.updateRole(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
