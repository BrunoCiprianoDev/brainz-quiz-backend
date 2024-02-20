import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ISubjectUseCases } from '@src/domain/useCases/subjectUseCases';
import { ISubjectControllers, SubjectController } from '../../subjectControllers';
import { VALID_SUBJECT_DATA } from '@src/domain/useCases/__test__/subjectUseCasesTest/testConstantsSubject';

describe('FindAll Subjects controller tests', () => {
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let subjectController: ISubjectControllers;

  beforeAll(() => {
    mockedSubjectUseCases = {
      findAll: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    subjectController = new SubjectController(mockedSubjectUseCases as ISubjectUseCases);
  });

  test('Should return body when findAll levels successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'findAll').mockResolvedValue([VALID_SUBJECT_DATA]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
      query: {
        page: 1,
        size: 10,
        query: 'any',
        isActive: true,
      },
    });

    /**
     * @Execution
     */
    await subjectController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: [VALID_SUBJECT_DATA],
    });
    expect(mockedSubjectUseCases.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      query: 'any',
      isActive: true,
    });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'findAll').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await subjectController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedSubjectUseCases.findAll).toHaveBeenCalledWith({
      page: 0,
      size: 0,
      query: '',
      isActive: true,
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'findAll').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        page: 1,
        size: 10,
        query: 'any',
        isActive: true,
      },
    });

    /**
     * @Execution
     */
    await subjectController.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
