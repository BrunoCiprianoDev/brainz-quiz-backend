import { IFindUserByIdService } from '../../../user/services/findUserByIdService';
import { IuuidGenerator } from '../../../util/adapters/uuidGenerator';
import { BadRequestError } from '../../../util/errors/appErrors';
import { IProfileRepository } from '../../repositories/profileRepository';
import { CreateProfileService, ICreateProfileService } from '../createProfileService';

describe('Create profile tests', () => {
  let mockedProfileRepository: Partial<IProfileRepository>;
  let mockedFindUserByIdService: jest.Mocked<IFindUserByIdService>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let createProfileService: ICreateProfileService;

  beforeAll(() => {
    mockedProfileRepository = {
      create: jest.fn(),
      userAlreadyHaveProfile: jest.fn(),
    };

    mockedFindUserByIdService = {
      execute: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    createProfileService = new CreateProfileService(
      mockedProfileRepository as IProfileRepository,
      mockedFindUserByIdService as IFindUserByIdService,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return NotFoundError when not found user', async () => {
    const userId = 'be795b88-2dca-4797-aa8d-cf420cdfd3fb';
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    jest.spyOn(mockedFindUserByIdService, 'execute').mockClear();
    jest.spyOn(mockedProfileRepository, 'userAlreadyHaveProfile').mockResolvedValue(false);
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(id);

    const sut = await createProfileService.execute({ userId, name: 'John' });

    expect(sut).toMatchObject({ id, userId, name: 'John', score: 0 });
    expect(mockedFindUserByIdService.execute).toHaveBeenCalledWith(userId);
    expect(mockedProfileRepository.userAlreadyHaveProfile).toHaveBeenCalledWith(userId);
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockedProfileRepository.create).toHaveBeenCalledWith({ id, userId, name: 'John', score: 0 });
  });

  test('Should return BadRequestError when user already have profile', async () => {
    const userId = 'be795b88-2dca-4797-aa8d-cf420cdfd3fb';

    jest.spyOn(mockedFindUserByIdService, 'execute').mockClear();
    jest.spyOn(mockedProfileRepository, 'userAlreadyHaveProfile').mockResolvedValue(true);
    jest.spyOn(mockedUuidGenerator, 'generate').mockClear();

    await expect(createProfileService.execute({ name: 'John', userId })).rejects.toBeInstanceOf(BadRequestError);
    expect(mockedFindUserByIdService.execute).toHaveBeenCalledWith(userId);
    expect(mockedProfileRepository.userAlreadyHaveProfile).toHaveBeenCalledWith(userId);
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(mockedProfileRepository.create).toHaveBeenCalledTimes(0);
  });
});
