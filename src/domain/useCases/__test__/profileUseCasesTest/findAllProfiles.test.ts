import { IProfileRepository } from '@src/domain/interfaces/repositories/profileRepository';
import { ERROR_MESSAGE_PROFILE_FIND_ALL_PARAMS, IProfileUseCases, ProfileUseCases } from '../../profileUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_PROFILE_CREATE_DATA, VALID_PROFILE_DATA, VALID_PROFILE_UUID } from './testConstantsProfile';
import { IUserUseCases } from '../../userUseCases';
import { BadRequestError, InternalServerError, NotFoundError } from '@src/domain/util/errors';

describe('FindAllProfiles tests', () => {
  let profileUseCases: IProfileUseCases;
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedProfileRepository: Partial<IProfileRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedProfileRepository = {
      findAll: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    mockedUserUseCases = {
      findById: jest.fn(),
    };

    profileUseCases = new ProfileUseCases(
      mockedUserUseCases as IUserUseCases,
      mockedProfileRepository as IProfileRepository,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return list Profiles successfully', async () => {
    /**
     * @Setup
     */

    const input = {
      query: 'any',
      page: 1,
      size: 2,
    };

    const mockedFindAllReturn = [VALID_PROFILE_DATA, VALID_PROFILE_DATA];

    jest.spyOn(mockedProfileRepository, 'findAll').mockResolvedValue(mockedFindAllReturn);

    /**
     * @Execution
     */
    const sut = await profileUseCases.findAll(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(mockedFindAllReturn);
    expect(mockedProfileRepository.findAll).toHaveBeenCalledWith(input);
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

    jest.spyOn(mockedProfileRepository, 'findAll').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(profileUseCases.findAll(input)).rejects.toEqual(
      new BadRequestError(ERROR_MESSAGE_PROFILE_FIND_ALL_PARAMS),
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

    jest.spyOn(mockedProfileRepository, 'findAll').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(profileUseCases.findAll(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
