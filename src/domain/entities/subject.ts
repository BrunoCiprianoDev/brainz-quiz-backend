export interface ISubject {
  id: string;
  description: string;
  isDeleted: boolean;
}

export interface ISubjectCreateData extends Omit<ISubject, 'id' | 'isDeleted'> {}

export interface ISubjectReadyOnly extends Omit<ISubject, 'isDeleted'> {}
