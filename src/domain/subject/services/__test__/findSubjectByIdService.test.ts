import { NotFoundError } from '../../../util/errors/appErrors';
import { ISubjectRepository } from '../../repositories/subjectRepository';
import { FindSubjectByIdService, IFindSubjectByIdService } from '../findSubjectByIdService';

describe('Find subject by id tests', () => {
  let subjectRepository: Partial<ISubjectRepository>;
  let findSubjectByIdService: IFindSubjectByIdService;

  beforeAll(async () => {
    subjectRepository = {
      findById: jest.fn(),
    };

    findSubjectByIdService = new FindSubjectByIdService(subjectRepository as ISubjectRepository);
  });

  test('Should return subject by id', async () => {
    const subjectExp = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'SUBJECT',
      isDeleted: false,
    };

    jest.spyOn(subjectRepository, 'findById').mockResolvedValue(subjectExp);

    const sut = await findSubjectByIdService.execute(subjectExp.id);

    expect(sut).toMatchObject(subjectExp);

    expect(subjectRepository.findById).toHaveBeenCalledWith(subjectExp.id);
  });

  test('Should return NotFoundError when not found subject by id', async () => {
    jest.spyOn(subjectRepository, 'findById').mockResolvedValue(null);

    await expect(findSubjectByIdService.execute('7592292e-2d30-4def-87bf-ea83c9bd5e37')).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(subjectRepository.findById).toHaveBeenCalledWith('7592292e-2d30-4def-87bf-ea83c9bd5e37');
  });
});
