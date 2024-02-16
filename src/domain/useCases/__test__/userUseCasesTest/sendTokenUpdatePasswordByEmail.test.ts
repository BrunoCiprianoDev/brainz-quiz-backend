import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, UserUseCases } from '../../userUseCases';
import { VALID_TOKEN, VALID_USER_DATA, VALID_USER_PUBLIC_DATA } from './testConstantsUserUseCases';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';
import { IEmailSender } from '@src/domain/interfaces/adapters/emailSender';

describe('SendTokenUpdatePasswordByEmail tests', () => {

  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let mockedEmailSender: Partial<IEmailSender>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    mockedTokenGenerator = {
      generateTokenResetPass: jest.fn(),
    };

    mockedEmailSender = {
      sendTokenForgotPass: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
      mockedEmailSender as IEmailSender,
    );
  });

  test('Should send token update pass by email', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_DATA.email,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedTokenGenerator, 'generateTokenResetPass').mockResolvedValue({ token: VALID_TOKEN });
    jest.spyOn(mockedEmailSender, 'sendTokenForgotPass').mockClear();

    /**
     * @Execution
     */
    await userUserUseCases.sendTokenUpdatePasswordByEmail(input);

    /**
     * @Assert
     */
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedTokenGenerator.generateTokenResetPass).toHaveBeenCalledWith(VALID_USER_PUBLIC_DATA);
    expect(mockedEmailSender.sendTokenForgotPass).toHaveBeenCalledWith({
      email: input.email,
      token: VALID_TOKEN,
    });
  });

  test('Should return BadRequestError when not found user by email', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_DATA.email,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(mockedTokenGenerator, 'generateTokenResetPass').mockClear();
    jest.spyOn(mockedEmailSender, 'sendTokenForgotPass').mockClear();


    /**
     * @Execution
     * @Assert
     */
    await expect(userUserUseCases.sendTokenUpdatePasswordByEmail(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith({ email: input.email });
    expect(mockedEmailSender.sendTokenForgotPass).toHaveBeenCalledTimes(0);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_DATA.email,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(VALID_USER_DATA);
    jest.spyOn(mockedTokenGenerator, 'generateTokenResetPass').mockResolvedValue({ token: VALID_TOKEN });
    jest.spyOn(mockedEmailSender, 'sendTokenForgotPass').mockRejectedValue(new Error('any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.sendTokenUpdatePasswordByEmail(input)).rejects.toBeInstanceOf(InternalServerError);
  });

});
