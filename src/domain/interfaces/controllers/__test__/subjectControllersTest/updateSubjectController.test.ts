import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { ISubjectUseCases } from '@src/domain/useCases/subjectUseCases';
import { ISubjectControllers, SubjectController } from '../../subjectControllers';
import { VALID_SUBJECT_DATA } from '@src/domain/useCases/__test__/subjectUseCasesTest/testConstantsSubject';

describe('Update level controller tests', () => {
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let subjectController: ISubjectControllers;

  beforeAll(() => {
    mockedSubjectUseCases = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    subjectController = new SubjectController(mockedSubjectUseCases as ISubjectUseCases);
  });

  test('Should return body when update level successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'update').mockResolvedValue(VALID_SUBJECT_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_SUBJECT_DATA,
    });

    /**
     * @Execution
     */
    await subjectController.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: VALID_SUBJECT_DATA,
    });
    expect(mockedSubjectUseCases.update).toHaveBeenCalledWith(VALID_SUBJECT_DATA);
  });

  test('Should hadle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'update').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await subjectController.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedSubjectUseCases.update).toHaveBeenCalledWith({
      description: '',
      isActive: true,
      id: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'update').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_SUBJECT_DATA,
    });

    /**
     * @Execution
     */
    await subjectController.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
