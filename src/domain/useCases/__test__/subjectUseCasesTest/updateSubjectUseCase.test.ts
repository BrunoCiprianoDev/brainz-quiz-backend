import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { ISubjectRepository } from '@src/domain/interfaces/repositories/subjectRepository';
import { ISubjectUseCases, SubjectUseCases } from '../../subjectUseCases';
import { VALID_SUBJECT_CREATE_DATA, VALID_SUBJECT_DATA, VALID_SUBJECT_UUID } from './testConstantsSubject';
import { NotFoundError } from '@src/domain/util/errors';

describe('UpdateSubjectUseCase', () => {
  let mockedSubjectRepository: Partial<ISubjectRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let subjectUseCases: ISubjectUseCases;
  beforeAll(() => {
    mockedSubjectRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    subjectUseCases = new SubjectUseCases(
      mockedSubjectRepository as ISubjectRepository,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should update Subject successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_SUBJECT_DATA.id,
      description: 'New Description',
      isActive: false,
    };

    jest.spyOn(mockedSubjectRepository, 'update').mockClear();
    jest.spyOn(mockedSubjectRepository, 'findById').mockResolvedValue(VALID_SUBJECT_DATA);

    /**
     * @Execution
     */
    const sut = await subjectUseCases.update(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(input);
    expect(mockedSubjectRepository.update).toHaveBeenCalledWith(input);
    expect(mockedSubjectRepository.findById).toHaveBeenCalledWith({ id: input.id });
  });

  test('Should return NotFoundError when not found subject by id ', async () => {
    /**
     * @Setup
     */
    jest.spyOn(mockedSubjectRepository, 'findById').mockRejectedValue(null);

    /**
     * @Execution
     * @Assert
     */
    await expect(subjectUseCases.update(VALID_SUBJECT_DATA)).rejects.toBeInstanceOf(NotFoundError);
  });
});
