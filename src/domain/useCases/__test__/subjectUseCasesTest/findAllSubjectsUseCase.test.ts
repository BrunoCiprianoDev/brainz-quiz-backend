import { ISubjectRepository } from "@src/domain/interfaces/repositories/subjectRepository";
import { ISubjectUseCases, SubjectUseCases } from "../../subjectUseCases";
import { IuuidGenerator } from "@src/domain/interfaces/adapters/uuidGenerator";
import { VALID_SUBJECT_DATA } from "./testConstantsSubject";
import { BadRequestError, InternalServerError } from "@src/domain/util/errors";

describe('FindAllSubjectsUseCase test', () => {
  let mockedSubjectRepository: Partial<ISubjectRepository>;
  let mockedUuidGenerator: Partial<IuuidGenerator>;
  let subjectUseCases: ISubjectUseCases;
  beforeAll(() => {
    mockedSubjectRepository = {
      findAll: jest.fn(),
    };

    subjectUseCases = new SubjectUseCases(
      mockedSubjectRepository as ISubjectRepository,
      mockedUuidGenerator as IuuidGenerator,
    );
  });

  test('Should return list Subjects successfully', async () => {
    /**
     * @Setup
     */

    const input = {
      query: 'any',
      page: 1,
      size: 2,
      isActive: true
    };

    const mockedFindAllReturn = [VALID_SUBJECT_DATA, VALID_SUBJECT_DATA];

    jest.spyOn(mockedSubjectRepository, 'findAll').mockResolvedValue(mockedFindAllReturn);

    /**
     * @Execution
     */
    const sut = await subjectUseCases.findAll(input);

    /**
     * @Assert
     */
    expect(sut).toMatchObject(mockedFindAllReturn);
    expect(mockedSubjectRepository.findAll).toHaveBeenCalledWith(input);
  });

  test('Must return BadRequestError when the parameters (size, page) are not valid', async () => {
    /**
     * @Setup
     */
    const input = {
      query: 'any',
      page: -1,
      size: 200,
      isActive: true
    };

    jest.spyOn(mockedSubjectRepository, 'findAll').mockClear();

    /**
     * @Execution
     * @Assertion
     */
    await expect(subjectUseCases.findAll(input)).rejects.toBeInstanceOf(BadRequestError);
  });

  test('Should return InternalServerError when an unexpected error occurs', async () => {
    /**
     * @Setup
     */
    const input = {
      query: 'any',
      page: 1,
      size: 2,
      isActive: true
    };

    jest.spyOn(mockedSubjectRepository, 'findAll').mockRejectedValue(new Error('Any'));

    /**
     * @Execution
     * @Assertion
     */
    await expect(subjectUseCases.findAll(input)).rejects.toBeInstanceOf(InternalServerError);
  });

})