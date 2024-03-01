import { IHttpContext } from '../../../util/adapters/httpContext';
import { BadRequestError } from '../../../util/errors/appErrors';
import { IUpdateNameProfileService } from '../../service/updateNameProfileService';
import { IUpdateNameProfileController, UpdateNameProfileController } from '../updateNameProfileService';

describe('Update name profile controller tests', () => {
  let mockedUpdateNameProfileService: jest.Mocked<IUpdateNameProfileService>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let updateNameProfileController: IUpdateNameProfileController;

  beforeAll(() => {
    mockedUpdateNameProfileService = {
      execute: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    updateNameProfileController = new UpdateNameProfileController(mockedUpdateNameProfileService);
  });

  test('Should return Profile with name updated', async () => {
    const userId = 'be795b88-2dca-4797-aa8d-cf420cdfd3fb';
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    const mockedProfileExp = {
      id,
      userId,
      name: 'John Doe',
      score: 200,
    };

    jest.spyOn(mockedUpdateNameProfileService, 'execute').mockResolvedValue(mockedProfileExp);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: { id, name: 'John Doe' },
    });

    await updateNameProfileController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: mockedProfileExp,
    });
  });

  test('Should handle empty attributes', async () => {
    jest.spyOn(mockedUpdateNameProfileService, 'execute').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updateNameProfileController.execute(mockedHttpContext);

    expect(mockedUpdateNameProfileService.execute).toHaveBeenCalledWith({
      id: '',
      name: '',
    });
  });

  test('Should handle error', async () => {
    jest.spyOn(mockedUpdateNameProfileService, 'execute').mockRejectedValue(new BadRequestError('Error message'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    await updateNameProfileController.execute(mockedHttpContext);

    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 400,
      body: { message: 'Error message' },
    });
  });
});
