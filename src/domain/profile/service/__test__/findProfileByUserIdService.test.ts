import { NotFoundError } from '../../../util/errors/appErrors';
import { IProfileRepository } from '../../repositories/profileRepository';
import { FindProfileByUserIdService, IFindProfileByUserIdService } from '../findProfileByUserIdService';

describe('Find by user id', () => {
  let mockedProfileRepository: Partial<IProfileRepository>;
  let findProfileByUserIdService: IFindProfileByUserIdService;

  beforeAll(() => {
    mockedProfileRepository = {
      findByUserId: jest.fn(),
    };

    findProfileByUserIdService = new FindProfileByUserIdService(mockedProfileRepository as IProfileRepository);
  });

  test('Should return Profile when found by userId', async () => {
    const mockedFindByIdExp = {
      id: '70167299-c315-4e29-b5e4-f7990fc98d8e',
      userId: 'be795b88-2dca-4797-aa8d-cf420cdfd3fb',
      name: 'John',
      score: 0,
    };

    jest.spyOn(mockedProfileRepository, 'findByUserId').mockResolvedValue(mockedFindByIdExp);

    const sut = await findProfileByUserIdService.execute(mockedFindByIdExp.userId);

    expect(sut).toMatchObject({
      ...mockedFindByIdExp,
    });
    expect(mockedProfileRepository.findByUserId).toHaveBeenCalledWith(mockedFindByIdExp.userId);
  });

  test('Should return NotFoundError when not found Profile by userId', async () => {
    const userId = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    jest.spyOn(mockedProfileRepository, 'findByUserId').mockResolvedValue(null);

    await expect(findProfileByUserIdService.execute(userId)).rejects.toBeInstanceOf(NotFoundError);

    expect(mockedProfileRepository.findByUserId).toHaveBeenCalledWith(userId);
  });
});
