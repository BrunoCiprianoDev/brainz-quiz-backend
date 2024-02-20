export interface ILevel {
  id: string;
  description: string;
  points: number;
  isActive: boolean;
}

export interface ILevelCreateData extends Omit<ILevel, 'id' | 'isActive'> {}

export interface IFindAllLevelData {
  isActive: boolean;
  query: string;
  page: number;
  size: number;
}

export interface IFindLevelByIdData {
  id: string;
}
