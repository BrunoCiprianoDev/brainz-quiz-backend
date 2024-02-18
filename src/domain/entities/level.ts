import { Uuid } from '../util/constraints';
import { NotEmpty } from '../util/constraints/notEmpty';
import { ILevel } from '../util/models/levelModels';

export class Level implements ILevel {
  @Uuid()
  private _id: string;

  @NotEmpty()
  private _description: string;

  private _points: number;

  private _isActive: boolean;

  constructor({ id, description, points, isActive }: ILevel) {
    this._id = id;
    this._description = description;
    this._points = points;
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

  set points(points: number) {
    this._points = points;
  }

  get points(): number {
    return this._points;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get data(): ILevel {
    return {
      id: this.id,
      description: this.description,
      points: this.points,
      isActive: this.isActive,
    };
  }
}
