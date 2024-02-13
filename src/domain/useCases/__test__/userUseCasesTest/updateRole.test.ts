import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { UserUseCases } from '../../userUseCases';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { RoleEnum } from '@src/domain/entities/role';
import { BadRequestError, InternalServerError, NotFoundError } from '@src/domain/util/errors/appErrors';

describe('CreateUser Test', () => {
  let userUseCases: UserUseCases;
  let mockedUserRepository: jest.Mocked<IUserRepository>;
  let mockedPasswordEncryptor: jest.Mocked<IPasswordEncryptor>;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      updateRole: jest.fn(),
      updateName: jest.fn(),
      updateAvatar: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      existsByEmail: jest.fn(),
      existsById: jest.fn(),
    };

    mockedPasswordEncryptor = {
      encryptor: jest.fn(),
      passwordCompare: jest.fn(),
    };

    userUseCases = new UserUseCases(mockedUserRepository, mockedPasswordEncryptor);
  });

  test('Should update user role successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(true);

    jest.spyOn(mockedUserRepository, 'updateRole').mockResolvedValue({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Admin,
      score: 0
    });

    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockResolvedValue('passEncrypt');

    /**
     * @Execution
     */
    const sut = await userUseCases.updateRole({ id: 'uuid', role: RoleEnum.Admin });

    /**
     * @Assert
     */
    expect(sut).toEqual({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      role: RoleEnum.Admin,
      score: 0
    });
    expect(mockedUserRepository.existsById).toHaveBeenCalledWith({ id: 'uuid' });
  });

  test('Should return NotFoundError when id not found', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'updateRole').mockClear();
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(false);

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.updateRole({ id: 'uuid', role: RoleEnum.Admin })).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedUserRepository.updateRole).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when invalid role', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'updateRole').mockClear();
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(true);

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.updateRole({ id: 'uuid', role: 'anyString' })).rejects.toBeInstanceOf(BadRequestError);
    expect(mockedUserRepository.updateRole).toHaveBeenCalledTimes(0);
  });

  test('Shold return InternalServerError when a unexpected ocurr', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'updateRole').mockRejectedValue(new Error('Any Error'));
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(true);

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.updateRole({ id: 'uuid', role: 'ADMIN' })).rejects.toBeInstanceOf(InternalServerError);
  });
});
