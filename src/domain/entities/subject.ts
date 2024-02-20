import { Uuid } from '../util/constraints';
import { NotEmpty } from '../util/constraints/notEmpty';
import { ISubject } from '../util/models/subjectModels';

export class Subject implements ISubject {
  @Uuid()
  private _id: string;

  @NotEmpty()
  private _description: string;

  private _isActive: boolean;

  constructor({ id, description, isActive }: ISubject) {
    this._id = id;
    this._description = description;
    this._isActive = isActive;
  }

  set id(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  set description(description: string) {
    this._description = description;
  }

  get description(): string {
    return this._description;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get data(): ISubject {
    return {
      id: this.id,
      description: this.description,
      isActive: this.isActive,
    };
  }
}
