import { ErrorHandlerControllers } from '@src/domain/util/errors/errorHandler';
import { IHttpContext } from '../adapters/httpContext';
import { IUserUseCases } from '@src/domain/useCases/userUseCases';
import {
  IAuthenticateData,
  IFindAllUsersData,
  IUpdatePasswordByEmailData,
  IUpdateUserPasswordData,
  IUpdateUserRoleData,
  IUserCreateData,
} from '@src/domain/util/models/userModels';
import { RoleEnum } from '@src/domain/entities/user';

export interface IUserControllers {
  createAdmin(httpContext: IHttpContext): Promise<void>;
  createPlayer(httpContext: IHttpContext): Promise<void>;
  updateRole(httpContext: IHttpContext): Promise<void>;
  updatePassword(httpContext: IHttpContext): Promise<void>;
  findById(httpContext: IHttpContext): Promise<void>;
  findAll(httpContext: IHttpContext): Promise<void>;
  authenticate(httpContext: IHttpContext): Promise<void>;
  sendTokenUpdatePasswordByEmail(httpContext: IHttpContext): Promise<void>;
}

export class UserControllers extends ErrorHandlerControllers implements IUserControllers {
  constructor(private userUseCases: IUserUseCases) {
    super();
  }

  public async createAdmin(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IUserCreateData;
      const userCreateData = {
        email: body.email ?? '',
        password: body.password ?? '',
        confirmPassword: body.password ?? '',
        role: RoleEnum.Admin,
      };
      const result = await this.userUseCases.create(userCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async createPlayer(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IUserCreateData;
      const userCreateData = {
        email: body.email ?? '',
        password: body.password ?? '',
        confirmPassword: body.password ?? '',
        role: RoleEnum.Player,
      };
      const result = await this.userUseCases.create(userCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async updateRole(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IUpdateUserRoleData;
      const updateUserRoleData = {
        id: body.id ?? '',
        role: body.role ?? '',
      };
      const result = await this.userUseCases.updateRole(updateUserRoleData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async updatePassword(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IUpdateUserPasswordData;
      const updateUserPasswordData = {
        token: body.token ?? '',
        password: body.password ?? '',
        confirmPassword: body.confirmPassword ?? '',
      };
      const result = await this.userUseCases.updatePassword(updateUserPasswordData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const findByIdData = { id };
      const result = await this.userUseCases.findById(findByIdData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findAll(httpContext: IHttpContext): Promise<void> {
    try {
      const query = httpContext.getRequest().query ?? null;
      const findAllUsersData = {
        page: query?.page ?? 0,
        size: query?.size ?? 0,
        query: query?.query ?? '',
      } as IFindAllUsersData;

      const result = await this.userUseCases.findAll(findAllUsersData);

      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async sendTokenUpdatePasswordByEmail(httpContext: IHttpContext): Promise<void> {
    try {
      const query = httpContext.getRequest().query ?? null;
      const updatePasswordData = {
        email: query?.email ?? '',
      } as IUpdatePasswordByEmailData;

      await this.userUseCases.sendTokenUpdatePasswordByEmail(updatePasswordData);

      httpContext.send({ statusCode: 204, body: {} });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async authenticate(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IAuthenticateData;
      const authenticateData = {
        email: body.email ?? '',
        password: body.password ?? '',
      };

      const result = await this.userUseCases.authenticate(authenticateData);

      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
