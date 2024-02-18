import { IFindAllLevelData, IFindLevelByIdData, ILevel, ILevelCreateData } from '@src/domain/util/models/levelModels';

export interface ILevelRepository {
  create(data: ILevelCreateData): Promise<void>;
  update(data: ILevel): Promise<void>;
  findById(data: IFindLevelByIdData): Promise<ILevel | null>;
  findAll(data: IFindAllLevelData): Promise<ILevel[]>;
}
