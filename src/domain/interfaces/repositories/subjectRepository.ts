import {
  IFindAllSubjectData,
  IFindSubjectById,
  ISubject,
  ISubjectCreateData,
} from '@src/domain/util/models/subjectModels';

export interface ISubjectRepository {
  create(data: ISubjectCreateData): Promise<void>;
  update(data: ISubject): Promise<void>;
  findAll(data: IFindAllSubjectData): Promise<ISubject[]>;
  findById(data: IFindSubjectById): Promise<ISubject | null>;
}
