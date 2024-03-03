import { IProfile } from '../models/profile';

export interface IProfileRepository {
  create(profile: IProfile): Promise<void>;
  findById(id: string): Promise<IProfile | null>;
  findByUserId(userId: string): Promise<IProfile | null>;
  updateName(data: { id: string; name: string }): Promise<void>;
  addScorePoins(data: { id: string; score: number }): Promise<void>;
  userAlreadyHaveProfile(userId: string): Promise<boolean>;
}
