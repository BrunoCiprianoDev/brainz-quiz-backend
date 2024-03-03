import { BadRequestError } from '../../../util/errors/appErrors';
import { ISubjectRepository } from '../../repositories/subjectRepository';
import { FindAllSubjectsService, IFindAllSubjectsService } from '../findAllSubjectsService';

describe('Find subject by id tests', () => {
  let subjectRepository: Partial<ISubjectRepository>;
  let findAllSubjectService: IFindAllSubjectsService;

  beforeAll(async () => {
    subjectRepository = {
      findAll: jest.fn(),
    };

    findAllSubjectService = new FindAllSubjectsService(subjectRepository as ISubjectRepository);
  });

  test('Should return a list subejcts successfully', async () => {
    const subjectExp = [
      {
        id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
        description: 'SUBJECT',
        isDeleted: false,
      },
      {
        id: '16f03f9f-e724-457d-ab80-37405a2d5055',
        description: 'SUBJECT',
        isDeleted: false,
      },
    ];

    const input = {
      contains: 'Any',
      page: 1,
      size: 10,
      isDeleted: false,
    };

    jest.spyOn(subjectRepository, 'findAll').mockResolvedValue(subjectExp);

    const sut = await findAllSubjectService.execute(input);

    expect(sut).toMatchObject(subjectExp);

    expect(subjectRepository.findAll).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundError when not found subject by id', async () => {
    const input = {
      contains: 'Any',
      page: 1,
      size: 21,
      isDeleted: false,
    };

    jest.spyOn(subjectRepository, 'findAll').mockClear();

    await expect(findAllSubjectService.execute(input)).rejects.toBeInstanceOf(BadRequestError);

    expect(subjectRepository.findAll).toHaveBeenCalledTimes(0);
  });
});
