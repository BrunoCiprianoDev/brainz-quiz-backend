import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IGetTokenUpdatePasswordService } from '../services/getTokenUpdatePasswordService';

export interface IGetTokenUpdatePasswordController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class GetTokenUpdatePasswordController
  extends ErrorHandlerControllers
  implements IGetTokenUpdatePasswordController
{
  constructor(private getTokenUpdatePasswordService: IGetTokenUpdatePasswordService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const email = (httpContext.getRequest().query?.email as string) ?? '';
      await this.getTokenUpdatePasswordService.execute(email);
      httpContext.send({ statusCode: 204, body: {} });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
