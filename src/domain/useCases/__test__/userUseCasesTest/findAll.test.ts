import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { UserUseCases } from '../../userUseCases';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { RoleEnum } from '@src/domain/entities/role';
import { InternalServerError } from '@src/domain/util/errors/appErrors';

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

  test('Should return a list user successfully', async () => {
    /**
     * @Setup
     */
    const listExpected = [
      {
        id: 'uuid1',
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: 'passEncrypt',
        role: RoleEnum.Player,
        score: 0
      },
      {
        id: 'uuid2',
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: 'passEncrypt',
        role: RoleEnum.Player,
        score: 0
      },
    ];

    jest.spyOn(mockedUserRepository, 'findAll').mockResolvedValue(listExpected);

    /**
     * @Execution
     */
    const sut = await userUseCases.findAll({ query: '', page: 1, size: 2 });

    /**
     * @Assert
     */
    expect(sut).toEqual(listExpected);
  });

  test('Must treat page or size values ​​when they are less than 1', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'findAll').mockClear();

    /**
     * @Execution
     */
    await userUseCases.findAll({ query: '', page: 0, size: 0 });

    /**
     * @Assert
     */
    expect(mockedUserRepository.findAll).toHaveBeenCalledWith({ query: '', page: 1, size: 1 });
  });

  test('Shold return InternalServerError when a unexpected ocurr', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'findAll').mockRejectedValue(new Error('Any Error'));

    /**
     * @Assert and @Excecution
     */
    await expect(userUseCases.findAll({ query: '', page: 1, size: 1 })).rejects.toBeInstanceOf(InternalServerError);
  });
});
