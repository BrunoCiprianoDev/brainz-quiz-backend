import { BadRequestError, NotFoundError } from '../../../util/errors/appErrors';
import { ISubjectRepository } from '../../repositories/subjectRepository';
import { IUpdateSubjectService, UpdateSubjectService } from '../updateSubjectService';

describe('Update subject service tests', () => {
  let subjectRepository: Partial<ISubjectRepository>;
  let updateSubjectService: IUpdateSubjectService;

  beforeAll(async () => {
    subjectRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    updateSubjectService = new UpdateSubjectService(subjectRepository as ISubjectRepository);
  });

  test('Should return subject updated successfully', async () => {
    const input = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'SUBJECT_UPDATED',
      isDeleted: true,
    };

    const subjectExp = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'SUBJECT',
      isDeleted: false,
    };

    jest.spyOn(subjectRepository, 'findById').mockResolvedValue(subjectExp);
    jest.spyOn(subjectRepository, 'update').mockClear();

    const sut = await updateSubjectService.execute(input);

    expect(sut).toMatchObject(input);
    expect(subjectRepository.findById).toHaveBeenCalledWith(input.id);
    expect(subjectRepository.update).toHaveBeenCalledWith(input);
  });

  test('Should return BadRequestError when description is not valid', async () => {
    const input = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: '',
      isDeleted: true,
    };

    jest.spyOn(subjectRepository, 'findById').mockClear();
    jest.spyOn(subjectRepository, 'update').mockClear();

    await expect(updateSubjectService.execute(input)).rejects.toBeInstanceOf(BadRequestError);

    expect(subjectRepository.findById).toHaveBeenCalledTimes(0);
    expect(subjectRepository.update).toHaveBeenCalledTimes(0);
  });

  test('Should return NotFoundError', async () => {
    const input = {
      id: '7592292e-2d30-4def-87bf-ea83c9bd5e37',
      description: 'SUBJECT_UPDATED',
      isDeleted: true,
    };

    jest.spyOn(subjectRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(subjectRepository, 'update').mockClear();

    await expect(updateSubjectService.execute(input)).rejects.toBeInstanceOf(NotFoundError);

    expect(subjectRepository.findById).toHaveBeenCalledWith(input.id);
    expect(subjectRepository.update).toHaveBeenCalledTimes(0);
  });
});
