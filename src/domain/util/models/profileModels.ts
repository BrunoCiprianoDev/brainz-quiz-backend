export interface IProfile {
  id: string;
  userId: string;
  name: string;
  score: number;
}

export interface IProfileCreateData extends Omit<IProfile, 'id'> {}

export interface IFindProfileByIdData {
  id: string;
}

export interface IFindAllProfilesData {
  query: string;
  page: number;
  size: number;
}

export interface IFindProfileByUserId {
  userId: string;
}
