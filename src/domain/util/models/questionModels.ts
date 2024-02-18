import { ILevel } from './levelModels';
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
