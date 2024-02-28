import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IFindUserByIdService } from '../services/findUserByIdService';

export interface IFindByIdUsersController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class FindByIdUsersController extends ErrorHandlerControllers implements IFindByIdUsersController {
  constructor(private findByIdService: IFindUserByIdService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().query?.id as string) ?? '';
      const result = await this.findByIdService.execute(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
