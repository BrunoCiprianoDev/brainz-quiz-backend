import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { UserUseCases } from '../../userUseCases';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { RoleEnum } from '@src/domain/entities/role';
import { BadRequestError, InternalServerError } from '@src/domain/util/errors/appErrors';

describe('CreateUser Test', () => {
  let userUseCases: UserUseCases;
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
    };

    mockedPasswordEncryptor = {
      encryptor: jest.fn(),
    };

    userUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedPasswordEncryptor as IPasswordEncryptor);
  });

  test('Should return the user created successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockResolvedValue(false);

    jest.spyOn(mockedUserRepository, 'create').mockResolvedValue({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Player,
      score: 0,
    });

    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockResolvedValue('passEncrypt');

    /**
     * @Execution
     */
    const sut = await userUseCases.create({
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'anyString',
      role: RoleEnum.Player,
    });

    /**
     * @Assert
     */
    expect(sut).toEqual({
      id: 'uuid',
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      role: RoleEnum.Player,
      score: 0,
    });
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledWith({ password: 'anyString' });
    expect(mockedUserRepository.existsByEmail).toHaveBeenCalledWith({ email: 'email@email.com' });
    expect(mockedUserRepository.create).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@email.com',
      avatar: 'avatar',
      password: 'passEncrypt',
      role: RoleEnum.Player,
    });
  });

  test('Should return BadRequestError when name is empty', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockClear();
    jest.spyOn(mockedUserRepository, 'create').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    /**
     * @Execution
     */
    await expect(
      userUseCases.create({
        name: '',
        email: 'email@email.com',
        avatar: 'avatar',
        password: 'passEncrypt',
        role: RoleEnum.Player,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);

    /**
     * @Assert
     */
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.existsByEmail).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.create).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when email is invalid', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockClear();
    jest.spyOn(mockedUserRepository, 'create').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    /**
     * @Assert and @Execution
     */
    await expect(
      userUseCases.create({
        name: 'name',
        email: 'anyString',
        avatar: 'avatar',
        password: 'passEncrypt',
        role: RoleEnum.Player,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.existsByEmail).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.create).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when password is invalid', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockClear();
    jest.spyOn(mockedUserRepository, 'create').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    /**
     * @Assert and @Execution
     */
    await expect(
      userUseCases.create({
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: '1234567', // password.lentgh < 8
        role: RoleEnum.Player,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.existsByEmail).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.create).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when email already exists', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockResolvedValue(true);
    jest.spyOn(mockedUserRepository, 'create').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    /**
     * @Assert and @Execution
     */
    await expect(
      userUseCases.create({
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: '12345678',
        role: RoleEnum.Player,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(mockedUserRepository.existsByEmail).toHaveBeenCalledWith({ email: 'email@email.com' });
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.create).toHaveBeenCalledTimes(0);
  });

  test('Shold return InternalServerError when a unexpected ocurr', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockRejectedValue(new Error('Any error'));
    jest.spyOn(mockedUserRepository, 'create').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();

    /**
     * @Assert and @Execution
     */
    await expect(
      userUseCases.create({
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: '12345678',
        role: RoleEnum.Player,
      }),
    ).rejects.toBeInstanceOf(InternalServerError);

    expect(mockedUserRepository.existsByEmail).toHaveBeenCalledTimes(1);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.create).toHaveBeenCalledTimes(0);
  });
});
