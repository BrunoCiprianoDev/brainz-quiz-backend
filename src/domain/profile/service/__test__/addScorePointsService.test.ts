import { NotFoundError } from '../../../util/errors/appErrors';
import { IProfileRepository } from '../../repositories/profileRepository';
import { AddScorePointsService, IAddScorePointsService } from '../addScorePointsService';

describe('Add score points profile tests', () => {
  let mockedProfileRepository: Partial<IProfileRepository>;
  let addScorePointsService: IAddScorePointsService;

  beforeAll(() => {
    mockedProfileRepository = {
      addScorePoins: jest.fn(),
      findById: jest.fn(),
    };

    addScorePointsService = new AddScorePointsService(mockedProfileRepository as IProfileRepository);
  });

  test('Should return Profile with score with 200 more points', async () => {
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';
    const mockedFindByIdExp = { id, userId: 'be795b88-2dca-4797-aa8d-cf420cdfd3fb', name: 'John', score: 0 };

    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(mockedFindByIdExp);

    const sut = await addScorePointsService.execute({ id, points: 200 });

    expect(sut).toMatchObject({
      ...mockedFindByIdExp,
    });
    expect(mockedProfileRepository.findById).toHaveBeenCalledWith(id);
    expect(mockedProfileRepository.addScorePoins).toHaveBeenCalledWith({ id: mockedFindByIdExp.id, score: 200 });
  });

  test('Should return Profile with score with 200 less points', async () => {
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';
    const mockedFindByIdExp = { id, userId: 'be795b88-2dca-4797-aa8d-cf420cdfd3fb', name: 'John', score: 0 };

    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(mockedFindByIdExp);

    const sut = await addScorePointsService.execute({ id, points: -200 });

    expect(sut).toMatchObject({
      ...mockedFindByIdExp,
    });
    expect(mockedProfileRepository.findById).toHaveBeenCalledWith(id);
    expect(mockedProfileRepository.addScorePoins).toHaveBeenCalledWith({ id: mockedFindByIdExp.id, score: -200 });
  });

  test('Should return NotFoundError when not found Profile by id', async () => {
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(null);

    await (expect(addScorePointsService.execute({ id, points: 100 })).rejects.toBeInstanceOf(NotFoundError));
    expect(mockedProfileRepository.findById).toHaveBeenCalledWith(id);
    expect(mockedProfileRepository.addScorePoins).toHaveBeenCalledTimes(0);
  });

});
