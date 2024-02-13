import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import { IHttpContext } from '../adapters/httpContext';
import BaseController from './baseController';
import { IUserCreateData } from '@src/domain/entities/user';
import { RoleEnum } from '@src/domain/entities/role';

export interface IUserController {
  createPlayer(httpContext: IHttpContext): Promise<void>;

  createAdmin(httpContext: IHttpContext): Promise<void>;

  updateRole(httpContext: IHttpContext): Promise<void>;

  updateName(httpContext: IHttpContext): Promise<void>;

  updateAvatar(httpContext: IHttpContext): Promise<void>;

  updateScore(httpContext: IHttpContext): Promise<void>;

  findById(httpContext: IHttpContext): Promise<void>;

  findAll(httpContext: IHttpContext): Promise<void>;
}

export class UserController extends BaseController implements IUserController {
  constructor(private userUseCase: IUserUseCases) {
    super();
  }

  /**
   * @POST
   */
  public async createAdmin(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IUserCreateData;
      const userCreateData = {
        name: (body.name as string) ?? '',
        email: (body.email as string) ?? '',
        avatar: (body.avatar as string) ?? '',
        password: (body.password as string) ?? '',
        role: RoleEnum.Admin,
      };
      const result = await this.userUseCase.create(userCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  /**
   * @POST
   */
  public async createPlayer(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IUserCreateData;
      const userCreateData = {
        name: (body.name as string) ?? '',
        email: (body.email as string) ?? '',
        avatar: (body.avatar as string) ?? '',
        password: (body.password as string) ?? '',
        role: RoleEnum.Player,
      };
      const result = await this.userUseCase.create(userCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  /**
   * @PATCH
   */
  public async updateRole(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as { id: string; role: string };
      const data = {
        id: (body.id as string) ?? '',
        role: (body.role as string) ?? '',
      };
      const result = await this.userUseCase.updateRole(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  /**
   * @PATCH
   */
  public async updateName(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as { id: string; name: string };
      const data = {
        id: (body.id as string) ?? '',
        name: (body.name as string) ?? '',
      };
      const result = await this.userUseCase.updateName(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  /**
   * @PATCH
   */
  public async updateAvatar(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as { id: string; avatar: string };
      const data = {
        id: (body.id as string) ?? '',
        avatar: (body.avatar as string) ?? '',
      };
      const result = await this.userUseCase.updateAvatar(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  /**
   * @PATCH
   */
  async updateScore(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as { id: string; score: number };
      const data = {
        id: (body.id as string) ?? '',
        score: (body.score as number) ?? -1,
      };
      const result = await this.userUseCase.updateScore(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  /**
   * @GET
   */
  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const result = await this.userUseCase.findById({ id });
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  /**
   * @GET
   */
  public async findAll(httpContext: IHttpContext): Promise<void> {
    try {
      const query = (httpContext.getRequest().query as { query: string; page: number; size: number }) ?? {};
      const data = {
        query: (query.query as string) ?? '',
        size: (query.size as number) ?? 0,
        page: (query.page as number) ?? 0,
      };
      const result = await this.userUseCase.findAll(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
