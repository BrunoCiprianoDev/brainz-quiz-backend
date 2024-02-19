import { ErrorHandlerControllers } from '@src/domain/util/errors/errorHandler';
import { IHttpContext } from '../adapters/httpContext';
import { ISubjectUseCases } from '@src/domain/useCases/subjectUseCases';
import { IFindAllSubjectData, ISubject, ISubjectCreateData } from '@src/domain/util/models/subjectModels';

export interface ISubjectControllers {
  create(httpContext: IHttpContext): Promise<void>;
  update(httpContext: IHttpContext): Promise<void>;
  findById(httpContext: IHttpContext): Promise<void>;
  findAll(httpContext: IHttpContext): Promise<void>;
}

export class SubjectController extends ErrorHandlerControllers implements ISubjectControllers {
  constructor(private subjectUseCases: ISubjectUseCases) {
    super();
  }

  public async create(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as ISubjectCreateData;
      const subjectCreateData = {
        description: body.description ?? '',
      };
      const result = await this.subjectUseCases.create(subjectCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async update(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as ISubject;
      const subjectData = {
        id: body.id ?? '',
        description: body.description ?? '',
        isActive: body.isActive ?? true,
      };
      const result = await this.subjectUseCases.update(subjectData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const findByIdData = { id };
      const result = await this.subjectUseCases.findById(findByIdData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async findAll(httpContext: IHttpContext): Promise<void> {
    try {
      const query = httpContext.getRequest().query ?? null;
      const findAllLevelsData = {
        page: query?.page ?? 0,
        size: query?.size ?? 0,
        query: query?.query ?? '',
        isActive: query?.isActive ?? true,
      } as IFindAllSubjectData;

      const result = await this.subjectUseCases.findAll(findAllLevelsData);

      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
