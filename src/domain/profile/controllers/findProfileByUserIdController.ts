import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IFindProfileByUserIdService } from '../service/findProfileByUserIdService';

export interface IFindProfileByUserIdController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class FindProfileByUserIdController extends ErrorHandlerControllers implements IFindProfileByUserIdController {
  constructor(private findProfileByUserIdService: IFindProfileByUserIdService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const userId = (httpContext.getRequest().query?.userId as string) ?? '';
      const result = await this.findProfileByUserIdService.execute(userId);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
