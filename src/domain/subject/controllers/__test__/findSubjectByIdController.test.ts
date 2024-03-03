import { IHttpContext } from '../../../util/adapters/httpContext';
import { NotFoundError } from '../../../util/errors/appErrors';
import { ISubject } from '../../models/subject';
import { IFindSubjectByIdService } from '../../services/findSubjectByIdService';
import { FindSubjectByIdController, IFindSubjectByIdController } from '../findSubjectByIdController';

describe('Find subject by id controller', () => {
  let mockedFindSubjectByIdService: jest.Mocked<IFindSubjectByIdService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let findSubjectByIdController: IFindSubjectByIdController;

  beforeAll(() => {
    mockedFindSubjectByIdService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    findSubjectByIdController = new FindSubjectByIdController(mockedFindSubjectByIdService);
  });

  test('Should return subject by id successfully', async () => {
    const description = 'SUBJECT_DESCRIPTION';
    const subjectExp = {
      id: '4ed12231-45dd-435f-875d-98588212dc72',
      description,
      isDeleted: false,
    } as ISubject;

    jest.spyOn(mockedFindSubjectByIdService, 'execute').mockResolvedValue(subjectExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: { id: subjectExp.id },
    });

    await findSubjectByIdController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 200, body: subjectExp });
    expect(mockedFindSubjectByIdService.execute).toHaveBeenCalledWith(subjectExp.id);
  });

  test('Should handle empty attribute', async () => {
    jest.spyOn(mockedFindSubjectByIdService, 'execute').mockRejectedValue(new NotFoundError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await findSubjectByIdController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 404, body: { message: 'Error message' } });
    expect(mockedFindSubjectByIdService.execute).toHaveBeenCalledWith('');
  });
});
