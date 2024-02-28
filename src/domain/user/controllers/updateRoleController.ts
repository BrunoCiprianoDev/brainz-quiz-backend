import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IUpdateRoleService } from '../services/updateRoleService';

export interface IUpdateRoleController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class UpdateRoleController extends ErrorHandlerControllers implements IUpdateRoleController {
  constructor(private updateRoleService: IUpdateRoleService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body = (httpContext.getRequest().body as { id: string; role: string }) ?? '';
      const id = body.id ?? '';
      const role = body.role ?? '';
      const result = await this.updateRoleService.execute({ id, role });
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
