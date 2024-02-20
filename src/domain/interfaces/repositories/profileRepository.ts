import {
  IFindAllProfilesData,
  IFindProfileByUserId,
  IProfile,
  IProfileCreateData,
} from '@src/domain/util/models/profileModels';
import { IFindUserByIdData } from '@src/domain/util/models/userModels';

export interface IProfileRepository {
  create(data: IProfileCreateData): Promise<void>;
  update(data: IProfile): Promise<void>;
  findAll(data: IFindAllProfilesData): Promise<IProfile[]>;
  findById(data: IFindUserByIdData): Promise<IProfile | null>;
  findProfileByUserId(data: IFindProfileByUserId): Promise<IProfile | null>;
}
