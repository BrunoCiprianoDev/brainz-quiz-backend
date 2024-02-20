import { IOptionRepository } from '@src/domain/interfaces/repositories/optionRepository';
import { IOptionUseCases, OptionUseCases } from '../../optionUseCases';
import { IQuestionUseCases } from '../../questionUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_OPTION_QUESTION_ID, VALID_OPTION_UUID } from './testConstantsOption';
import { InternalServerError, NotFoundError } from '@src/domain/util/errors';

describe('FindAllByQuestionId test', () => {
  let optionUseCases: IOptionUseCases;
  let mockedOptionRepository: Partial<IOptionRepository>;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedOptionRepository = {
      update: jest.fn(),
      findById: jest.fn(),
      findAllByQuestionId: jest.fn(),
    };

    optionUseCases = new OptionUseCases(
      mockedOptionRepository as IOptionRepository,
      mockedQuestionUseCases as IQuestionUseCases,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return all options by questionId successfully', async () => {
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

    jest
      .spyOn(mockedOptionRepository, 'findAllByQuestionId')
      .mockResolvedValue([optionCretedExpected01, optionCretedExpected02]);

    /**
     * @Execution
     */
    const sut = await optionUseCases.findAllByQuestionId({ questionId: VALID_OPTION_UUID });

    /**
     * @Assertion
     */
    expect(sut).toMatchObject([optionCretedExpected01, optionCretedExpected02]);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionRepository, 'findAllByQuestionId').mockRejectedValue(new Error('any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(optionUseCases.findAllByQuestionId({ questionId: VALID_OPTION_UUID })).rejects.toBeInstanceOf(
      InternalServerError,
    );
  });
});
