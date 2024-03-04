import { BadRequestError, NotFoundError } from '../../../util/errors/appErrors';
import { ILevelRepository } from '../../repositories/levelRepository';
import { IUpdateLevelService, UpdateLevelService } from '../updateLevelService';

describe('Update level service tests', () => {
  let levelRepository: Partial<ILevelRepository>;
  let updateLevelService: IUpdateLevelService;

  beforeAll(async () => {
    levelRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    updateLevelService = new UpdateLevelService(levelRepository as ILevelRepository);
  });

  test('Should return level updated successfully', async () => {
    const input = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'LEVEL_UPDATED',
      points: 200,
      isDeleted: true,
    };

    const levelExp = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'LEVEL',
      points: 200,
      isDeleted: false,
    };

    jest.spyOn(levelRepository, 'findById').mockResolvedValue(levelExp);
    jest.spyOn(levelRepository, 'update').mockClear();

    const sut = await updateLevelService.execute(input);

    expect(sut).toMatchObject(input);
    expect(levelRepository.findById).toHaveBeenCalledWith(input.id);
    expect(levelRepository.update).toHaveBeenCalledWith(input);
  });

  test('Should return BadRequestError when description is not valid', async () => {
    const input = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: '',
      points: 200,
      isDeleted: true,
    };

    jest.spyOn(levelRepository, 'findById').mockClear();
    jest.spyOn(levelRepository, 'update').mockClear();

    await expect(updateLevelService.execute(input)).rejects.toBeInstanceOf(BadRequestError);

    expect(levelRepository.findById).toHaveBeenCalledTimes(0);
    expect(levelRepository.update).toHaveBeenCalledTimes(0);
  });

  test('Should return NotFoundError', async () => {
    const input = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'LEVEL_UPDATED',
      points: 200,
      isDeleted: true,
    };

    jest.spyOn(levelRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(levelRepository, 'update').mockClear();

    await expect(updateLevelService.execute(input)).rejects.toBeInstanceOf(NotFoundError);

    expect(levelRepository.findById).toHaveBeenCalledWith(input.id);
    expect(levelRepository.update).toHaveBeenCalledTimes(0);
  });
});
