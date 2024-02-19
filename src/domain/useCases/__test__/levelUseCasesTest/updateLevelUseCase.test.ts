import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { ILevelUseCases, LevelUseCases } from '../../levelUseCases';
import { ILevelRepository } from '@src/domain/interfaces/repositories/levelRepository';
import { VALID_LEVEL_DATA } from './testConstantsLevel';
import { NotFoundError } from '@src/domain/util/errors';

describe('UpdateLevelUseCase tests', () => {
  let mockedLevelRepository: Partial<ILevelRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let levelUseCases: ILevelUseCases;
  beforeAll(() => {
    mockedLevelRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    levelUseCases = new LevelUseCases(mockedLevelRepository as ILevelRepository, mockedUuidGenerator as IuuidGenerator);
  });

  test('Should update Level successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_LEVEL_DATA.id,
      description: 'New Description',
      points: 2000,
      isActive: false,
    };

    jest.spyOn(mockedLevelRepository, 'update').mockClear();
    jest.spyOn(mockedLevelRepository, 'findById').mockResolvedValue(VALID_LEVEL_DATA);

    /**
     * @Execution
     */
    const sut = await levelUseCases.update(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(input);
    expect(mockedLevelRepository.update).toHaveBeenCalledWith(input);
    expect(mockedLevelRepository.findById).toHaveBeenCalledWith({ id: input.id });
  });

  test('Should return NotFoundError when not found level by id ', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelRepository, 'findById').mockResolvedValue(null);

    /**
     * @Execution
     * @Assert
     */
    await expect(levelUseCases.update(VALID_LEVEL_DATA)).rejects.toBeInstanceOf(NotFoundError);
  });
});
