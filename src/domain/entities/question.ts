import { Uuid } from '../util/constraints';
import { NotEmpty } from '../util/constraints/notEmpty';
import { IQuestion } from '../util/models/questionModels';
import { Subject } from './subject';
import { Level } from './level';
import { ISubject } from '../util/models/subjectModels';
import { ILevel } from '../util/models/levelModels';

export class Question implements IQuestion {
  @Uuid()
  private _id: string;

  @NotEmpty()
  private _description: string;

  private _level: Level;

  private _subject: Subject;

  constructor({ id, description, level, subject }: IQuestion) {
    this._id = id;
    this._description = description;
    this._level = new Level(level);
    this._subject = new Subject(subject);
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get level(): ILevel {
    return this._level.data;
  }

  set level(value: ILevel) {
    this._level = new Level(value);
  }

  get subject(): ISubject {
    return this._subject.data;
  }

  set subject(value: ISubject) {
    this._subject = new Subject(value);
  }

  get data(): IQuestion {
    return {
      id: this.id,
      description: this.description,
      level: this.level,
      subject: this.subject,
    };
  }
}
