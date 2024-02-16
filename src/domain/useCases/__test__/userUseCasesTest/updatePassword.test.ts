import { IEmailSender } from '@src/domain/interfaces/adapters/emailSender';
import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, UserUseCases } from '../../userUseCases';
import {
  VALID_TOKEN,
  VALID_USER_DATA,
  VALID_USER_PASSWORD,
  VALID_USER_PASSWORD_HASH,
  VALID_USER_PUBLIC_DATA,
} from './testConstantsUserUseCases';
import { BadRequestError, NotFoundError } from '@src/domain/util/errors';

describe('Authenticate tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let mockedEmailSender: Partial<IEmailSender>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    mockedPasswordEncryptor = {
      encryptor: jest.fn(),
    };

    mockedTokenGenerator = {
      getPayloadTokenResetPass: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
      mockedEmailSender as IEmailSender,
    );
  });

  test('Should return user with password updated', async () => {
    /**
     * @Setup
     */
    const input = {
      token: VALID_TOKEN,
      password: VALID_USER_PASSWORD,
      confirmPassword: VALID_USER_PASSWORD,
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockResolvedValue(VALID_USER_PUBLIC_DATA);
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
    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledWith(VALID_TOKEN);
    expect(mockedUserRepository.findById).toHaveBeenCalledWith({ id: VALID_USER_DATA.id });
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledWith({ password: input.password });
    expect(mockedUserRepository.update).toHaveBeenCalledWith({
      ...VALID_USER_DATA,
      password: VALID_USER_PASSWORD_HASH,
    });
  });

  test('Should return BadRequestError when password does not match confirmPassword', async () => {
    /**
     * @Setup
     */
    const input = {
      token: VALID_TOKEN,
      password: VALID_USER_PASSWORD,
      confirmPassword: 'any',
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockClear();
    jest.spyOn(mockedUserRepository, 'findById').mockClear();
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.updatePassword(input)).rejects.toBeInstanceOf(BadRequestError);
    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.findById).toHaveBeenCalledTimes(0);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.update).toHaveBeenCalledTimes(0);
  });

  test('Should return NotFountError when not finding currentUser by id', async () => {
    /**
     * @Setup
     */
    const input = {
      token: VALID_TOKEN,
      password: VALID_USER_PASSWORD,
      confirmPassword: VALID_USER_PASSWORD,
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockResolvedValue({
      ...VALID_USER_PUBLIC_DATA,
      email: 'email@email.com',
    });
    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockClear();
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.updatePassword(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledWith(VALID_TOKEN);
    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(VALID_USER_DATA);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.update).toHaveBeenCalledTimes(0);
  });

  test('Should return error when currentUser is different from payload email', async () => {
    /**
     * @Setup
     */
    const input = {
      token: VALID_TOKEN,
      password: VALID_USER_PASSWORD,
      confirmPassword: VALID_USER_PASSWORD,
    };

    jest.spyOn(mockedTokenGenerator, 'getPayloadTokenResetPass').mockResolvedValue({
      ...VALID_USER_PUBLIC_DATA,
      email: 'email@email.com',
    });
    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedPasswordEncryptor, 'encryptor').mockResolvedValue(VALID_USER_PASSWORD_HASH);
    jest.spyOn(mockedUserRepository, 'update').mockClear();

    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.updatePassword(input)).rejects.toBeInstanceOf(BadRequestError);
    expect(mockedTokenGenerator.getPayloadTokenResetPass).toHaveBeenCalledWith(VALID_TOKEN);
    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(VALID_USER_DATA);
    expect(mockedPasswordEncryptor.encryptor).toHaveBeenCalledTimes(0);
    expect(mockedUserRepository.update).toHaveBeenCalledTimes(0);
  });
});
