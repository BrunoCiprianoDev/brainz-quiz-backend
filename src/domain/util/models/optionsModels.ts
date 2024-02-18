export interface IOption {
  id: string;
  questionId: string;
  description: string;
  isCorrect: boolean;
}

export interface IOptionCreateData extends Omit<IOption, 'id' | 'questionId'> {}
