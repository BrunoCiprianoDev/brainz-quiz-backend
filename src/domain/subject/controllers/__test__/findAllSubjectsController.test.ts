import { IHttpContext } from '../../../util/adapters/httpContext';
import { ISubject } from '../../models/subject';
import { IFindAllSubjectsService } from '../../services/findAllSubjectsService';
import { FindAllSubjectsController, IFindAllSubjectsController } from '../findAllSubjectsController';

describe('Find subject by id controller', () => {
  let mockedFindAllSubjectsService: jest.Mocked<IFindAllSubjectsService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let findAllSubjectsController: IFindAllSubjectsController;

  beforeAll(() => {
    mockedFindAllSubjectsService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    findAllSubjectsController = new FindAllSubjectsController(mockedFindAllSubjectsService);
  });

  test('Should return subject by id successfully', async () => {
    const description = 'SUBJECT_DESCRIPTION';
    const subjectExp = [
      {
        id: '4ed12231-45dd-435f-875d-98588212dc72',
        description,
        isDeleted: false,
      },
    ] as ISubject[];

    jest.spyOn(mockedFindAllSubjectsService, 'execute').mockResolvedValue(subjectExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: { contains: '', page: 1, size: 2, isDeleted: false },
    });

    await findAllSubjectsController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 200, body: subjectExp });
    expect(mockedFindAllSubjectsService.execute).toHaveBeenCalledWith({
      contains: '',
      page: 1,
      size: 2,
      isDeleted: false,
    });
  });

  test('Should handle empty attribute', async () => {
    jest.spyOn(mockedFindAllSubjectsService, 'execute').mockRejectedValue(new Error('ANY'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findAllSubjectsController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
    expect(mockedFindAllSubjectsService.execute).toHaveBeenCalledWith({
      contains: '',
      page: 0,
      size: 0,
      isDeleted: false,
    });
  });
});
