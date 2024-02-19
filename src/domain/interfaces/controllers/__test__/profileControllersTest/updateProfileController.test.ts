import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IProfileUseCases } from '@src/domain/useCases/profileUseCases';
import { IProfileControllers, ProfileControllers } from '../../profileControllers';
import {
  VALID_PROFILE_DATA,
} from '@src/domain/useCases/__test__/profileUseCasesTest/testConstantsProfile';

describe('UpdateProfileController tests', () => {
  let mockedProfileUseCases: Partial<IProfileUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let profileControllers: IProfileControllers;

  beforeAll(() => {
    mockedProfileUseCases = {
      update: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    profileControllers = new ProfileControllers(mockedProfileUseCases as IProfileUseCases);
  });

  test('Should return body when Profile level updated successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'update').mockResolvedValue(VALID_PROFILE_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_PROFILE_DATA,
    });

    /**
     * @Execution
     */
    await profileControllers.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: VALID_PROFILE_DATA,
    });
    expect(mockedProfileUseCases.update).toHaveBeenCalledWith(VALID_PROFILE_DATA);
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'update').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await profileControllers.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedProfileUseCases.update).toHaveBeenCalledWith({
      id: '',
      userId: '',
      name: '',
      score: 0,
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'update').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_PROFILE_DATA,
    });

    /**
     * @Execution
     */
    await profileControllers.update(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
