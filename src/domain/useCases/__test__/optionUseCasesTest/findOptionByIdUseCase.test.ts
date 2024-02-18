import { IOptionRepository } from '@src/domain/interfaces/repositories/optionRepository';
import { IOptionUseCases, OptionUseCases } from '../../optionUseCases';
import { IQuestionUseCases } from '../../questionUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_OPTION_UUID } from './testConstantsOption';
import { NotFoundError } from '@src/domain/util/errors';

describe('FindOptionById test', () => {
  let optionUseCases: IOptionUseCases;
  let mockedOptionRepository: Partial<IOptionRepository>;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedOptionRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    optionUseCases = new OptionUseCases(
      mockedOptionRepository as IOptionRepository,
      mockedQuestionUseCases as IQuestionUseCases,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return option by id successfully', async () => {
    /**
     * @Setup
     */
    const expected = {
      id: VALID_OPTION_UUID,
      questionId: VALID_OPTION_UUID,
      description: 'UpdatedDescription',
      isCorrect: true,
    };

    jest.spyOn(mockedOptionRepository, 'findById').mockResolvedValue(expected);

    /**
     * @Execution
     */
    const sut = await optionUseCases.findById({ id: VALID_OPTION_UUID });

    /**
     * @Assertion
     */
    expect(sut).toMatchObject(expected);
  });

  test('Should return AppError when not found option by id', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionRepository, 'findById').mockResolvedValue(null);

    /**
     * @Execution
     * @Assertion
     */
    await expect(optionUseCases.findById({ id: VALID_OPTION_UUID })).rejects.toBeInstanceOf(NotFoundError);
  });
});
