import { Uuid } from '../util/constraints';
import { NotEmpty } from '../util/constraints/notEmpty';
import { IProfile } from '../util/models/profileModels';

export class Profile implements IProfile {
  @Uuid()
  private _id: string;

  @Uuid()
  private _userId: string;

  @NotEmpty()
  private _name: string;

  private _score: number;

  constructor({ id, userId, name, score }: IProfile) {
    this._id = id;
    this._userId = userId;
    this._name = name;
    this._score = score;
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get score(): number {
    return this._score;
  }

  set score(score: number) {
    this._score = score;
  }

  get data(): IProfile {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      score: this.score,
    };
  }
}
