import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, UserUseCases } from '../../userUseCases';
import { VALID_TOKEN, VALID_USER_DATA, VALID_USER_PUBLIC_DATA } from './testConstantsUserUseCases';
import { ForbiddenError } from '@src/domain/util/errors';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';

describe('ValidatePassword tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    mockedPasswordEncryptor = {
      passwordCompare: jest.fn(),
    };

    mockedTokenGenerator = {
      generateToken: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
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
    jest.spyOn(mockedTokenGenerator, 'generateToken').mockResolvedValue({ token: VALID_TOKEN });

    /**
     * @Execution
     */
    const sut = await userUserUseCases.authenticate(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject({ token: VALID_TOKEN });
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledWith({
      password: input.password,
      passwordEncrypt: VALID_USER_DATA.password,
    });
    expect(mockedTokenGenerator.generateToken).toHaveBeenCalledWith({
      id: VALID_USER_DATA.id,
      email: VALID_USER_DATA.email,
      role: VALID_USER_DATA.role,
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
    jest.spyOn(mockedTokenGenerator, 'generateToken').mockClear();

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.authenticate(input)).rejects.toBeInstanceOf(ForbiddenError);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledTimes(0);
    expect(mockedTokenGenerator.generateToken).toHaveBeenCalledTimes(0);
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
    jest.spyOn(mockedTokenGenerator, 'generateToken').mockClear();

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.authenticate(input)).rejects.toBeInstanceOf(ForbiddenError);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedPasswordEncryptor.passwordCompare).toHaveBeenCalledWith({
      password: input.password,
      passwordEncrypt: VALID_USER_DATA.password,
    });
    expect(mockedTokenGenerator.generateToken).toHaveBeenCalledTimes(0);
  });
});
