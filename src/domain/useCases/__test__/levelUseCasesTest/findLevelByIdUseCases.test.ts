import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { ILevelRepository } from '@src/domain/interfaces/repositories/levelRepository';
import { ILevelUseCases, LevelUseCases } from '../../levelUseCases';
import { VALID_LEVEL_DATA, VALID_LEVEL_UUID } from './testConstantsLevel';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';

describe('FindLevelsByIdUseCase tests', () => {
  let mockedLevelRepository: Partial<ILevelRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let levelUseCases: ILevelUseCases;
  beforeAll(() => {
    mockedLevelRepository = {
      findById: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    levelUseCases = new LevelUseCases(mockedLevelRepository as ILevelRepository, mockedUuidGenerator as IuuidGenerator);
  });

  test('Should return Level by Id successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_LEVEL_UUID,
    };

    jest.spyOn(mockedLevelRepository, 'findById').mockResolvedValue(VALID_LEVEL_DATA);

    /**
     * @Execution
     */
    const sut = await levelUseCases.findById(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_LEVEL_DATA);
    expect(mockedLevelRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundError when not found Level by id', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_LEVEL_UUID,
    };

    jest.spyOn(mockedLevelRepository, 'findById').mockResolvedValue(null);

    /**
     * @Assert
     * @Execution
     */
    await expect(levelUseCases.findById(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedLevelRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_LEVEL_UUID,
    };

    jest.spyOn(mockedLevelRepository, 'findById').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(levelUseCases.findById(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
