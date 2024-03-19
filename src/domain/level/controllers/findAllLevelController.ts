import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IFindAllLevelsService } from '../services/findAllLevelsService';

export interface IFindAllLevelsController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class FindAllLevelsController extends ErrorHandlerControllers implements IFindAllLevelsController {
  constructor(private findAllLevelsService: IFindAllLevelsService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const query = httpContext.getRequest().query ?? null;
      let page: number = 1;
      let size: number = 5;
      let isDeleted: boolean = false;

      if (query?.page !== undefined && !isNaN(Number(query.page))) {
        page = Number(query.page);
      }

      if (query?.size !== undefined && !isNaN(Number(query.size))) {
        size = Number(query.size);
      }

      if (typeof query?.isDeleted === 'boolean') {
        isDeleted = query.isDeleted;
      } else if (typeof query?.isDeleted === 'string') {
        isDeleted = query.isDeleted.toLowerCase() === 'true';
      }

      const data = {
        contains: (query?.contains as string) ?? '',
        page: page,
        size: size,
        isDeleted: isDeleted,
      };
      const result = await this.findAllLevelsService.execute(data);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}