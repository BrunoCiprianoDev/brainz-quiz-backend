import { IProfileRepository } from '@src/domain/interfaces/repositories/profileRepository';
import { IProfileUseCases, ProfileUseCases } from '../../profileUseCases';
import { IUserUseCases } from '../../userUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_PROFILE_DATA, VALID_PROFILE_USERID, VALID_PROFILE_UUID } from './testConstantsProfile';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';

describe('FindProfilesByUserId tests', () => {
  let profileUseCases: IProfileUseCases;
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedProfileRepository: Partial<IProfileRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedProfileRepository = {
      findProfileByUserId: jest.fn(),
    };

    profileUseCases = new ProfileUseCases(
      mockedUserUseCases as IUserUseCases,
      mockedProfileRepository as IProfileRepository,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return Profile by UserId successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileRepository, 'findProfileByUserId').mockResolvedValue(VALID_PROFILE_DATA);

    /**
     * @Execution
     */
    const sut = await profileUseCases.findProfileByUserId({ userId: VALID_PROFILE_USERID });

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_PROFILE_DATA);
    expect(mockedProfileRepository.findProfileByUserId).toHaveBeenCalledWith({ userId: VALID_PROFILE_USERID });
  });

  test('Should return NotFoundError when not found Profile by UserId', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileRepository, 'findProfileByUserId').mockResolvedValue(null);

    /**
     * @Assert
     * @Execution
     */
    await expect(profileUseCases.findProfileByUserId({ userId: VALID_PROFILE_USERID })).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(mockedProfileRepository.findProfileByUserId).toHaveBeenCalledWith({ userId: VALID_PROFILE_USERID });
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileRepository, 'findProfileByUserId').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(profileUseCases.findProfileByUserId({ userId: VALID_PROFILE_USERID })).rejects.toBeInstanceOf(
      InternalServerError,
    );
  });
});
