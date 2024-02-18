import { IOptionRepository } from '@src/domain/interfaces/repositories/optionRepository';
import { IOptionUseCases, OptionUseCases } from '../../optionUseCases';
import { IQuestionUseCases } from '../../questionUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_OPTION_UUID } from './testConstantsOption';
import { NotFoundError } from '@src/domain/util/errors';

describe('UpdateOptionUseCase test', () => {
  let optionUseCases: IOptionUseCases;
  let mockedOptionRepository: Partial<IOptionRepository>;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedOptionRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    mockedQuestionUseCases = {
      findById: jest.fn(),
    };

    mockedUuidGenerator = {
      generate: jest.fn(),
    };

    optionUseCases = new OptionUseCases(
      mockedOptionRepository as IOptionRepository,
      mockedQuestionUseCases as IQuestionUseCases,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return question updated successfully', async () => {
    /**
     * @Setup
     */
    const currentOption = {
      id: VALID_OPTION_UUID,
      questionId: VALID_OPTION_UUID,
      description: 'CurrentDescription',
      isCorrect: false,
    };

    const input = {
      id: VALID_OPTION_UUID,
      questionId: VALID_OPTION_UUID,
      description: 'UpdatedDescription',
      isCorrect: true,
    };

    jest.spyOn(mockedQuestionUseCases, 'findById').mockClear();
    jest.spyOn(mockedOptionRepository, 'findById').mockResolvedValue(currentOption);
    jest.spyOn(mockedOptionRepository, 'update').mockClear();

    /**
     * @Execution
     */
    const sut = await optionUseCases.update(input);

    /**
     * @Assertion
     */
    expect(sut).toMatchObject(input);
    expect(mockedOptionRepository.update).toHaveBeenCalledWith(input);
  });

  test('Should return AppError when not found option by id', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_OPTION_UUID,
      questionId: VALID_OPTION_UUID,
      description: 'UpdatedDescription',
      isCorrect: true,
    };

    jest.spyOn(mockedQuestionUseCases, 'findById').mockClear();
    jest.spyOn(mockedOptionRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(mockedOptionRepository, 'update').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(optionUseCases.update(input)).rejects.toBeInstanceOf(NotFoundError);
  });
});
