import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IFindLevelByIdService } from '../services/findLevelByIdService';

export interface IFindLevelByIdController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class FindLevelByIdController extends ErrorHandlerControllers implements IFindLevelByIdController {
  constructor(private findLevelByIdService: IFindLevelByIdService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().query?.id as string) ?? '';
      const result = await this.findLevelByIdService.execute(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
