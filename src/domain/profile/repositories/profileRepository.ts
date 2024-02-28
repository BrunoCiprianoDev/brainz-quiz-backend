import { Profile } from '../models/profile';

export interface IProfileRepository {
  create(profile: Profile): Promise<void>;
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
  updateName(data: { id: string; name: string }): Promise<void>;
  addScorePoins(data: { id: string; score: number }): Promise<void>;
  userAlreadyHaveProfile(userId: string): Promise<boolean>;
}
