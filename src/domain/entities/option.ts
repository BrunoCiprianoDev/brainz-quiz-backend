import { Uuid } from '../util/constraints';
import { NotEmpty } from '../util/constraints/notEmpty';
import { IOption } from '../util/models/optionsModels';

export class Option implements IOption {
  @Uuid()
  private _id: string;

  @Uuid()
  private _questionId: string;

  @NotEmpty()
  private _description: string;
  private _isCorrect: boolean;

  constructor({ id, questionId, description, isCorrect }: IOption) {
    this._id = id;
    this._questionId = questionId;
    this._description = description;
    this._isCorrect = isCorrect;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get questionId(): string {
    return this._questionId;
  }

  set questionId(value: string) {
    this._questionId = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get isCorrect(): boolean {
    return this._isCorrect;
  }

  set isCorrect(value: boolean) {
    this._isCorrect = value;
  }

  get data(): IOption {
    return {
      id: this.id,
      questionId: this.questionId,
      description: this.description,
      isCorrect: this.isCorrect,
    };
  }
}
