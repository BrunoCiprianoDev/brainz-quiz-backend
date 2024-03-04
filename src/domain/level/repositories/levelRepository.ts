import { ILevel } from "../models/level";

export interface ILevelRepository {

  create(level: ILevel): Promise<void>;
  update(level: ILevel): Promise<void>;
  findById(id: string): Promise<ILevel | null>;
  findAll(data: { contains: string; page: number; size: number; isDeleted: boolean }): Promise<ILevel[]>;

}