import { IPasswordEncryptor } from "@src/domain/interfaces/adapters/passwordEncryptor";
import { UserUseCases } from "../../userUseCases";
import { IUserRepository } from "@src/domain/interfaces/repositories/userRepository";
import { RoleEnum } from "@src/domain/entities/role";
import { InternalServerError } from "@src/domain/util/errors/appErrors";

describe('CreateUser Test', () => {
  let userUseCases: UserUseCases;
  let mockedUserRepository: jest.Mocked<IUserRepository>;
  let mockedPasswordEncryptor: jest.Mocked<IPasswordEncryptor>;

  beforeAll(() => {
    mockedUserRepository = {
      create: jest.fn(),
      updateRole: jest.fn(),
      updateName: jest.fn(),
      updateAvatar: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      existsByEmail: jest.fn(),
      existsById: jest.fn(),
    };

    mockedPasswordEncryptor = {
      encryptor: jest.fn(),
      passwordCompare: jest.fn(),
    };

    userUseCases = new UserUseCases(mockedUserRepository, mockedPasswordEncryptor);
  });

  test('Should return a list user successfully', async () => {

    const listExpected = [
      {
        id: 'uuid1',
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: 'passEncrypt',
        role: RoleEnum.Player,
      },
      {
        id: 'uuid2',
        name: 'name',
        email: 'email@email.com',
        avatar: 'avatar',
        password: 'passEncrypt',
        role: RoleEnum.Player,
      }
    ]

    jest.spyOn(mockedUserRepository, 'findAll').mockResolvedValue(listExpected);

    const sut = await userUseCases.findAll({ query: '', page: 1, size: 2 });

    expect(sut).toEqual(listExpected);

  })

  test('Must treat page or size values ​​when they are less than 1', async () => {

    jest.spyOn(mockedUserRepository, 'findAll').mockClear();

    await userUseCases.findAll({ query: '', page: 0, size: 0 });

    expect(mockedUserRepository.findAll).toHaveBeenCalledWith({ query: '', page: 1, size: 1 });
  })

  test('Shold return InternalServerError when a unexpected ocurr', async () => {

    jest.spyOn(mockedUserRepository, 'findAll').mockRejectedValue(new Error('Any Error'));

    await expect(userUseCases.findAll({ query: '', page: 1, size: 1 })).rejects.toBeInstanceOf(InternalServerError);
  })

})