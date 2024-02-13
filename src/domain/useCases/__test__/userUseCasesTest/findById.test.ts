import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { UserUseCases } from '../../userUseCases';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { RoleEnum } from '@src/domain/entities/role';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors/appErrors';

describe('FindById Test', () => {
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

  test('Should return a userById', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Admin,
      score: 0,
    });

    /**
     * @Execution
     */
    const sut = await userUseCases.findById({ id: 'uuid' });

    /**
     * @Assert
     */
    expect(sut).toEqual({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      role: RoleEnum.Admin,
      score: 0,
    });
    expect(mockedUserRepository.findById).toHaveBeenCalledWith({ id: 'uuid' });
  });

  test('Should return NotFoundError when not found user by id', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.findById({ id: 'uuid' })).rejects.toBeInstanceOf(NotFoundError);
  });

  test('Shold return InternalServerError when a unexpected ocurr', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'findById').mockRejectedValue(new Error('Any error'));

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.findById({ id: 'uuid' })).rejects.toBeInstanceOf(InternalServerError);
  });
});
