import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, UserUseCases } from '../../userUseCases';
import { VALID_USER_DATA, VALID_USER_PUBLIC_DATA } from './testConstantsUserUseCases';
import { ForbiddenError } from '@src/domain/util/errors';

describe('ValidatePassword tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    mockedPasswordEncryptor = {
      passwordCompare: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
    );
  });

  test('Should return UserPublicData when password and email is valid', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_DATA.email,
      password: VALID_USER_DATA.password,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedPasswordEncryptor, 'passwordCompare').mockResolvedValue(true);

    /**
     * @Execution
     */
    const sut = await userUserUseCases.validatePassword(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_USER_PUBLIC_DATA);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledWith({
      password: input.password,
      passwordEncrypt: VALID_USER_DATA.password,
    });
  });

  test('Should return ForbiddenError when not found user by email', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_DATA.email,
      password: VALID_USER_DATA.password,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(mockedPasswordEncryptor, 'passwordCompare').mockClear();

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.validatePassword(input)).rejects.toBeInstanceOf(ForbiddenError);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledTimes(0);
  });

  test('Should return ForbiddenError when password is invalid', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_DATA.email,
      password: VALID_USER_DATA.password,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedPasswordEncryptor, 'passwordCompare').mockResolvedValue(false);

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.validatePassword(input)).rejects.toBeInstanceOf(ForbiddenError);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledWith({
      password: input.password,
      passwordEncrypt: VALID_USER_DATA.password,
    });
  });
});
