import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { ISubject } from '../../models/subject';
import { ICreateSubjectService } from '../../services/createSubjectService';
import { CreateSubjectController, ICreateSubjectController } from '../createSubjectController';

describe('Create subject controller', () => {
  let mockedCreateSubjectService: jest.Mocked<ICreateSubjectService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let createSubjectController: ICreateSubjectController;

  beforeAll(() => {
    mockedCreateSubjectService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    createSubjectController = new CreateSubjectController(mockedCreateSubjectService);
  });

  test('Should return subject created', async () => {
    const description = 'SUBJECT_DESCRIPTION';
    const subjectExp = {
      id: '4ed12231-45dd-435f-875d-98588212dc72',
      description,
      isDeleted: false,
    } as ISubject;

    jest.spyOn(mockedCreateSubjectService, 'execute').mockResolvedValue(subjectExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { description: description },
    });

    await createSubjectController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 201, body: subjectExp });
    expect(mockedCreateSubjectService.execute).toHaveBeenCalledWith(description);
  });

  test('Should handle empty values', async () => {
    jest.spyOn(mockedCreateSubjectService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await createSubjectController.execute(mockedHttpContext);

    expect(mockedCreateSubjectService.execute).toHaveBeenCalledWith('');
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedCreateSubjectService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await createSubjectController.execute(mockedHttpContext);
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });
    expect(mockedCreateSubjectService.execute).toHaveBeenCalledWith('');
  });
});
