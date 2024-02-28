import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IUpdatePasswordService } from '../services/updatePasswordService';

export interface IUpdatePasswordController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class UpdatePasswordController extends ErrorHandlerControllers implements IUpdatePasswordController {
  constructor(private updatePasswordService: IUpdatePasswordService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body =
        (httpContext.getRequest().body as { token: string; password: string; confirmPassword: string }) ?? '';
      const data = {
        token: body.token ?? '',
        password: body.password ?? '',
        confirmPassword: body.confirmPassword ?? '',
      };
      await this.updatePasswordService.execute(data);
      httpContext.send({ statusCode: 204, body: {} });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
