import { IProfileRepository } from '@src/domain/interfaces/repositories/profileRepository';
import { IProfileUseCases, ProfileUseCases } from '../../profileUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_PROFILE_CREATE_DATA, VALID_PROFILE_DATA, VALID_PROFILE_UUID } from './testConstantsProfile';
import { IUserUseCases } from '../../userUseCases';
import { NotFoundError } from '@src/domain/util/errors';

describe('UpdateProfile tests', () => {
  let profileUseCases: IProfileUseCases;
  let mockedUserUseCases: Partial<IUserUseCases>;
  let mockedProfileRepository: Partial<IProfileRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedProfileRepository = {
      update: jest.fn(),
      findById: jest.fn(),
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

  test('Should update Profile successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      ...VALID_PROFILE_DATA,
      name: 'NEWNAME',
      score: 2000,
    };

    jest.spyOn(mockedProfileRepository, 'update').mockClear();
    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(VALID_PROFILE_DATA);

    /**
     * @Execution
     */
    const sut = await profileUseCases.update(input);

    expect(sut).toMatchObject(input);
    expect(mockedProfileRepository.findById).toHaveBeenCalledWith({ id: input.id });
    expect(mockedProfileRepository.update).toHaveBeenCalledWith(input);
  });

  test('Should return AppError when a error occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(null);

    /**
     * @Execution
     * @Assert
     */
    await expect(profileUseCases.update(VALID_PROFILE_DATA)).rejects.toBeInstanceOf(NotFoundError);
  });
});
