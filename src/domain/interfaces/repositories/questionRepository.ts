import {
  IDeleteQuestionData,
  IFindAllQuestionData,
  IFindByIdQuestionData,
  IFindQuestionData,
  IQuestion,
} from '@src/domain/util/models/questionModels';

export interface IQuestionRepository {
  create(data: IQuestion): Promise<void>;
  update(data: IQuestion): Promise<void>;
  findById(data: IFindByIdQuestionData): Promise<IQuestion | null>;
  findAll(data: IFindAllQuestionData): Promise<IQuestion[]>;
  findQuestion(data: IFindQuestionData): Promise<IQuestion | null>;
  delete(data: IDeleteQuestionData): Promise<void>;
}
