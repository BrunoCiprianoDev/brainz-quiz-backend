import { ErrorHandlerControllers } from '@src/domain/util/errors/errorHandler';
import { IHttpContext } from '../adapters/httpContext';
import { IProfileUseCases } from '@src/domain/useCases/profileUseCases';
import { IFindAllProfilesData, IProfile, IProfileCreateData } from '@src/domain/util/models/profileModels';

export interface IProfileControllers {
  create(httpContext: IHttpContext): Promise<void>;
  update(httpContext: IHttpContext): Promise<void>;
  findAll(httpContext: IHttpContext): Promise<void>;
  findById(httpContext: IHttpContext): Promise<void>;
  findProfileByUserId(httpContext: IHttpContext): Promise<void>;
}

export class ProfileControllers extends ErrorHandlerControllers implements IProfileControllers {
  constructor(private profileUseCases: IProfileUseCases) {
    super();
  }
  public async create(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IProfileCreateData;
      const profileCreateData = {
        userId: body.userId ?? '',
        name: body.name ?? '',
        score: body.score ?? 0,
      };
      const result = await this.profileUseCases.create(profileCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async update(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IProfile;
      const profileData = {
        id: body.id ?? '',
        userId: body.userId ?? '',
        name: body.name ?? '',
        score: body.score ?? 0,
      };
      const result = await this.profileUseCases.update(profileData);
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
      } as IFindAllProfilesData;

      const result = await this.profileUseCases.findAll(findAllLevelsData);

      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const findByIdData = { id };
      const result = await this.profileUseCases.findById(findByIdData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
  public async findProfileByUserId(httpContext: IHttpContext): Promise<void> {
    try {
      const userId = (httpContext.getRequest().params?.userId as string) ?? '';
      const findProfileBYUserIdData = { userId };
      const result = await this.profileUseCases.findProfileByUserId(findProfileBYUserIdData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
