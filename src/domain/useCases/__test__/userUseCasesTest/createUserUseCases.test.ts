import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import {
  IUserUseCases,
  ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS,
  UserUseCases,
  ERROR_MESSAGE_USER_CONFIRM_PASSWORD,
} from '../../userUseCases';
import { BadRequestError, InternalServerError } from '@src/domain/util/errors';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import {
  VALID_USER_CREATE_DATA,
  VALID_USER_PASSWORD,
  VALID_USER_PASSWORD_HASH,
  VALID_USER_PUBLIC_DATA,
  VALID_USER_UUID,
} from './testConstantsUserUseCases';

describe('CreateUserUseCases test', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    mockedPasswordEncryptor = {
      encryptor: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
    );
  });

  test('Should create user successfully', async () => {
    /**
     * @Setup
     */
    const input = VALID_USER_CREATE_DATA;

    jest.spyOn(mockedUserRepository, 'existsByEmail').mockResolvedValue(false);
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(VALID_USER_UUID);
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockResolvedValue(VALID_USER_PASSWORD_HASH);
    jest.spyOn(mockedUserRepository, 'create').mockClear();

    /**
     * @Execution
     */
    const sut = await userUserUseCases.create(input);

    /**
     * @Assertion
     */
    expect(sut).toMatchObject(VALID_USER_PUBLIC_DATA);
    expect(sut).not.toHaveProperty('password');
    expect(mockedUserRepository.create).toHaveBeenCalledWith({
      id: VALID_USER_UUID,
      email: input.email,
      password: VALID_USER_PASSWORD_HASH,
      role: input.role,
    });
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledWith({ password: VALID_USER_PASSWORD });
  });

  test('Should return BadRequestError when password and confirmPassword not matches', async () => {
    /**
     * @Setup
     */
    const input = {
      ...VALID_USER_CREATE_DATA,
      confirmPassword: 'any',
    };

    jest.spyOn(mockedUserRepository, 'existsByEmail').mockResolvedValue(false);
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(VALID_USER_UUID);
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockResolvedValue(VALID_USER_PASSWORD_HASH);
    jest.spyOn(mockedUserRepository, 'create').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.create(input)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_USER_CONFIRM_PASSWORD),
    );
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });

  test('Should return BadRequestError when a user with the provided email already exists', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockResolvedValue(true);
    jest.spyOn(mockedUuidGenerator, 'generate').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();
    jest.spyOn(mockedUserRepository, 'create').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.create(VALID_USER_CREATE_DATA)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_USER_EMAIL_ALREADY_EXISTS),
    );
    expect(mockedUserRepository.create).toHaveBeenCalledTimes(0);
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserRepository, 'existsByEmail').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.create(VALID_USER_CREATE_DATA)).rejects.toBeInstanceOf(InternalServerError);
  });
});
