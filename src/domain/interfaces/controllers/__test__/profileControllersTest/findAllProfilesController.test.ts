import { IHttpContext } from '@src/domain/interfaces/adapters/httpContext';
import { IProfileUseCases } from '@src/domain/useCases/profileUseCases';
import { IProfileControllers, ProfileControllers } from '../../profileControllers';
import { VALID_PROFILE_DATA } from '@src/domain/useCases/__test__/profileUseCasesTest/testConstantsProfile';

describe('FindAll Subjects controller tests', () => {
  let mockedProfileUseCases: Partial<IProfileUseCases>;
  let mockedHttpContext: jest.Mocked<IHttpContext>;
  let profileControllers: IProfileControllers;

  beforeAll(() => {
    mockedProfileUseCases = {
      findAll: jest.fn(),
    };

    mockedHttpContext = {
      getRequest: jest.fn(),
      send: jest.fn(),
    };

    profileControllers = new ProfileControllers(mockedProfileUseCases as IProfileUseCases);
  });


  test('Should return body when findAll Profiles successfully', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'findAll').mockResolvedValue([VALID_PROFILE_DATA]);

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      body: {},
      query: {
        page: 1,
        size: 10,
        query: 'any',
      },
    });

    /**
     * @Execution
     */
    await profileControllers.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 200,
      body: [VALID_PROFILE_DATA],
    });
    expect(mockedProfileUseCases.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      query: 'any',
    });
  });

  test('Should handle empty attributes', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'findAll').mockClear();

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
    });

    /**
     * @Execution
     */
    await profileControllers.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedProfileUseCases.findAll).toHaveBeenCalledWith({
      page: 0,
      size: 0,
      query: '',
    });
  });

  test('Should handle error', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedProfileUseCases, 'findAll').mockRejectedValue(new Error('any'));

    (mockedHttpContext.getRequest as jest.Mock).mockReturnValue({
      headers: { any: '' },
      query: {
        page: 1,
        size: 10,
        query: 'any',
      },
    });

    /**
     * @Execution
     */
    await profileControllers.findAll(mockedHttpContext);

    /**
     * @Assert
     */
    expect(mockedHttpContext.send).toHaveBeenCalledWith({
      statusCode: 500,
      body: { message: 'Unexpected error occurred' },
    });
  });
});
