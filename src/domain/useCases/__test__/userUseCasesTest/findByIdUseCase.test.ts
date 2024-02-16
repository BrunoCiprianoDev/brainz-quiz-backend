import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, UserUseCases } from '../../userUseCases';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';
import { VALID_USER_DATA, VALID_USER_PUBLIC_DATA, VALID_USER_UUID } from './testConstantsUserUseCases';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';
import { IEmailSender } from '@src/domain/interfaces/adapters/emailSender';

describe('FindByIdUseCase tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let mockedEmailSender: Partial<IEmailSender>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      findById: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
      mockedEmailSender as IEmailSender,
    );
  });

  test('Should return User by Id successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(VALID_USER_DATA);

    /**
     * @Execution
     */
    const sut = await userUserUseCases.findById(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_USER_PUBLIC_DATA);
    expect(sut).not.toHaveProperty('password');
    expect(mockedUserRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundError when not found user by id', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);

    /**
     * @Assert
     * @Execution
     */
    await expect(userUserUseCases.findById(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedUserRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_USER_UUID,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.findById(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
