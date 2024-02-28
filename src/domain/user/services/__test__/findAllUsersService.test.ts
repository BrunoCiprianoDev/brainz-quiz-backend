import { ERROR_MESSAGE_FIND_ALL_USERS_SIZE, FindAllUsersService, IFindAllUsersService } from '../findAllUsersService';
import { IUserRepository } from '../../repositories/userRepository';
import { Role } from '../../models/user';
import { BadRequestError } from '../../../util/errors/appErrors';

describe('Find all users service tests', () => {
  let userRepository: Partial<IUserRepository>;
  let findAllUsersService: IFindAllUsersService;

  beforeAll(() => {
    userRepository = {
      findAllUsers: jest.fn(),
    };

    findAllUsersService = new FindAllUsersService(userRepository as IUserRepository);
  });

  test('Should return a list users successfully when is valid params', async () => {
    const validUser01 = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae4',
      email: 'johnDoe@email.com',
      role: Role.Admin,
    };

    const validUser02 = {
      id: 'fefa7b41-0acd-451c-bea6-b113c6d5eae2',
      email: 'email@email.com',
      role: Role.Standard,
    };

    jest.spyOn(userRepository, 'findAllUsers').mockResolvedValue([validUser01, validUser02]);

    const sut = await findAllUsersService.execute({
      contains: 'email',
      page: 1,
      size: 20,
    });

    expect(sut).toMatchObject([validUser01, validUser02]);
  });

  test('Should return a BadRequestError when size > 20', async () => {
    jest.spyOn(userRepository, 'findAllUsers').mockClear();

    await expect(
      findAllUsersService.execute({
        contains: 'email',
        page: 1,
        size: 21,
      }),
    ).rejects.toEqual(new BadRequestError(ERROR_MESSAGE_FIND_ALL_USERS_SIZE));
  });
});
