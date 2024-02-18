export interface IOption {
  id: string;
  questionId: string;
  description: string;
  isCorrect: boolean;
}

export interface IOptionCreateData extends Omit<IOption, 'id' | 'questionId'> {}

export interface IFindOptionById {
  id: string;
}

export interface IFindAllOptionsByQuestionIdData {
  questionId: string;
}

export interface IDeleteOptionData {
  id: string;
}
