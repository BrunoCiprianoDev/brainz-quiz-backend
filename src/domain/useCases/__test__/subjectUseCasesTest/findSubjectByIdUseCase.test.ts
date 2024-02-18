import { ISubjectRepository } from "@src/domain/interfaces/repositories/subjectRepository";
import { ISubjectUseCases, SubjectUseCases } from "../../subjectUseCases";
import { IuuidGenerator } from "@src/domain/interfaces/adapters/uuidGenerator";
import { VALID_SUBJECT_DATA, VALID_SUBJECT_UUID } from "./testConstantsSubject";
import { InternalServerError, NotFoundError } from "@src/domain/util/errors";

describe('FindSubjectByIdUseCase test', () => {
  let mockedSubjectRepository: Partial<ISubjectRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let subjectUseCases: ISubjectUseCases;
  beforeAll(() => {
    mockedSubjectRepository = {
      findById: jest.fn(),
    };

    subjectUseCases = new SubjectUseCases(
      mockedSubjectRepository as ISubjectRepository,
      mockedUuidGenerator as IuuidGenerator,
    );
  });


  test('Should return Subject by Id successfully', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_SUBJECT_UUID,
    };

    jest.spyOn(mockedSubjectRepository, 'findById').mockResolvedValue(VALID_SUBJECT_DATA);

    /**
     * @Execution
     */
    const sut = await subjectUseCases.findById(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(VALID_SUBJECT_DATA);
    expect(mockedSubjectRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return NotFoundError when not found Subject by id', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_SUBJECT_UUID,
    };

    jest.spyOn(mockedSubjectRepository, 'findById').mockResolvedValue(null);

    /**
     * @Assert
     * @Execution
     */
    await expect(subjectUseCases.findById(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedSubjectRepository.findById).toHaveBeenCalledWith(input);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      id: VALID_SUBJECT_UUID,
    };

    jest.spyOn(mockedSubjectRepository, 'findById').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(subjectUseCases.findById(input)).rejects.toBeInstanceOf(InternalServerError);
  });
})