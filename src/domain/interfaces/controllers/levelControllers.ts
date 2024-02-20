import { ErrorHandlerControllers } from '@src/domain/util/errors/errorHandler';
import { IHttpContext } from '../adapters/httpContext';
import { ILevelUseCases } from '@src/domain/useCases/levelUseCases';
import { IFindAllLevelData, ILevel, ILevelCreateData } from '@src/domain/util/models/levelModels';

export interface ILevelControllers {
  create(httpContext: IHttpContext): Promise<void>;
  update(httpContext: IHttpContext): Promise<void>;
  findById(httpContext: IHttpContext): Promise<void>;
  findAll(httpContext: IHttpContext): Promise<void>;
}

export class LevelControllers extends ErrorHandlerControllers implements ILevelControllers {
  constructor(private levelUseCases: ILevelUseCases) {
    super();
  }

  public async create(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as ILevelCreateData;
      const levelCreateData = {
        description: body.description ?? '',
        points: body.points ?? 0,
      };
      const result = await this.levelUseCases.create(levelCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async update(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as ILevel;
      const levelUpdateData = {
        id: body.id ?? '',
        description: body.description ?? '',
        points: body.points ?? 0,
        isActive: body.isActive ?? true,
      };
      const result = await this.levelUseCases.update(levelUpdateData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const findByIdData = { id };
      const result = await this.levelUseCases.findById(findByIdData);
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
      } as IFindAllLevelData;

      const result = await this.levelUseCases.findAll(findAllLevelsData);

      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
