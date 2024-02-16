import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, ERROR_MESSAGE_USER_NOT_FOUND_BY_ID, UserUseCases } from '../../userUseCases';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';
import {
  VALID_USER_DATA,
  VALID_USER_PASSWORD,
  VALID_USER_PASSWORD_HASH,
  VALID_USER_PUBLIC_DATA,
  VALID_USER_UUID,
} from './testConstantsUserUseCases';

describe('UpdatePasswordUseCase tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      update: jest.fn(),
      findById: jest.fn(),
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

  test('Should return User password updated successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
      password: VALID_USER_PASSWORD,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockResolvedValue(VALID_USER_PASSWORD_HASH);
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     */
    const sut = await userUserUseCases.updatePassword(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_USER_PUBLIC_DATA);
    expect(sut).not.toHaveProperty('password');
    expect(mockedUserRepository.findById).toHaveBeenCalledWith({ id: input.id });
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledWith({ password: input.password });
    expect(mockedUserRepository.update).toHaveBeenCalledWith({
      ...VALID_USER_DATA,
      password: VALID_USER_PASSWORD_HASH,
    });
  });

  test('Should return NotFoundError when not found user by id', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
      password: VALID_USER_PASSWORD,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.updatePassword(input)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND_BY_ID),
    );
    expect(mockedUserRepository.findById).toHaveBeenCalledWith({ id: input.id });
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.update).toHaveBeenCalledTimes(0);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
      password: VALID_USER_PASSWORD,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.updatePassword(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
