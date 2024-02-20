import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IOptionUseCases } from '@src/domain/useCases/optionUseCases';
import { IOptionControllers, OptionControllers } from '../../optionControllers';
import { IOptionCreateData } from '@src/domain/util/models/optionsModels';

describe('CreateOptionController tests', () => {
  let mockedOptionUseCases: Partial<IOptionUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let optionControllers: IOptionControllers;
  beforeAll(() => {
    mockedOptionUseCases = {
      create: jest.fn(),
    };

    mockedHttpContext = {
      send: jest.fn(),
      getRequest: jest.fn(),
    };

    optionControllers = new OptionControllers(mockedOptionUseCases as IOptionUseCases);
  });

  test('Shoud return option created successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
      optionsWithoutId: [
        {
          description: 'Description01',
          isCorrect: true,
        },
        {
          description: 'Description02',
          isCorrect: false,
        },
      ],
    } as IOptionCreateData;

    jest.spyOn(mockedOptionUseCases, 'create').mockResolvedValue([
      {
        id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
        questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
        description: 'Description01',
        isCorrect: true,
      },
      {
        id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
        questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
        description: 'Description02',
        isCorrect: false,
      },
    ]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: input,
    });

    /**
     * @Execution
     */
    await optionControllers.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: [
        {
          id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
          questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
          description: 'Description01',
          isCorrect: true,
        },
        {
          id: 'aed78073-bb8a-4258-aa73-d5e2126fb197',
          questionId: 'c2c0837b-7106-4e0b-bf3f-5419f525ae1f',
          description: 'Description02',
          isCorrect: false,
        },
      ],
    });
    expect(mockedOptionUseCases.create).toHaveBeenCalledWith(input);
  });

  test('Shoud handle attributes for empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'create').mockClear();
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedOptionUseCases.create).toHaveBeenCalledWith({
      questionId: '',
      optionsWithoutId: [],
    });
  });

  test('Shoud handle error when ocurrs', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedOptionUseCases, 'create').mockRejectedValue(new Error('Any'));
    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await optionControllers.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedOptionUseCases.create).toHaveBeenCalledWith({
      questionId: '',
      optionsWithoutId: [],
    });
  });
});
