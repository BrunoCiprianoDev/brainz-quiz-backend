import { IOptionRepository } from '@src/domain/interfaces/repositories/optionRepository';
import { IOptionUseCases, OptionUseCases } from '../../optionUseCases';
import { IQuestionUseCases } from '../../questionUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_OPTIONS_EXPECT_SUCESSFULLY, VALID_OPTION_QUESTION_ID, VALID_OPTION_UUID } from './testConstantsOption';
import { BadRequestError } from '@src/domain/util/errors';

describe('CreateOptionUseCase test', () => {
  let optionUseCases: IOptionUseCases;
  let mockedOptionRepository: Partial<IOptionRepository>;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedOptionRepository = {
      create: jest.fn(),
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

  test('Should return list options created successfully', async () => {
    /**
     * @Setup
     */
    const genericOptionId = VALID_OPTION_UUID;
    const questionId = VALID_OPTION_QUESTION_ID;

    const optionToCreate01 = {
      description: 'option01',
      isCorrect: true,
    };

    const optionToCreate02 = {
      description: 'option02',
      isCorrect: false,
    };

    const optionCretedExpected01 = {
      ...optionToCreate01,
      id: genericOptionId,
      questionId,
    };

    const optionCretedExpected02 = {
      ...optionToCreate02,
      id: genericOptionId,
      questionId,
    };

    jest.spyOn(mockedOptionRepository, 'create').mockClear();
    jest.spyOn(mockedQuestionUseCases, 'findById').mockClear();
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(genericOptionId);

    /**
     * @Execution
     */
    const sut = await optionUseCases.create({
      questionId,
      optionsWithoutId: [optionToCreate01, optionCretedExpected02],
    });

    /**
     * @Assertion
     */
    expect(sut).toMatchObject([optionCretedExpected01, optionCretedExpected02]);
    expect(mockedOptionRepository.create).toHaveBeenCalledWith([optionCretedExpected01, optionCretedExpected02]);
  });

  test('Should return AppError if invalid params', async () => {
    /**
     * @Setup
     */
    const genericOptionId = VALID_OPTION_UUID;
    const questionId = VALID_OPTION_QUESTION_ID;

    const optionToCreate01 = {
      description: '',
      isCorrect: true,
    };

    const optionToCreate02 = {
      description: 'option02',
      isCorrect: false,
    };

    const optionCretedExpected01 = {
      ...optionToCreate01,
      id: genericOptionId,
      questionId,
    };

    const optionCretedExpected02 = {
      ...optionToCreate02,
      id: genericOptionId,
      questionId,
    };

    jest.spyOn(mockedOptionRepository, 'create').mockClear();
    jest.spyOn(mockedQuestionUseCases, 'findById').mockClear();
    jest.spyOn(mockedUuidGenerator, 'generate').mockResolvedValue(genericOptionId);

    /**
     * @Execution
     * @Assertion
     */
    await expect(
      optionUseCases.create({
        questionId,
        optionsWithoutId: [optionToCreate01, optionCretedExpected02],
      }),
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(mockedOptionRepository.create).toHaveBeenCalledTimes(0);
  });
});
