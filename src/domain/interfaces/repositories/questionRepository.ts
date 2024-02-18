import {
  IDeleteQuestionData,
  IFindAllQuestionData,
  IFindByIdQuestionData,
  IQuestion,
} from '@src/domain/util/models/questionModels';

export interface IQuestionRepository {
  create(data: IQuestion): Promise<void>;
  update(data: IQuestion): Promise<void>;
  findById(data: IFindByIdQuestionData): Promise<IQuestion | null>;
  findAll(data: IFindAllQuestionData): Promise<IQuestion[]>;
  findQuestion(data: IFindAllQuestionData): Promise<IQuestion>;
  delete(data: IDeleteQuestionData): Promise<void>;
}
