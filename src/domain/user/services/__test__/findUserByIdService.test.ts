import { NotFoundError } from '../../../util/errors/appErrors';
import { Role } from '../../models/user';
import { IUserRepository } from '../../repositories/userRepository';
import { ERROR_MESSAGE_NOT_FOUND_USER_BY_ID, FindUserByIdService, IFindUserByIdService } from '../findUserByIdService';

describe('Find user by id tests', () => {
  let mockedUserRepository: Partial<IUserRepository>;
  let findUserByIdService: IFindUserByIdService;

  beforeAll(() => {
    mockedUserRepository = {
      findById: jest.fn(),
    };

    findUserByIdService = new FindUserByIdService(mockedUserRepository as IUserRepository);
  });

  test('Should return user by id', async () => {
    const inputId = 'fefa7b41-0acd-451c-bea6-b113c6d5eae4';

    const mockedUserExpected = {
      id: inputId,
      email: 'johnDoe@email.com',
      role: Role.Disable,
    };

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(mockedUserExpected);

    const sut = await findUserByIdService.execute(inputId);

    expect(sut).toMatchObject({
      id: inputId,
      email: 'johnDoe@email.com',
      role: Role.Disable,
    });

    expect(mockedUserRepository.findById).toHaveBeenCalledWith(inputId);
  });

  test('Should return NotFoundError when not found user by id', async () => {
    const inputId = 'fefa7b41-0acd-451c-bea6-b113c6d5eae4';

    jest.spyOn(mockedUserRepository, 'findById').mockResolvedValue(null);

    await expect(findUserByIdService.execute(inputId)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER_BY_ID),
    );

    expect(mockedUserRepository.findById).toHaveBeenCalledWith(inputId);
  });
});
