import { ErrorHandlerControllers } from '@src/domain/util/errors/errorHandler';
import { IHttpContext } from '../adapters/httpContext';
import { IOptionUseCases } from '@src/domain/useCases/optionUseCases';
import { IOption, IOptionCreateData } from '@src/domain/util/models/optionsModels';

export interface IOptionControllers {
  create(httpContext: IHttpContext): Promise<void>;
  update(httpContext: IHttpContext): Promise<void>;
  findById(httpContext: IHttpContext): Promise<void>;
  findAllByQuestionId(httpContext: IHttpContext): Promise<void>;
  delete(httpContext: IHttpContext): Promise<void>;
}

export class OptionControllers extends ErrorHandlerControllers implements IOptionControllers {
  constructor(private optionUseCases: IOptionUseCases) {
    super();
  }
  public async create(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IOptionCreateData;
      const optionCreateData = {
        questionId: body.questionId ?? '',
        optionsWithoutId: body.optionsWithoutId ?? [],
      };
      const result = await this.optionUseCases.create(optionCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async update(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IOption;
      const optionUpdateData = {
        id: body.id ?? '',
        questionId: body.questionId ?? '',
        description: body.description ?? '',
        isCorrect: body.isCorrect ?? true,
      };
      const result = await this.optionUseCases.update(optionUpdateData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const findByIdData = { id };
      const result = await this.optionUseCases.findById(findByIdData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findAllByQuestionId(httpContext: IHttpContext): Promise<void> {
    try {
      const questionId = (httpContext.getRequest().params?.questionId as string) ?? '';
      const findAllByQuestionId = { questionId };
      const result = await this.optionUseCases.findAllByQuestionId(findAllByQuestionId);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async delete(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const deleteData = { id };
      await this.optionUseCases.delete(deleteData);
      httpContext.send({ statusCode: 204, body: {} });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }
}
