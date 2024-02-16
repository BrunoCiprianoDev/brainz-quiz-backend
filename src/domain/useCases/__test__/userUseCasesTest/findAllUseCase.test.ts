import { IPasswordEncryptor } from '@src/domain/interfaces/adapters/passwordEncryptor';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { IUserRepository } from '@src/domain/interfaces/repositories/userRepository';
import { ERROR_MESSAGE_USER_FIND_ALL_PARAMS, IUserUseCases, UserUseCases } from '../../userUseCases';
import { BadRequestError, InternalServerError } from '@src/domain/util/errors';
import { VALID_USER_PUBLIC_DATA } from './testConstantsUserUseCases';
import { ITokenGenerator } from '@src/domain/interfaces/adapters/tokenGenerator';

describe('FindAllUseCase tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let mockedPasswordEncryptor: Partial<IPasswordEncryptor>;
  let mockedTokenGenerator: Partial<ITokenGenerator>;
  let userUserUseCases: IUserUseCases;

  beforeAll(() => {
    mockedUserRepository = {
      findAll: jest.fn(),
    };

    userUserUseCases = new UserUseCases(
      mockedUserRepository as IUserRepository,
      mockedUuidGenerator as IuuidGenerator,
      mockedPasswordEncryptor as IPasswordEncryptor,
      mockedTokenGenerator as ITokenGenerator,
    );
  });

  test('Should return User by Id successfully', async () => {
    /**
     * @Setup
     */

    const input = {
      query: 'any',
      page: 1,
      size: 2,
    };

    const mockedFindAllReturn = [VALID_USER_PUBLIC_DATA, VALID_USER_PUBLIC_DATA];

    jest.spyOn(mockedUserRepository, 'findAll').mockResolvedValue(mockedFindAllReturn);

    /**
     * @Execution
     */
    const sut = await userUserUseCases.findAll(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(mockedFindAllReturn);
    expect(mockedUserRepository.findAll).toHaveBeenCalledWith(input);
  });

  test('Must return BadRequestError when the parameters (size, page) are not valid', async () => {
    /**
     * @Setup
     */
    const input = {
      query: 'any',
      page: -1,
      size: 200,
    };

    jest.spyOn(mockedUserRepository, 'findAll').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.findAll(input)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_USER_FIND_ALL_PARAMS),
    );
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      query: 'any',
      page: 1,
      size: 2,
    };

    jest.spyOn(mockedUserRepository, 'findAll').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(userUserUseCases.findAll(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
