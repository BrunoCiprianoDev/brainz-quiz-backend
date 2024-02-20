import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { NotFoundError } from '@src/domain/util/errors';
import { ILevelUseCases, LevelUseCases } from '../../levelUseCases';
import { ILevelRepository } from '@src/domain/interfaces/repositories/levelRepository';
import { VALID_LEVEL_CREATE_DATA, VALID_LEVEL_UUID } from './testConstantsLevel';

describe('CreateLevelUseCase', () => {
  let mockedLevelRepository: Partial<ILevelRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let levelUseCases: ILevelUseCases;
  beforeAll(() => {
    mockedLevelRepository = {
      create: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    levelUseCases = new LevelUseCases(mockedLevelRepository as ILevelRepository, mockedUuidGenerator as IuuidGenerator);
  });

  test('Should create Level successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelRepository, 'create').mockClear();
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(VALID_LEVEL_UUID);

    /**
     * @Execution
     */
    const sut = await levelUseCases.create(VALID_LEVEL_CREATE_DATA);

    /**
     * @Assert
     */
    expect(sut).toMatchObject({
      ...VALID_LEVEL_CREATE_DATA,
      id: VALID_LEVEL_UUID,
      isActive: true,
    });
    expect(mockedLevelRepository.create).toHaveBeenCalledWith({
      ...VALID_LEVEL_CREATE_DATA,
      id: VALID_LEVEL_UUID,
      isActive: true,
    });
    expect(mockedUuidGenerator.generate).toHaveBeenCalledTimes(1);
  });

  test('Should return AppError when a error occur', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedLevelRepository, 'create').mockRejectedValue(new NotFoundError('Any'));

    /**
     * @Execution
     * @Assert
     */
    await expect(levelUseCases.create(VALID_LEVEL_CREATE_DATA)).rejects.toBeInstanceOf(NotFoundError);
  });
});
