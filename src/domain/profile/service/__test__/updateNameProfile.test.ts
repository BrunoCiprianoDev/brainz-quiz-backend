import { NotFoundError } from '../../../util/errors/appErrors';
import { IProfileRepository } from '../../repositories/profileRepository';
import { IUpdateNameProfileService, UpdateNameProfileService } from '../updateNameProfileService';

describe('Update profile tests', () => {
  let mockedProfileRepository: Partial<IProfileRepository>;
  let updateNameProfileService: IUpdateNameProfileService;

  beforeAll(() => {
    mockedProfileRepository = {
      updateName: jest.fn(),
      findById: jest.fn(),
    };

    updateNameProfileService = new UpdateNameProfileService(mockedProfileRepository as IProfileRepository);
  });

  test('Should return profiel with updated name', async () => {
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';
    const mockedFindByIdExp = { id, userId: 'be795b88-2dca-4797-aa8d-cf420cdfd3fb', name: 'John', score: 0 };

    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(mockedFindByIdExp);

    const sut = await updateNameProfileService.execute({ id, name: 'NAME_UPDATED' });

    expect(sut).toMatchObject({
      ...mockedFindByIdExp,
      name: 'NAME_UPDATED',
    });
    expect(mockedProfileRepository.findById).toHaveBeenCalledWith(id);
    expect(mockedProfileRepository.updateName).toHaveBeenCalledWith({ id, name: mockedFindByIdExp.name });
  });

  test('Should return NotFoundError when not found Profile by Id', async () => {
    const id = '70167299-c315-4e29-b5e4-f7990fc98d8e';

    jest.spyOn(mockedProfileRepository, 'findById').mockResolvedValue(null);

    await expect(updateNameProfileService.execute({ id, name: 'NAME_UPDATED' })).rejects.toBeInstanceOf(NotFoundError);

    expect(mockedProfileRepository.findById).toHaveBeenCalledWith(id);
    expect(mockedProfileRepository.updateName).toHaveBeenCalledTimes(0);
  });
});
