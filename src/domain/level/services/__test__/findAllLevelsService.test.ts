import { BadRequestError } from '../../../util/errors/appErrors';
import { ILevelRepository } from '../../repositories/levelRepository';
import { FindAllLevelsService, IFindAllLevelsService } from '../findAllLevelsService';

describe('Find subject by id tests', () => {
  let levelRepository: Partial<ILevelRepository>;
  let findAllLevelService: IFindAllLevelsService;

  beforeAll(async () => {
    levelRepository = {
      findAll: jest.fn(),
    };

    findAllLevelService = new FindAllLevelsService(levelRepository as ILevelRepository);
  });

  test('Should return a list levels successfully', async () => {
    const subjectExp = [
      {
        id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
        description: 'SUBJECT',
        points: 200,
        isDeleted: false,
      },
      {
        id: '16f03f9f-e724-457d-ab80-37405a2d5055',
        description: 'SUBJECT',
        points: 200,
        isDeleted: false,
      },
    ];

    const input = {
      contains: 'Any',
      page: 1,
      size: 10,
      isDeleted: false,
    };

    jest.spyOn(levelRepository, 'findAll').mockResolvedValue(subjectExp);

    const sut = await findAllLevelService.execute(input);

    expect(sut).toMatchObject(subjectExp);

    expect(levelRepository.findAll).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundError when not found levels by id', async () => {
    const input = {
      contains: 'Any',
      page: 1,
      size: 21,
      isDeleted: false,
    };

    jest.spyOn(levelRepository, 'findAll').mockClear();

    await expect(findAllLevelService.execute(input)).rejects.toBeInstanceOf(BadRequestError);

    expect(levelRepository.findAll).toHaveBeenCalledTimes(0);
  });
});
