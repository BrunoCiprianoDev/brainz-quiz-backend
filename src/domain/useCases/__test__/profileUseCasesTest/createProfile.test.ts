import { IProfileRepository } from '@src/domain/interfaces/repositories/profileRepository';
import { IProfileUseCases, ProfileUseCases } from '../../profileUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_PROFILE_CREATE_DATA, VALID_PROFILE_DATA, VALID_PROFILE_UUID } from './testConstantsProfile';
import { IUserUseCases } from '../../userUseCases';
import { NotFoundError } from '@src/domain/util/errors';

describe('CreateProfile tests', () => {
  let profileUseCases: IProfileUseCases;
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedProfileRepository: Partial<IProfileRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedProfileRepository = {
      create: jest.fn(),
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

  test('Should create Profile successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileRepository, 'create').mockClear();
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(VALID_PROFILE_UUID);
    jest.spyOn(mockedUserUseCases, 'findById').mockClear();

    /**
     * @Execution
     */
    const sut = await profileUseCases.create(VALID_PROFILE_CREATE_DATA);

    expect(sut).toMatchObject({
      ...VALID_PROFILE_CREATE_DATA,
      id: VALID_PROFILE_UUID,
    });
    expect(mockedUserUseCases.findById).toHaveBeenCalledWith({ id: VALID_PROFILE_CREATE_DATA.userId });
    expect(mockedProfileRepository.create).toHaveBeenCalledWith({
      ...VALID_PROFILE_CREATE_DATA,
      id: VALID_PROFILE_UUID,
    });
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(1);
  });

  test('Should return AppError when a error occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedUserUseCases, 'findById').mockRejectedValue(new NotFoundError('Any'));

    /**
     * @Execution
     * @Assert
     */
    await expect(profileUseCases.create(VALID_PROFILE_CREATE_DATA)).rejects.toBeInstanceOf(NotFoundError);
  });
});
