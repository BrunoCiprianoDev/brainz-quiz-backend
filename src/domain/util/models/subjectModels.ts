export interface ISubject {
  id: string;
  description: string;
  isActive: boolean;
}

export interface ISubjectCreateData extends Omit<ISubject, 'id' | 'isActive'> { }

export interface IFindAllSubjectData {
  isActive: boolean;
  query: string;
  page: number;
  size: number;
}

export interface IFindSubjectById {
  id: string;
}
