import { Question } from '../entities/question';
import { IuuidGenerator } from '../interfaces/adapters/uuidGenerator';
import { IQuestionRepository } from '../interfaces/repositories/questionRepository';
import { BadRequestError, NotFoundError } from '../util/errors';
import { ErrorHandlerUseCases } from '../util/errors/errorHandler';
import {
  IDeleteQuestionData,
  IFindAllQuestionData,
  IFindByIdQuestionData,
  IQuestion,
  IQuestionCreateData,
  IQuestionUpdateData,
} from '../util/models/questionModels';
import { ILeveUseCases } from './levelUseCases';
import { ISubjectUseCases } from './subjectUseCases';

const ERROR_MESSAGE_QUESTION_NOT_FOUND_BY_ID = 'Question not found by id';
const ERROR_MESSAGE_QUESTION_FIND_ALL_PARAMS =
  'Error when searching for question. Please ensure that: (page > 0), (size > 0), and (size <= 10).';
const ERROR_MESSAGE_QUESTION_NOT_FOUND = 'Question not found';

export interface IQuestionUseCases {
  create(data: IQuestionCreateData): Promise<IQuestion>;
  update(data: IQuestionUpdateData): Promise<IQuestion>;
  findById(data: IFindByIdQuestionData): Promise<IQuestion | null>;
  findAll(data: IFindAllQuestionData): Promise<IQuestion[]>;
  findQuestion(data: IFindAllQuestionData): Promise<IQuestion>;
  delete(data: IDeleteQuestionData): Promise<void>;
}

export class QuestionUseCases extends ErrorHandlerUseCases implements IQuestionUseCases {
  constructor(
    private questionRepository: IQuestionRepository,
    private levelUseCases: ILeveUseCases,
    private subjectUseCases: ISubjectUseCases,
    private uuidGenerator: IuuidGenerator,
  ) {
    super();
  }

  public async create(data: IQuestionCreateData): Promise<IQuestion> {
    try {
      const id = await this.uuidGenerator.generate();
      const level = await this.levelUseCases.findById({ id: data.levelId });
      const subject = await this.subjectUseCases.findById({ id: data.subjectId });
      const questionToCreate = new Question({ id, ...data, level, subject });
      await this.questionRepository.create(questionToCreate.data);
      return questionToCreate.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(data: IQuestionUpdateData): Promise<IQuestion> {
    try {
      await this.questionRepository.findById({ id: data.id });
      const level = await this.levelUseCases.findById({ id: data.levelId });
      const subject = await this.subjectUseCases.findById({ id: data.subjectId });
      const questionToUpdate = new Question({ ...data, level, subject });
      await this.questionRepository.update(questionToUpdate.data);
      return questionToUpdate.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(data: IFindByIdQuestionData): Promise<IQuestion | null> {
    try {
      const result = await this.questionRepository.findById(data);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_QUESTION_NOT_FOUND_BY_ID);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(data: IFindAllQuestionData): Promise<IQuestion[]> {
    try {
      if (data.page < 1 || data.size < 1 || data.size > 10) {
        throw new BadRequestError(ERROR_MESSAGE_QUESTION_FIND_ALL_PARAMS);
      }
      return this.questionRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findQuestion(data: IFindAllQuestionData): Promise<IQuestion> {
    try {
      const result = await this.questionRepository.findQuestion(data);
      if (!result) {
        throw new BadRequestError(ERROR_MESSAGE_QUESTION_NOT_FOUND);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async delete(data: IDeleteQuestionData): Promise<void> {
    try {
      await this.findById({ id: data.id });
      await this.questionRepository.delete(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
