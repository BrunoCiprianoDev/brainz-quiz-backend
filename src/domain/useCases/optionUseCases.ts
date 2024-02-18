import { Option } from '../entities/option';
import { IuuidGenerator } from '../interfaces/adapters/uuidGenerator';
import { IOptionRepository } from '../interfaces/repositories/optionRepository';
import { NotFoundError } from '../util/errors';
import { ErrorHandlerUseCases } from '../util/errors/errorHandler';
import {
  IDeleteOptionData,
  IFindAllOptionsByQuestionIdData,
  IFindOptionById,
  IOption,
  IOptionCreateData,
} from '../util/models/optionsModels';
import { IQuestionUseCases } from './questionUseCases';

const ERROR_MESSAGE_OPTION_NOT_FOUND_BY_ID = 'Option not found by id';

export interface IOptionUseCases {
  create(data: IOptionCreateData): Promise<IOption[]>;
  update(data: IOption): Promise<IOption>;
  findById(data: IFindOptionById): Promise<IOption>;
  findAllByQuestionId(data: IFindAllOptionsByQuestionIdData): Promise<IOption[]>;
  delete(data: IDeleteOptionData): Promise<void>;
}

export class OptionUseCases extends ErrorHandlerUseCases implements IOptionUseCases {
  constructor(
    private optionRepository: IOptionRepository,
    private questionUseCases: IQuestionUseCases,
    private uuidGenerator: IuuidGenerator,
  ) {
    super();
  }

  public async create(data: IOptionCreateData): Promise<IOption[]> {
    try {
      await this.questionUseCases.findById({ id: data.questionId });

      const optionsToCreatePromises = data.optionsWithoutId.map(async optionWithoutId => {
        const id = await this.uuidGenerator.generate();
        const optionValid = new Option({ id, ...optionWithoutId, questionId: data.questionId });
        return optionValid.data;
      });

      const optionsToCreate = await Promise.all(optionsToCreatePromises);
      await this.optionRepository.create(optionsToCreate);

      return optionsToCreate;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(data: IOption): Promise<IOption> {
    try {
      await this.questionUseCases.findById({ id: data.questionId });
      await this.findById({ id: data.id });
      const optionToUpdate = new Option(data);
      await this.optionRepository.update(optionToUpdate.data);
      return optionToUpdate.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async findById(data: IFindOptionById): Promise<IOption> {
    try {
      const result = await this.optionRepository.findById(data);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_OPTION_NOT_FOUND_BY_ID);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async findAllByQuestionId(data: IFindAllOptionsByQuestionIdData): Promise<IOption[]> {
    try {
      return await this.optionRepository.findAllByQuestionId(data);
    } catch (error) {
      this.handleError(error);
    }
  }
  public async delete(data: IDeleteOptionData): Promise<void> {
    try {
      await this.findById({ id: data.id });
      await this.optionRepository.delete(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}
