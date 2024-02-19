import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';

import { ISubjectUseCases } from '@src/domain/useCases/subjectUseCases';
import { ISubjectControllers, SubjectController } from '../../subjectControllers';
import {
  VALID_SUBJECT_CREATE_DATA,
  VALID_SUBJECT_DATA,
} from '@src/domain/useCases/__test__/subjectUseCasesTest/testConstantsSubject';

describe('Create subject controller tests', () => {
  let mockedSubjectUseCases: Partial<ISubjectUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let subjectController: ISubjectControllers;

  beforeAll(() => {
    mockedSubjectUseCases = {
      create: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    subjectController = new SubjectController(mockedSubjectUseCases as ISubjectUseCases);
  });

  test('Should return body when create level successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'create').mockResolvedValue(VALID_SUBJECT_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_SUBJECT_CREATE_DATA,
    });

    /**
     * @Execution
     */
    await subjectController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: VALID_SUBJECT_DATA,
    });
    expect(mockedSubjectUseCases.create).toHaveBeenCalledWith(VALID_SUBJECT_CREATE_DATA);
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'create').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await subjectController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedSubjectUseCases.create).toHaveBeenCalledWith({
      description: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectUseCases, 'create').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_SUBJECT_CREATE_DATA,
    });

    /**
     * @Execution
     */
    await subjectController.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
