import {
  IDeleteOptionData,
  IFindAllOptionsByQuestionIdData,
  IFindOptionById,
  IOption,
  IOptionCreateData,
} from '@src/domain/util/models/optionsModels';

export interface IOptionRepository {
  create(data: IOptionCreateData): Promise<void>;
  update(data: IOption): Promise<void>;
  findById(data: IFindOptionById): Promise<IOption | null>;
  findAllByQuestionId(data: IFindAllOptionsByQuestionIdData): Promise<IOption[]>;
  delete(data: IDeleteOptionData): Promise<void>;
}
