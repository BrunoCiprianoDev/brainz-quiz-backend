import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { ICreateSubjectService } from '../services/createSubjectService';

export interface ICreateSubjectController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class CreateSubjectController extends ErrorHandlerControllers implements ICreateSubjectController {
  constructor(private createSubjectService: ICreateSubjectService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body = (httpContext.getRequest().body as { description: string }) ?? '';
      const description = body.description ?? '';
      const result = await this.createSubjectService.execute(description);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
