import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IAddScorePointsService } from '../service/addScorePointsService';

export interface IAddScorePointsController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class AddScorePointsController extends ErrorHandlerControllers implements IAddScorePointsController {
  constructor(private addScorePointsService: IAddScorePointsService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      let points: number = 0;

      const body = httpContext.getRequest().body as { id: string; points: number | undefined } | null;

      if (body?.points !== undefined && !isNaN(Number(body.points))) {
        points = Number(body.points);
      }

      const data = {
        id: body?.id ?? '',
        points,
      };

      const result = await this.addScorePointsService.execute(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
