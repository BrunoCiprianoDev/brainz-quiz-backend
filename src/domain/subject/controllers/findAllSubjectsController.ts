import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IFindAllSubjectsService } from '../services/findAllSubjectsService';

export interface IFindAllSubjectsController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class FindAllSubjectsController extends ErrorHandlerControllers implements IFindAllSubjectsController {
  constructor(private findAllSubjectsService: IFindAllSubjectsService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const query =
        (httpContext.getRequest().query as {
          contains: string;
          page: number;
          size: number;
          isDeleted: boolean;
        }) ?? '';
      const data = {
        contains: query.contains ?? '',
        page: query.page ?? 0,
        size: query.size ?? 0,
        isDeleted: query.isDeleted ?? false,
      };
      const result = await this.findAllSubjectsService.execute(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
