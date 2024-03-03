import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { IFindAllUsersData, IFindAllUsersService } from '../services/findAllUsersService';

export interface IFindAllUsersController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class FindAllUsersController extends ErrorHandlerControllers implements IFindAllUsersController {
  constructor(private findAllUsersService: IFindAllUsersService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const query = httpContext.getRequest().query ?? null;
      let page: number | undefined = 1;
      let size: number = 5;

      if (query?.page !== undefined && !isNaN(Number(query.page))) {
        page = Number(query.page);
      }

      if (query?.size !== undefined && !isNaN(Number(query.size))) {
        size = Number(query.size);
      }

      const findAllUsers = {
        page,
        size,
        contains: query?.contains ?? '',
      } as IFindAllUsersData;

      const result = await this.findAllUsersService.execute(findAllUsers);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }

  }
}
