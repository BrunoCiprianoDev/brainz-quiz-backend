import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { ILevel } from '../models/level';
import { IUpdateLevelService } from '../services/updateLevelService';

export interface IUpdateLevelController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class UpdateLevelController extends ErrorHandlerControllers implements IUpdateLevelController {
  constructor(private updateLevelService: IUpdateLevelService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body = (httpContext.getRequest().body as ILevel) ?? '';
      const levelUpdated = {
        id: body.id ?? '',
        description: body.description ?? '',
        points: body.points ?? 0,
        isDeleted: body.isDeleted ?? false,
      };
      const result = await this.updateLevelService.execute(levelUpdated);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
