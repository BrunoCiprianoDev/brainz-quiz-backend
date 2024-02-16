import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { IUserUseCases, UserUseCases } from '../../userUseCases';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';
import { VALID_USER_DATA, VALID_USER_EMAIL, VALID_USER_PUBLIC_DATA } from './testConstantsUserUseCases';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';

describe('FindByEmailUseCase tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      findByEmail: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
    );
  });

  test('Should return User by email successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_EMAIL,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(VALID_USER_DATA);

    /**
     * @Execution
     */
    const sut = await userUserUseCases.findByEmail(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_USER_PUBLIC_DATA);
    expect(sut).not.toHaveProperty('password');
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundError when not found user by id', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_EMAIL,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValue(null);

    /**
     * @Assert
     * @Execution
     */
    await expect(userUserUseCases.findByEmail(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(input);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      email: VALID_USER_EMAIL,
    };

    jest.spyOn(mockedUserRepository, 'findByEmail').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.findByEmail(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
