import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { ILevelUseCases, LevelUseCases } from '../../levelUseCases';
import { ILevelRepository } from '@src/domain/interfaces/repositories/levelRepository';
import { VALID_LEVEL_DATA } from './testConstantsLevel';
import { BadRequestError, InternalServerError } from '@src/domain/util/errors';

describe('FindAllLevelsUseCase tests', () => {
  let mockedLevelRepository: Partial<ILevelRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let levelUseCases: ILevelUseCases;
  beforeAll(() => {
    mockedLevelRepository = {
      findAll: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    levelUseCases = new LevelUseCases(mockedLevelRepository as ILevelRepository, mockedUuidGenerator as IuuidGenerator);
  });

  test('Should return list Levels successfully', async () => {
    /**
     * @Setup
     */

    const input = {
      query: 'any',
      page: 1,
      size: 2,
      isActive: true,
    };

    const mockedFindAllReturn = [VALID_LEVEL_DATA, VALID_LEVEL_DATA];

    jest.spyOn(mockedLevelRepository, 'findAll').mockResolvedValue(mockedFindAllReturn);

    /**
     * @Execution
     */
    const sut = await levelUseCases.findAll(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(mockedFindAllReturn);
    expect(mockedLevelRepository.findAll).toHaveBeenCalledWith(input);
  });

  test('Must return BadRequestError when the parameters (size, page) are not valid', async () => {
    /**
     * @Setup
     */
    const input = {
      query: 'any',
      page: -1,
      size: 200,
      isActive: true,
    };

    jest.spyOn(mockedLevelRepository, 'findAll').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(levelUseCases.findAll(input)).rejects.toBeInstanceOf(BadRequestError);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      query: 'any',
      page: 1,
      size: 2,
      isActive: true,
    };

    jest.spyOn(mockedLevelRepository, 'findAll').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(levelUseCases.findAll(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
