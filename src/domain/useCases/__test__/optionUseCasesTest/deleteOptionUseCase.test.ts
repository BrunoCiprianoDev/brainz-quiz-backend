import { IOptionRepository } from '@src/domain/interfaces/repositories/optionRepository';
import { IOptionUseCases, OptionUseCases } from '../../optionUseCases';
import { IQuestionUseCases } from '../../questionUseCases';
import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { VALID_OPTION_QUESTION_ID, VALID_OPTION_UUID } from './testConstantsOption';
import { InternalServerError } from '@src/domain/util/errors';

describe('DeleteOptionUseCase test', () => {
  let optionUseCases: IOptionUseCases;
  let mockedOptionRepository: Partial<IOptionRepository>;
  let mockedQuestionUseCases: Partial<IQuestionUseCases>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;

  beforeAll(() => {
    mockedOptionRepository = {
      delete: jest.fn(),
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

  test('Should delete option sucessfully', async () => {
    const input = {
      id: VALID_OPTION_UUID,
    };

    jest.spyOn(mockedOptionRepository, 'findById').mockResolvedValue({
      id: VALID_OPTION_UUID,
      description: 'AnyDesription',
      questionId: VALID_OPTION_QUESTION_ID,
      isCorrect: false,
    });
    jest.spyOn(mockedOptionRepository, 'delete').mockClear();

    await optionUseCases.delete(input);

    expect(mockedOptionRepository.delete).toHaveBeenCalledWith(input);
    expect(mockedOptionRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    const input = {
      id: VALID_OPTION_UUID,
    };

    jest.spyOn(mockedOptionRepository, 'findById').mockClear();
    jest.spyOn(mockedOptionRepository, 'delete').mockRejectedValue(new Error('any'));

    await expect(optionUseCases.delete(input)).rejects.toBeInstanceOf(InternalServerError);
  });
});
