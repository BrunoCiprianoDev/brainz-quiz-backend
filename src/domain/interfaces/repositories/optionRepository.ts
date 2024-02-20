import {
  IDeleteOptionData,
  IFindAllOptionsByQuestionIdData,
  IFindOptionById,
  IOption,
} from '@src/domain/util/models/optionsModels';

export interface IOptionRepository {
  create(data: IOption[]): Promise<void>;
  update(data: IOption): Promise<void>;
  findById(data: IFindOptionById): Promise<IOption | null>;
  findAllByQuestionId(data: IFindAllOptionsByQuestionIdData): Promise<IOption[]>;
  delete(data: IDeleteOptionData): Promise<void>;
}
