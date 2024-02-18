import { IProfileRepository } from '@src/domain/interfaces/repositories/profileRepository';
import { IProfileUseCases, ProfileUseCases } from '../../profileUseCases';
import { IUserUseCases } from '../../userUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_PROFILE_DATA, VALID_PROFILE_UUID } from './testConstantsProfile';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';

describe('FindProfilesById tests', () => {
  let profileUseCases: IProfileUseCases;
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedProfileRepository: Partial<IProfileRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedProfileRepository = {
      findById: jest.fn(),
    };

    profileUseCases = new ProfileUseCases(
      mockedUserUseCases as IUserUseCases,
      mockedProfileRepository as IProfileRepository,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return Profile by Id successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_PROFILE_UUID,
    };

    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(VALID_PROFILE_DATA);

    /**
     * @Execution
     */
    const sut = await profileUseCases.findById(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_PROFILE_DATA);
    expect(mockedProfileRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundError when not found Profile by id', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_PROFILE_UUID,
    };

    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(null);

    /**
     * @Assert
     * @Execution
     */
    await expect(profileUseCases.findById(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedProfileRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_PROFILE_UUID,
    };

    jest.spyOn(mockedProfileRepository, 'findById').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(profileUseCases.findById(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
