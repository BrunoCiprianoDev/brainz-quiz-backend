export interface ISubject {
  id: string;
  description: string;
  isActive: boolean;
}

export interface ISubjectCreateData extends Omit<ISubject, 'id' | 'isActive'> {}

export interface IFindAllSubjectData {
  isActive: boolean;
  query: number;
  page: number;
  size: number;
}

export interface IFindSubjectById {
  id: string;
}
