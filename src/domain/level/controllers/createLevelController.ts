import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { ICreateLevelService } from '../services/createLevelService';

export interface ICreateLevelController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class CreateLevelController extends ErrorHandlerControllers implements ICreateLevelController {
  constructor(private createLevelService: ICreateLevelService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body = (httpContext.getRequest().body as { description: string, points: number }) ?? '';
      const description = body.description ?? '';
      const points = body.points ?? 0;
      const result = await this.createLevelService.execute({ description, points });
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}