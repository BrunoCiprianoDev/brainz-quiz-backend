import { ILevel } from './levelModels';
import { IOption } from './optionsModels';
import { ISubject } from './subjectModels';

export interface IQuestion {
  id: string;
  description: string;
  level: ILevel;
  subject: ISubject;
}

export interface IQuestionCreateData extends Omit<IQuestion, 'id' | 'level' | 'subject'> {
  levelId: string;
  subjectId: string;
}

export interface IQuestionUpdateData extends IQuestionCreateData {
  id: string;
}

export interface IFindByIdQuestionData {
  id: string;
}

export interface IFindAllQuestionData {
  query: string;
  page: number;
  size: number;
}

export interface IFindQuestionData {
  levelId: string;
  subjectId: string;
}

export interface IQuestionWithOptionsData {
  question: IQuestion;
  options: IOption[];
}

export interface IDeleteQuestionData {
  id: string;
}
