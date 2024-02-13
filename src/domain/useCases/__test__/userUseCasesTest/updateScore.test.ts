import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { UserUseCases } from '../../userUseCases';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { RoleEnum } from '@src/domain/entities/role';
import { BadRequestError, InternalServerError, NotFoundError } from '@src/domain/util/errors/appErrors';

describe('UpdateScore Test', () => {
  let userUseCases: UserUseCases;
  let mockedUserRepository: jest.Mocked<IUserRepository>;
  let mockedPasswordEncryptor: jest.Mocked<IPasswordEncryptor>;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      updateRole: jest.fn(),
      updateName: jest.fn(),
      updateAvatar: jest.fn(),
      updateScore: jest.fn(),
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

  test('Should update user score successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(true);

    jest.spyOn(mockedUserRepository, 'updateScore').mockResolvedValue({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      role: RoleEnum.Admin,
      score: 120
    });

    /**
     * @Execution
     */
    const sut = await userUseCases.updateScore({ id: 'uuid', score: 120 });

    /**
     * @Assert
     */
    expect(sut).toEqual({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      role: RoleEnum.Admin,
      score: 120
    });
    expect(mockedUserRepository.existsById).toHaveBeenCalledWith({ id: 'uuid' });
  });

  test('Should return NotFoundError when id not found', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'updateScore').mockClear();
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(false);

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.updateScore({ id: 'uuid', score: 120 })).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedUserRepository.updateScore).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when invalid score', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'updateScore').mockClear();
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(true);

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.updateScore({ id: 'uuid', score: -1 })).rejects.toBeInstanceOf(BadRequestError);
    expect(mockedUserRepository.updateScore).toHaveBeenCalledTimes(0);
  });

  test('Shold return InternalServerError when a unexpected ocurr', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'updateScore').mockRejectedValue(new Error('Any Error'));
    jest.spyOn(mockedUserRepository, 'existsById').mockResolvedValue(true);

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.updateScore({ id: 'uuid', score: 120 })).rejects.toBeInstanceOf(InternalServerError);
  });
});
