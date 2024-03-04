import { IuuidGenerator } from '../../../util/adapters/uuidGenerator';
import { BadRequestError } from '../../../util/errors/appErrors';
import { ILevelRepository } from '../../repositories/levelRepository';
import { CreateLevelService, ICreateLevelService } from '../createLevelService';

describe('Create level service tests', () => {
  let uuidGenerator: Partial<IuuidGenerator>;
  let levelRepository: Partial<ILevelRepository>;
  let createLevelService: ICreateLevelService;

  beforeAll(async () => {
    levelRepository = {
      create: jest.fn(),
    };

    uuidGenerator = {
      generate: jest.fn(),
    };

    createLevelService = new CreateLevelService(
      uuidGenerator as IuuidGenerator,
      levelRepository as ILevelRepository,
    );
  });

  test('Should return level created successfully', async () => {
    const input = { description: 'LEVEL_STRING', points: 200 };

    jest.spyOn(uuidGenerator, 'generate').mockResolvedValue('9111c6f9-758f-4e95-ba52-91fed7e46f38');
    jest.spyOn(levelRepository, 'create').mockClear();

    const sut = await createLevelService.execute(input);

    expect(sut).toMatchObject({
      id: '9111c6f9-758f-4e95-ba52-91fed7e46f38',
      ...input,
      isDeleted: false,
    });
    expect(levelRepository.create).toHaveBeenCalledWith({
      id: '9111c6f9-758f-4e95-ba52-91fed7e46f38',
      ...input,
      isDeleted: false,
    });
  });

  test('Should return BadRequestError when description is invalid', async () => {
    const input = { description: '', points: 200 };

    jest.spyOn(uuidGenerator, 'generate').mockClear();
    jest.spyOn(levelRepository, 'create').mockClear();

    await expect(createLevelService.execute(input)).rejects.toBeInstanceOf(BadRequestError);
    expect(uuidGenerator.generate).toHaveBeenCalledTimes(0);
    expect(levelRepository.create).toHaveBeenCalledTimes(0);
  });
});
