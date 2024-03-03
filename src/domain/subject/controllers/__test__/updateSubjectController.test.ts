import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { ISubject } from '../../models/subject';
import { IUpdateSubjectService } from '../../services/updateSubjectService';
import { IUpdateSubjectController, UpdateSubjectController } from '../updateSubjectController';

describe('Update subject tests', () => {
  let mockedUpdateSubjectService: jest.Mocked<IUpdateSubjectService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let updateSubjectController: IUpdateSubjectController;

  beforeAll(() => {
    mockedUpdateSubjectService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    updateSubjectController = new UpdateSubjectController(mockedUpdateSubjectService);
  });

  test('Should return subject updated', async () => {
    const description = 'SUBJECT_DESCRIPTION';
    const subjectExp = {
      id: '4ed12231-45dd-435f-875d-98588212dc72',
      description,
      isDeleted: false,
    } as ISubject;

    jest.spyOn(mockedUpdateSubjectService, 'execute').mockResolvedValue(subjectExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: subjectExp,
    });

    await updateSubjectController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({ statusCode: 200, body: subjectExp });
    expect(mockedUpdateSubjectService.execute).toHaveBeenCalledWith(subjectExp);
  });

  test('Should handle empty values', async () => {
    jest.spyOn(mockedUpdateSubjectService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updateSubjectController.execute(mockedHttpContext);

    expect(mockedUpdateSubjectService.execute).toHaveBeenCalledWith({
      id: '',
      description: '',
      isDeleted: false,
    });
  });

  test('Should handle errors', async () => {
    jest.spyOn(mockedUpdateSubjectService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updateSubjectController.execute(mockedHttpContext);
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });
    expect(mockedUpdateSubjectService.execute).toHaveBeenCalledWith({
      id: '',
      description: '',
      isDeleted: false,
    });
  });
});
