import { ErrorHandlerControllers } from "@src/domain/util/errors/errorHandler";
import { IHttpContext } from "../adapters/httpContext";
import { IQuestionUseCases } from "@src/domain/useCases/questionUseCases";
import { IFindAllQuestionData, IFindQuestionData, IQuestionCreateData, IQuestionUpdateData } from "@src/domain/util/models/questionModels";

export interface IQuestionControllers {
  create(httpContext: IHttpContext): Promise<void>;
  update(httpContext: IHttpContext): Promise<void>;
  findById(httpContext: IHttpContext): Promise<void>;
  findAll(httpContext: IHttpContext): Promise<void>;
  findQuestion(httpContext: IHttpContext): Promise<void>;
  delete(httpContext: IHttpContext): Promise<void>;
}

export class QuestionControllers extends ErrorHandlerControllers implements IQuestionControllers {

  constructor(private questionUseCases: IQuestionUseCases) {
    super();
  }

  public async create(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IQuestionCreateData;
      const questionCreateData = {
        levelId: body.levelId ?? '',
        subjectId: body.subjectId ?? '',
        description: body.description ?? '',
      };
      const result = await this.questionUseCases.create(questionCreateData);
      httpContext.send({ statusCode: 201, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async update(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IQuestionUpdateData;
      const questionUpdateData = {
        levelId: body.levelId ?? '',
        subjectId: body.subjectId ?? '',
        description: body.description ?? '',
        id: body.id ?? ''
      };
      const result = await this.questionUseCases.update(questionUpdateData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findById(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const findByIdData = { id };
      const result = await this.questionUseCases.findById(findByIdData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findAll(httpContext: IHttpContext): Promise<void> {
    try {
      const query = httpContext.getRequest().query ?? null;
      const findAllQuestionsData = {
        page: query?.page ?? 0,
        size: query?.size ?? 0,
        query: query?.query ?? '',
      } as IFindAllQuestionData;

      const result = await this.questionUseCases.findAll(findAllQuestionsData);

      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async findQuestion(httpContext: IHttpContext): Promise<void> {
    try {
      const body = httpContext.getRequest().body as IFindQuestionData;
      const findQuestionData = {
        levelId: body.levelId ?? '',
        subjectId: body.subjectId ?? '',
      };
      const result = await this.questionUseCases.findQuestion(findQuestionData);
      httpContext.send({ statusCode: 200, body: result });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

  public async delete(httpContext: IHttpContext): Promise<void> {
    try {
      const id = (httpContext.getRequest().params?.id as string) ?? '';
      const deleteQuestionData = { id };
      await this.questionUseCases.delete(deleteQuestionData);
      httpContext.send({ statusCode: 204, body: {} });
    } catch (error) {
      httpContext.send(this.handleClientErrors(error));
    }
  }

}