import { NotFoundError } from '../../../util/errors/appErrors';
import { ILevelRepository } from '../../repositories/levelRepository';
import { FindLevelByIdService, IFindLevelByIdService } from '../findLevelByIdService';

describe('Find level by id tests', () => {
  let levelRepository: Partial<ILevelRepository>;
  let findLevelByIdService: IFindLevelByIdService;

  beforeAll(async () => {
    levelRepository = {
      findById: jest.fn(),
    };

    findLevelByIdService = new FindLevelByIdService(levelRepository as ILevelRepository);
  });

  test('Should return level by id', async () => {
    const levelExp = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'Level',
      points: 200,
      isDeleted: false,
    };

    jest.spyOn(levelRepository, 'findById').mockResolvedValue(levelExp);

    const sut = await findLevelByIdService.execute(levelExp.id);

    expect(sut).toMatchObject(levelExp);

    expect(levelRepository.findById).toHaveBeenCalledWith(levelExp.id);
  });

  test('Should return NotFoundError when not found level by id', async () => {
    jest.spyOn(levelRepository, 'findById').mockResolvedValue(null);

    await expect(findLevelByIdService.execute('7592292e-2d30-4def-87bf-ea83c9bd5e37')).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(levelRepository.findById).toHaveBeenCalledWith('7592292e-2d30-4def-87bf-ea83c9bd5e37');
  });
});
