import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IProfileUseCases } from '@src/domain/useCases/profileUseCases';
import { IProfileControllers, ProfileControllers } from '../../profileControllers';
import {
  VALID_PROFILE_CREATE_DATA,
  VALID_PROFILE_DATA,
} from '@src/domain/useCases/__test__/profileUseCasesTest/testConstantsProfile';

describe('CreateProfileController tests', () => {
  let mockedProfileUseCases: Partial<IProfileUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let profileControllers: IProfileControllers;

  beforeAll(() => {
    mockedProfileUseCases = {
      create: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    profileControllers = new ProfileControllers(mockedProfileUseCases as IProfileUseCases);
  });

  test('Should return body when Profile level successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'create').mockResolvedValue(VALID_PROFILE_DATA);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_PROFILE_CREATE_DATA,
    });

    /**
     * @Execution
     */
    await profileControllers.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 201,
      body: VALID_PROFILE_DATA,
    });
    expect(mockedProfileUseCases.create).toHaveBeenCalledWith(VALID_PROFILE_CREATE_DATA);
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'create').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
    });

    /**
     * @Execution
     */
    await profileControllers.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedProfileUseCases.create).toHaveBeenCalledWith({
      userId: '',
      name: '',
      score: 0,
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'create').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: VALID_PROFILE_CREATE_DATA,
    });

    /**
     * @Execution
     */
    await profileControllers.create(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
