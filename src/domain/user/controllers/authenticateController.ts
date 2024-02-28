import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IAuthenticateService } from '../services/authenticateService';

export interface IAuthenticateController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class AuthenticateController extends ErrorHandlerControllers implements IAuthenticateController {
  constructor(private authenticateService: IAuthenticateService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body = (httpContext.getRequest().body as { email: string; password: string }) ?? '';
      const credentials = {
        email: body.email ?? '',
        password: body.password ?? '',
      };
      const result = await this.authenticateService.execute(credentials);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
