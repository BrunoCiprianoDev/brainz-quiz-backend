import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IProfileUseCases } from '@src/domain/useCases/profileUseCases';
import { IProfileControllers, ProfileControllers } from '../../profileControllers';
import {
  VALID_PROFILE_DATA, VALID_PROFILE_UUID,
} from '@src/domain/useCases/__test__/profileUseCasesTest/testConstantsProfile';

describe('FindProfileByUserIdController tests', () => {
  let mockedProfileUseCases: Partial<IProfileUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let profileControllers: IProfileControllers;

  beforeAll(() => {
    mockedProfileUseCases = {
      findProfileByUserId: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    profileControllers = new ProfileControllers(mockedProfileUseCases as IProfileUseCases);
  });

  test('Should return body when Profile by UserId successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'findProfileByUserId').mockResolvedValue(VALID_PROFILE_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      params: { userId: VALID_PROFILE_UUID }
    });

    /**
     * @Execution
     */
    await profileControllers.findProfileByUserId(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: VALID_PROFILE_DATA,
    });
    expect(mockedProfileUseCases.findProfileByUserId).toHaveBeenCalledWith({ userId: VALID_PROFILE_UUID });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'findProfileByUserId').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await profileControllers.findProfileByUserId(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedProfileUseCases.findProfileByUserId).toHaveBeenCalledWith({
      userId: ''
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'findProfileByUserId').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await profileControllers.findProfileByUserId(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
