import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { ICreateProfileService } from '../service/createProfileService';

export interface ICreateProfileController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class CreateProfileController extends ErrorHandlerControllers implements ICreateProfileController {
  constructor(private createProfileService: ICreateProfileService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body = (httpContext.getRequest().body as { name: string; userId: string }) ?? '';
      const data = {
        name: body.name ?? '',
        userId: body.userId ?? '',
      };
      const result = await this.createProfileService.execute(data);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
