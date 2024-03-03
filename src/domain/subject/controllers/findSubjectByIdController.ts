import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IFindSubjectByIdService } from '../services/findSubjectByIdService';

export interface IFindSubjectByIdController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class FindSubjectByIdController extends ErrorHandlerControllers implements IFindSubjectByIdController {
  constructor(private findSubjectByIdService: IFindSubjectByIdService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().query?.id as string) ?? '';
      const result = await this.findSubjectByIdService.execute(id);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
