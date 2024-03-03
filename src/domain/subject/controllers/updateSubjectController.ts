import { IHttpContext } from '../../util/adapters/httpContext';
import { ErrorHandlerControllers } from '../../util/errors/handlerError';
import { ISubject } from '../models/subject';
import { IUpdateSubjectService } from '../services/updateSubjectService';

export interface IUpdateSubjectController {
  execute(httpContext: IHttpContext): Promise<void>;
}

export class UpdateSubjectController extends ErrorHandlerControllers implements UpdateSubjectController {
  constructor(private updateSubjectService: IUpdateSubjectService) {
    super();
  }

  public async execute(httpContext: IHttpContext): Promise<void> {
    try {
      const body = (httpContext.getRequest().body as ISubject) ?? '';
      const subjectUpdated = {
        id: body.id ?? '',
        description: body.description ?? '',
        isDeleted: body.isDeleted ?? false,
      };
      const result = await this.updateSubjectService.execute(subjectUpdated);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
