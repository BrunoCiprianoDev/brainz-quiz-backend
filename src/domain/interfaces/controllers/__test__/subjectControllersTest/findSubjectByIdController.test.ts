import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ISubjectUseCases } from '@src/domain/useCases/subjectUseCases';
import { ISubjectControllers, SubjectController } from '../../subjectControllers';
import {
  VALID_SUBJECT_DATA,
  VALID_SUBJECT_UUID,
} from '@src/domain/useCases/__test__/subjectUseCasesTest/testConstantsSubject';

describe('Find subject by ID controller tests', () => {
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let subjectController: ISubjectControllers;

  beforeAll(() => {
    mockedSubjectUseCases = {
      findById: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    subjectController = new SubjectController(mockedSubjectUseCases as ISubjectUseCases);
  });

  test('Should return body when find a subject successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'findById').mockResolvedValue(VALID_SUBJECT_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
      params: { id: VALID_SUBJECT_UUID },
    });

    /**
     * @Execution
     */
    await subjectController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: VALID_SUBJECT_DATA,
    });
    expect(mockedSubjectUseCases.findById).toHaveBeenCalledWith({ id: VALID_SUBJECT_UUID });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'findById').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await subjectController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedSubjectUseCases.findById).toHaveBeenCalledWith({
      id: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'findById').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: VALID_SUBJECT_UUID,
    });

    /**
     * @Execution
     */
    await subjectController.findById(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
