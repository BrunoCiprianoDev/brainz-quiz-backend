import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IUpdateNameProfileService } from '../service/updateNameProfileService';

export interface IUpdateNameProfileController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class UpdateNameProfileController extends ErrorHandlerControllers implements IUpdateNameProfileController {
  constructor(private updateNameProfileService: IUpdateNameProfileService) {
    super();
  }

  public async execute(httpContext: IHttpContext) {
    try {
      const body = (httpContext.getRequest().body as { id: string; name: string }) ?? '';
      const data = {
        id: body.id ?? '',
        name: body.name ?? '',
      };
      const result = await this.updateNameProfileService.execute(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
